"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { RowDataPacket } from "mysql2";
import { headers } from "next/headers";

async function getSpinCostFromDB(): Promise<number> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT `value` FROM settings WHERE `key` = 'spin_cost' LIMIT 1"
    );
    return rows.length > 0 ? Number(rows[0].value) : 10000;
  } catch {
    return 10000;
  }
}

export async function spinAction() {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Vui lòng đăng nhập để quay random." };
    }
    const userId = session.userId;

    const spinCost = await getSpinCostFromDB();

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Khoa va kiem tra so du user
      const [users] = await connection.query<RowDataPacket[]>(
        "SELECT balance FROM users WHERE id = ? FOR UPDATE",
        [userId]
      );
      if (users.length === 0) {
        await connection.rollback();
        return { error: "Không tìm thấy thông tin tài khoản." };
      }
      const balance = Number(users[0].balance);
      if (balance < spinCost) {
        await connection.rollback();
        return { error: `Số dư không đủ. Cần ít nhất ${spinCost.toLocaleString("vi-VN")}đ để quay.` };
      }

      // 2. Chon random 1 account tu cac danh muc duoc phep quay
      const [accounts] = await connection.query<RowDataPacket[]>(`
        SELECT a.id, a.login_username, a.login_password,
               p.id as product_id, p.title as product_title, p.image_url as product_image,
               c.name as category_name, c.slug as category_slug, c.image_url as category_image
        FROM accounts a
        JOIN products p ON a.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        WHERE a.status = 'available'
          AND p.status = 'available'
          AND (
            c.is_spin_enabled = 1
            OR EXISTS (
              SELECT 1 FROM categories ec
              WHERE ec.is_spin_enabled = 1
                AND JSON_CONTAINS(p.extra_categories, CAST(ec.id AS JSON))
            )
          )
        ORDER BY RAND()
        LIMIT 1
        FOR UPDATE
      `);

      if (accounts.length === 0) {
        await connection.rollback();
        return { error: "Hiện tại chưa có tài khoản nào trong vòng quay. Vui lòng quay lại sau." };
      }

      const account = accounts[0];
      const price = spinCost;

      // 3. Tru tien user
      await connection.query(
        "UPDATE users SET balance = balance - ? WHERE id = ?",
        [price, userId]
      );

      // 4. Danh dau account da ban
      await connection.query(
        "UPDATE accounts SET status = 'sold' WHERE id = ?",
        [account.id]
      );

      // 5. Xac dinh NPP va domain
      const headersList = await headers();
      const host = headersList.get("host") || "";
      let distributorId: number | null = null;
      if (host) {
        const domainName = host.split(":")[0];
        const [distributors] = await connection.query<RowDataPacket[]>(
          "SELECT id FROM distributors WHERE domain = ? AND is_active = 1 LIMIT 1",
          [domainName]
        );
        if (distributors.length > 0) {
          distributorId = distributors[0].id;
        }
      }

      // 6. Tao don hang
      const [orderResult] = await connection.query(
        `INSERT INTO orders (user_id, product_id, account_id, distributor_id, amount, status, domain_purchased)
         VALUES (?, ?, ?, ?, ?, 'completed', ?)`,
        [userId, account.product_id, account.id, distributorId, price, host]
      );
      const orderId = (orderResult as any).insertId;

      // 7. Tao giao dich
      await connection.query(
        `INSERT INTO transactions (user_id, type, amount, status, description, reference_id)
         VALUES (?, 'purchase', ?, 'completed', ?, ?)`,
        [
          userId,
          price,
          `Quay random: ${account.product_title}`,
          `ORDER_${orderId}`
        ]
      );

      await connection.commit();

      revalidatePath("/profile");
      revalidatePath("/random");

      return {
        success: true,
        category: {
          name: account.category_name,
          slug: account.category_slug,
          image_url: account.category_image || "",
        },
        product: {
          title: account.product_title,
          image_url: account.product_image || "",
        },
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
    console.error("Spin action error:", error);
    return { error: "Lỗi hệ thống: " + (error.message || "Unknown error") };
  }
}
