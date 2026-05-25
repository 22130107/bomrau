"use server";

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
}

export async function createDistributorAction(data: DistributorFormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    if (!data.name || !data.domain) {
      return { error: "Vui lòng nhập tên và tên miền" };
    }

    const [existing] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM distributors WHERE domain = ?", [data.domain]
    );
    if (existing.length > 0) return { error: "Tên miền đã tồn tại" };

    await pool.query(
      `INSERT INTO distributors (name, domain, phone, email, address, contact_info, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [data.name, data.domain, data.phone || null, data.email || null, data.address || null, data.contact_info || null]
    );

    revalidatePath("/admin");
    return { success: true };
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
      "SELECT is_active FROM distributors WHERE id = ?", [id]
    );
    if (rows.length === 0) return { error: "Không tìm thấy NPP" };

    const newStatus = rows[0].is_active ? 0 : 1;
    await pool.query("UPDATE distributors SET is_active = ? WHERE id = ?", [newStatus, id]);

    revalidatePath("/admin");
    return { success: true, newStatus: !!newStatus };
  } catch (error: any) {
    console.error("Toggle distributor status error:", error);
    return { error: "Lỗi hệ thống: " + (error.message || "Unknown error") };
  }
}
