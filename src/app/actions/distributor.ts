"use server";

import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { RowDataPacket } from "mysql2";

export interface DistributorFormData {
  name: string;
  domain: string;
  phone?: string;
  email?: string;
  address?: string;
  contact_info?: string;
  username?: string;
  password?: string;
}

export async function createDistributorAction(data: DistributorFormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    if (!data.name || !data.domain) {
      return { error: "Vui lòng nhập tên và tên miền" };
    }
    if (!data.username || !data.password) {
      return { error: "Vui lòng nhập tên đăng nhập và mật khẩu cho NPP" };
    }

    const [existingDomain] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM distributors WHERE domain = ?", [data.domain]
    );
    if (existingDomain.length > 0) return { error: "Tên miền đã tồn tại" };

    const [existingUser] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE username = ?", [data.username]
    );
    if (existingUser.length > 0) return { error: "Tên đăng nhập đã tồn tại" };

    const passwordHash = await bcrypt.hash(data.password, 10);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [userResult] = await connection.query(
        "INSERT INTO users (username, email, password_hash, role, balance, is_active) VALUES (?, ?, ?, 'npp', 0, 1)",
        [data.username, data.email || null, passwordHash]
      );
      const userId = (userResult as any).insertId;

      await connection.query(
        `INSERT INTO distributors (user_id, name, domain, phone, email, address, contact_info, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [userId, data.name, data.domain, data.phone || null, data.email || null, data.address || null, data.contact_info || null]
      );

      await connection.commit();
      revalidatePath("/admin");
      return { success: true };
    } catch (err: any) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("Create distributor error:", error);
    return { error: "Lỗi hệ thống: " + (error.message || "Unknown error") };
  }
}

export async function updateDistributorAction(id: number, data: DistributorFormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    if (!data.name || !data.domain) {
      return { error: "Vui lòng nhập tên và tên miền" };
    }

    const [existing] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM distributors WHERE domain = ? AND id != ?", [data.domain, id]
    );
    if (existing.length > 0) return { error: "Tên miền đã tồn tại" };

    await pool.query(
      `UPDATE distributors SET name=?, domain=?, phone=?, email=?, address=?, contact_info=? WHERE id=?`,
      [data.name, data.domain, data.phone || null, data.email || null, data.address || null, data.contact_info || null, id]
    );

    if (data.password) {
      const [dist] = await pool.query<RowDataPacket[]>(
        "SELECT user_id FROM distributors WHERE id = ?", [id]
      );
      if (dist.length > 0 && dist[0].user_id) {
        const passwordHash = await bcrypt.hash(data.password, 10);
        await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, dist[0].user_id]);
      }
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Update distributor error:", error);
    return { error: "Lỗi hệ thống: " + (error.message || "Unknown error") };
  }
}

export async function toggleDistributorStatusAction(id: number) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT is_active, user_id FROM distributors WHERE id = ?", [id]
    );
    if (rows.length === 0) return { error: "Không tìm thấy NPP" };

    const newStatus = rows[0].is_active ? 0 : 1;
    await pool.query("UPDATE distributors SET is_active = ? WHERE id = ?", [newStatus, id]);

    if (rows[0].user_id) {
      await pool.query("UPDATE users SET is_active = ? WHERE id = ?", [newStatus, rows[0].user_id]);
    }

    revalidatePath("/admin");
    return { success: true, newStatus: !!newStatus };
  } catch (error: any) {
    console.error("Toggle distributor status error:", error);
    return { error: "Lỗi hệ thống: " + (error.message || "Unknown error") };
  }
}
