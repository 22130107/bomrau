"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

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

export interface SpinCategoryInfo {
  id: number;
  name: string;
  is_spin_enabled: boolean;
  available_accounts: number;
}
