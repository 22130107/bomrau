import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function POST(request: NextRequest) {
  try {
    // 1. Xác thực Webhook bằng API Key
    const authHeader = request.headers.get("authorization");
    const expectedApiKey = process.env.SEPAY_API_KEY;

    if (!expectedApiKey) {
      console.error("SEPAY_API_KEY is not configured in .env");
      return NextResponse.json({ error: "Internal Server Configuration Error" }, { status: 500 });
    }

    if (!authHeader || authHeader !== `Apikey ${expectedApiKey}`) {
      console.warn(`Unauthorized webhook request. Authorization header: ${authHeader}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse dữ liệu giao dịch từ SePay
    const body = await request.json();
    const {
      id, // ID giao dịch duy nhất của SePay
      gateway, // Ngân hàng nhận tiền (ví dụ: MBBank)
      transferAmount, // Số tiền chuyển khoản (VND)
      transferType, // Loại giao dịch ('in' hoặc 'out')
      content, // Nội dung chuyển khoản
      code, // Mã tham chiếu của ngân hàng (FTxxxx)
    } = body;

    console.log("Received SePay Webhook:", { id, gateway, transferAmount, transferType, content, code });

    // Chỉ xử lý giao dịch tiền vào
    if (transferType !== "in") {
      return NextResponse.json({ success: true, message: "Ignored non-deposit transaction" });
    }

    const amount = Number(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid transfer amount" }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: "Transfer content is empty" }, { status: 400 });
    }

    // 3. Phân tích nội dung chuyển khoản để lấy userId và (tuỳ chọn) productId
    // Format mới: "BOMRAU NAP <userId>_P<productId>" — nạp tiền cho 1 sản phẩm cụ thể
    // Format cũ: "BOMRAU NAP <userId>" — nạp tiền thông thường
    const upperContent = content.toUpperCase();
    const matchNew = upperContent.match(/BOMRAU\s*NAP\s*(\d+)_P(\d+)/);
    const matchLegacy = upperContent.match(/BOMRAU\s*NAP\s*(\d+)/);

    if (!matchNew && !matchLegacy) {
      console.warn(`Unrecognized transfer content: "${content}"`);
      return NextResponse.json({ error: "Invalid transfer content format" }, { status: 400 });
    }

    const userId = parseInt((matchNew || matchLegacy)![1], 10);
    const productId = matchNew ? parseInt(matchNew[2], 10) : null;

    // 4. Thực hiện trong DB Transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 4.1. Kiểm tra giao dịch trùng lặp (idempotency)
      const [existingTx] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM transactions WHERE reference_id = ? LIMIT 1",
        [id.toString()]
      );
      if (existingTx.length > 0) {
        await connection.rollback();
        console.log(`Transaction ID ${id} already processed.`);
        return NextResponse.json({ success: true, message: "Transaction already processed" });
      }

      // 4.2. Kiểm tra người dùng tồn tại
      const [users] = await connection.query<RowDataPacket[]>(
        "SELECT id, username, balance FROM users WHERE id = ? LIMIT 1",
        [userId]
      );
      if (users.length === 0) {
        await connection.rollback();
        console.warn(`User ID ${userId} from transfer content does not exist.`);
        return NextResponse.json({ error: "User not found" }, { status: 400 });
      }
      const user = users[0];

      // 4.3. Cộng tiền vào ví user
      await connection.query(
        "UPDATE users SET balance = balance + ? WHERE id = ?",
        [amount, userId]
      );

      // 4.4. Lưu lịch sử giao dịch nạp tiền
      // Ghi productId vào description để frontend có thể tra cứu
      const productSuffix = productId ? ` (SP: ${productId})` : "";
      const depositDesc = `Nạp tiền tự động qua ngân hàng ${gateway} (Mã GD: ${code || id})${productSuffix}`;

      await connection.query(
        `INSERT INTO transactions (user_id, type, amount, method, status, description, reference_id)
         VALUES (?, 'deposit', ?, 'bank_transfer', 'completed', ?, ?)`,
        [userId, amount, depositDesc, id.toString()]
      );

      await connection.commit();
      console.log(`Successfully credited ${amount} VND to user ${user.username} (ID: ${userId})${productSuffix}`);

      return NextResponse.json({
        success: true,
        message: "Balance updated successfully",
      }, { status: 201 });
    } catch (dbError) {
      await connection.rollback();
      throw dbError;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("SePay Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error: " + (error.message || "Unknown error") }, { status: 500 });
  }
}
