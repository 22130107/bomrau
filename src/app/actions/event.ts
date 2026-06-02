"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { RowDataPacket } from "mysql2";

export interface AdminEvent {
  id: number;
  name: string;
  bonus_amount: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_distributed: boolean;
  created_at: string;
}

export async function getEventsAction(): Promise<AdminEvent[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, bonus_amount, start_date, end_date, is_active, is_distributed, created_at FROM events ORDER BY id DESC"
  );
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    bonus_amount: Number(r.bonus_amount),
    start_date: r.start_date instanceof Date ? r.start_date.toISOString().slice(0, 16) : new Date(r.start_date).toISOString().slice(0, 16),
    end_date: r.end_date instanceof Date ? r.end_date.toISOString().slice(0, 16) : new Date(r.end_date).toISOString().slice(0, 16),
    is_active: Boolean(r.is_active),
    is_distributed: Boolean(r.is_distributed),
    created_at: r.created_at instanceof Date ? r.created_at.toISOString().slice(0, 16) : new Date(r.created_at).toISOString().slice(0, 16),
  }));
}

export async function createEventAction(data: {
  name: string;
  bonus_amount: number;
  start_date: string;
  end_date: string;
}) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    if (!data.name || !data.bonus_amount || !data.start_date || !data.end_date) {
      return { error: "Vui lòng nhập đủ thông tin" };
    }

    await pool.query(
      "INSERT INTO events (name, bonus_amount, start_date, end_date) VALUES (?, ?, ?, ?)",
      [data.name, data.bonus_amount, data.start_date, data.end_date]
    );

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Create event error:", error);
    return { error: "Lỗi hệ thống: " + (error.message || "Unknown error") };
  }
}

export async function deleteEventAction(id: number) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    await pool.query("DELETE FROM events WHERE id = ?", [id]);

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Delete event error:", error);
    return { error: "Lỗi hệ thống: " + (error.message || "Unknown error") };
  }
}

export async function distributeBonusAction(eventId: number) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    const [eventRows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, bonus_amount, start_date, end_date, is_distributed FROM events WHERE id = ?",
      [eventId]
    );
    if (eventRows.length === 0) return { error: "Sự kiện không tồn tại" };
    const event = eventRows[0];
    if (event.is_distributed) return { error: "Sự kiện này đã được phát thưởng" };

    const [userRows] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM users
       WHERE google_id IS NOT NULL AND google_id != ''
         AND created_at >= ? AND created_at <= ?
         AND is_active = 1`,
      [event.start_date, event.end_date]
    );

    if (userRows.length === 0) {
      return { error: "Không có tài khoản Gmail nào đủ điều kiện" };
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (const u of userRows) {
        await conn.query("UPDATE users SET balance = balance + ? WHERE id = ?", [event.bonus_amount, u.id]);
      }
      await conn.query("UPDATE events SET is_distributed = 1 WHERE id = ?", [eventId]);
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    revalidatePath("/admin");
    return { success: true, count: userRows.length, total: Number(event.bonus_amount) * userRows.length };
  } catch (error: any) {
    console.error("Distribute bonus error:", error);
    return { error: "Lỗi hệ thống: " + (error.message || "Unknown error") };
  }
}
