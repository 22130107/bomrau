"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { RowDataPacket } from "mysql2";

export interface ProductFormData {
  category_id: number;
  extra_categories: number[];
  title: string;
  image_url: string;
  price: number;
  original_price: number;
  discount_percent: number;
  fake_sold_count: number;
  fake_remaining_count: number;
  status: "available" | "hidden";
  is_pinned: boolean;
  pet_tim?: string;
  san_tim?: string;
  chuong?: string;
  extra_info?: string;
  account_username?: string;
  account_password?: string;
  account_cost_price?: number;
  account_note?: string;
}

export async function createProductAction(data: ProductFormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    if (!data.title || !data.category_id || data.price == null) {
      return { error: "Vui lòng nhập đủ các trường bắt buộc" };
    }

    const fakeSold = data.fake_sold_count || 0;
    const fakeRemaining = data.fake_remaining_count || 0;

    const [result] = await pool.query(
      `INSERT INTO products (
        category_id, extra_categories, title, image_url, price, original_price, discount_percent, 
        fake_sold_count, fake_remaining_count, status, is_pinned, pet_tim, san_tim, chuong, extra_info
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.category_id, JSON.stringify(data.extra_categories || []), data.title, data.image_url || "", data.price, data.original_price || 0,
        Math.max(0, Math.min(255, data.discount_percent || 0)), fakeSold, fakeRemaining,
        data.status || "available", data.is_pinned ? 1 : 0, data.pet_tim || null, data.san_tim || null, data.chuong || null, data.extra_info || null
      ]
    );

    // Nếu có nhập tài khoản thì tạo luôn 1 account cho sản phẩm vừa tạo
    if (data.account_username && data.account_password) {
      const productId = (result as any).insertId;
      await pool.query(
        `INSERT INTO accounts (product_id, distributor_id, login_username, login_password, cost_price, status, note)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          productId, null, data.account_username, data.account_password,
          data.account_cost_price || 0, "available", data.account_note || ""
        ]
      );
    }

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

    let fakeSold = data.fake_sold_count || 0;
    let fakeRemaining = data.fake_remaining_count || 0;

    if (!fakeSold && !fakeRemaining) {
      const [countRows] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) as total FROM accounts WHERE product_id = ?",
        [id]
      );
      const [soldRows] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) as total FROM accounts WHERE product_id = ? AND status = 'sold'",
        [id]
      );
      const totalAccounts = Number(countRows[0].total) || 0;
      const soldAccounts = Number(soldRows[0].total) || 0;
      fakeSold = soldAccounts;
      fakeRemaining = totalAccounts - soldAccounts;
    }

    await pool.query(
      `UPDATE products SET 
        category_id=?, extra_categories=?, title=?, image_url=?, price=?, original_price=?, 
        discount_percent=?, fake_sold_count=?, fake_remaining_count=?, status=?, is_pinned=?,
        pet_tim=?, san_tim=?, chuong=?, extra_info=?
      WHERE id=?`,
      [
        data.category_id, JSON.stringify(data.extra_categories || []), data.title, data.image_url || "", data.price, data.original_price || 0,
        Math.max(0, Math.min(255, data.discount_percent || 0)), fakeSold, fakeRemaining,
        data.status || "available", data.is_pinned ? 1 : 0, data.pet_tim || null, data.san_tim || null, data.chuong || null, data.extra_info || null, id
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

export async function togglePinProductAction(id: number) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    await pool.query(
      "UPDATE products SET is_pinned = NOT is_pinned WHERE id = ?",
      [id]
    );

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Toggle pin product error:", error);
    return { error: "Lỗi hệ thống" };
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

export async function deleteMultipleProductsAction(ids: number[]) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { error: "Unauthorized" };

    if (ids.length === 0) return { error: "Chưa chọn sản phẩm nào" };

    const placeholders = ids.map(() => "?").join(",");
    await pool.query(`DELETE FROM products WHERE id IN (${placeholders})`, ids);

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Delete multiple products error:", error);
    return { error: "Lỗi hệ thống" };
  }
}
