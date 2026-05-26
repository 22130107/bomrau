"use server";

import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export interface SearchResult {
  id: number;
  title: string;
  price: number;
  image_url: string;
  category_slug: string;
  category_name: string;
}

export async function searchAction(query: string): Promise<SearchResult[]> {
  try {
    if (!query || query.trim().length < 1) return [];

    const q = `%${query.trim()}%`;
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.id, p.title, p.price, p.image_url,
              c.slug as category_slug, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.status = 'available' AND EXISTS (SELECT 1 FROM accounts WHERE product_id = p.id AND status = 'available')
         AND (p.title LIKE ? OR p.pet_tim LIKE ? OR p.san_tim LIKE ? OR p.chuong LIKE ? OR p.extra_info LIKE ?)
       ORDER BY
         CASE
           WHEN p.title LIKE ? THEN 0
           WHEN p.pet_tim LIKE ? THEN 1
           WHEN p.san_tim LIKE ? THEN 2
           WHEN p.chuong LIKE ? THEN 3
           ELSE 4
         END,
         p.id DESC
       LIMIT 10`,
      [q, q, q, q, q, q, q, q, q]
    );

    return rows.map(r => ({
      id: r.id,
      title: r.title,
      price: Number(r.price),
      image_url: r.image_url || "",
      category_slug: r.category_slug || "",
      category_name: r.category_name || "",
    }));
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
