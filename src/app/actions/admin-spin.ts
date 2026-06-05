"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { RowDataPacket } from "mysql2";

export async function toggleCategorySpinAction(categoryId: number, enabled: boolean) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    await pool.query(
      "UPDATE categories SET is_spin_enabled = ? WHERE id = ?",
      [enabled ? 1 : 0, categoryId]
    );

    revalidatePath("/admin");
    revalidatePath("/random");
    return { success: true };
  } catch (error: any) {
    console.error("Toggle spin category error:", error);
    return { error: "Loi he thong" };
  }
}

export async function getSpinCostAction() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT `value` FROM settings WHERE `key` = 'spin_cost' LIMIT 1"
    );
    return { cost: rows.length > 0 ? Number(rows[0].value) : 10000 };
  } catch (error: any) {
    console.error("Get spin cost error:", error);
    return { cost: 10000 };
  }
}

export async function updateCategorySpinPriceAction(categoryId: number, price: number | null) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    if (price !== null) {
      const validPrice = Math.max(1000, Math.min(1000000, Math.round(price)));
      await pool.query(
        "UPDATE categories SET spin_price = ? WHERE id = ?",
        [validPrice, categoryId]
      );
    } else {
      await pool.query(
        "UPDATE categories SET spin_price = NULL WHERE id = ?",
        [categoryId]
      );
    }

    revalidatePath("/admin");
    revalidatePath("/random");
    return { success: true };
  } catch (error: any) {
    console.error("Update category spin price error:", error);
    return { error: "Loi he thong" };
  }
}

export async function updateSpinCostAction(cost: number) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    const validCost = Math.max(1000, Math.min(1000000, Math.round(cost)));
    await pool.query(
      "INSERT INTO settings (`key`, `value`) VALUES ('spin_cost', ?) ON DUPLICATE KEY UPDATE `value` = ?",
      [String(validCost), String(validCost)]
    );

    revalidatePath("/admin");
    revalidatePath("/random");
    return { success: true, cost: validCost };
  } catch (error: any) {
    console.error("Update spin cost error:", error);
    return { error: "Loi he thong" };
  }
}

export interface SpinCategoryInfo {
  id: number;
  name: string;
  is_spin_enabled: boolean;
  available_accounts: number;
}
