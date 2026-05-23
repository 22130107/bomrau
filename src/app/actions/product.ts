"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { RowDataPacket } from "mysql2";

export interface ProductFormData {
  category_id: number;
  title: string;
  image_url: string;
  price: number;
  original_price: number;
  discount_percent: number;
  fake_sold_count: number;
  fake_remaining_count: number;
  status: "available" | "hidden";
  pet_tim?: string;
  san_tim?: string;
  chuong?: string;
  extra_info?: string;
}

export async function createProductAction(data: ProductFormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    if (!data.title || !data.category_id || data.price == null) {
      return { error: "Vui lòng nhập đủ các trường bắt buộc" };
    }

    await pool.query(
      `INSERT INTO products (
        category_id, title, image_url, price, original_price, discount_percent, 
        fake_sold_count, fake_remaining_count, status, pet_tim, san_tim, chuong, extra_info
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.category_id, data.title, data.image_url || "", data.price, data.original_price || 0,
        data.discount_percent || 0, data.fake_sold_count || 0, data.fake_remaining_count || 0,
        data.status || "available", data.pet_tim || null, data.san_tim || null, data.chuong || null, data.extra_info || null
      ]
    );

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Create product error:", error);
    return { error: "Lỗi hệ thống: " + (error.message || "Unknown error") };
  }
}

export async function updateProductAction(id: number, data: ProductFormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    if (!data.title || !data.category_id || data.price == null) {
      return { error: "Vui lòng nhập đủ các trường bắt buộc" };
    }

    await pool.query(
      `UPDATE products SET 
        category_id=?, title=?, image_url=?, price=?, original_price=?, 
        discount_percent=?, fake_sold_count=?, fake_remaining_count=?, status=?,
        pet_tim=?, san_tim=?, chuong=?, extra_info=?
      WHERE id=?`,
      [
        data.category_id, data.title, data.image_url || "", data.price, data.original_price || 0,
        data.discount_percent || 0, data.fake_sold_count || 0, data.fake_remaining_count || 0,
        data.status || "available", data.pet_tim || null, data.san_tim || null, data.chuong || null, data.extra_info || null, id
      ]
    );

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Update product error:", error);
    return { error: "Lỗi hệ thống: " + (error.message || "Unknown error") };
  }
}

export async function deleteProductAction(id: number) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    await pool.query("DELETE FROM products WHERE id = ?", [id]);

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Delete product error:", error);
    return { error: "Lỗi hệ thống" };
  }
}
