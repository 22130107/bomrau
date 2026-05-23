"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { RowDataPacket } from "mysql2";

export async function buyAccountAction(productId: number) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Vui lòng đăng nhập để thực hiện mua hàng." };
    }
    const userId = session.userId;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Lấy thông tin sản phẩm và khóa dòng (FOR UPDATE)
      const [products] = await connection.query<RowDataPacket[]>(
        "SELECT price, title FROM products WHERE id = ? AND status = 'available' FOR UPDATE",
        [productId]
      );
      if (products.length === 0) {
        await connection.rollback();
        return { error: "Sản phẩm không tồn tại hoặc đã hết hàng." };
      }
      const product = products[0];
      const price = Number(product.price);

      // 2. Lấy thông tin số dư của user và khóa dòng
      const [users] = await connection.query<RowDataPacket[]>(
        "SELECT balance FROM users WHERE id = ? FOR UPDATE",
        [userId]
      );
      if (users.length === 0) {
        await connection.rollback();
        return { error: "Không tìm thấy thông tin tài khoản của bạn." };
      }
      const user = users[0];
      const balance = Number(user.balance);

      // 3. Kiểm tra số dư
      if (balance < price) {
        await connection.rollback();
        return { error: "Số dư tài khoản không đủ. Vui lòng nạp thêm tiền." };
      }

      // 4. Tìm tài khoản game có sẵn trong kho
      const [accounts] = await connection.query<RowDataPacket[]>(
        "SELECT id, login_username, login_password FROM accounts WHERE product_id = ? AND status = 'available' LIMIT 1 FOR UPDATE",
        [productId]
      );
      if (accounts.length === 0) {
        await connection.rollback();
        return { error: "Sản phẩm đã hết hàng trong kho. Vui lòng quay lại sau." };
      }
      const account = accounts[0];

      // 5. Trừ tiền tài khoản người dùng
      await connection.query(
        "UPDATE users SET balance = balance - ? WHERE id = ?",
        [price, userId]
      );

      // 6. Đổi trạng thái tài khoản game sang 'sold'
      await connection.query(
        "UPDATE accounts SET status = 'sold' WHERE id = ?",
        [account.id]
      );

      // 7. Tạo đơn hàng mới
      const [orderResult] = await connection.query(
        `INSERT INTO orders (user_id, product_id, account_id, amount, status)
         VALUES (?, ?, ?, ?, 'completed')`,
        [userId, productId, account.id, price]
      );
      const orderId = (orderResult as any).insertId;

      // 8. Tạo lịch sử giao dịch
      await connection.query(
        `INSERT INTO transactions (user_id, type, amount, status, description, reference_id)
         VALUES (?, 'purchase', ?, 'completed', ?, ?)`,
        [
          userId,
          price,
          `Mua nick game: ${product.title}`,
          `ORDER_${orderId}`
        ]
      );

      await connection.commit();

      // Revalidate cache
      revalidatePath("/admin");
      revalidatePath("/profile");
      revalidatePath("/");

      return {
        success: true,
        account: {
          login_username: account.login_username,
          login_password: account.login_password,
        },
      };
    } catch (err: any) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("Purchase account action error:", error);
    return { error: "Lỗi hệ thống: " + (error.message || "Unknown error") };
  }
}
