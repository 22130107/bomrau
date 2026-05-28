"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/session";
import { RowDataPacket } from "mysql2";

export interface SoldAccount {
  id: number;
  name: string;
  buyer: string;
  price: number;
  date: string;
}

export interface BuyerInfo {
  name: string;
  count: number;
  totalSpent: number;
  lastDate: string;
}

export interface NppDataResponse {
  success?: boolean;
  error?: string;
  distributorName?: string;
  domain?: string;
  soldAccounts?: SoldAccount[];
  buyers?: BuyerInfo[];
}

export async function getNppDataAction(): Promise<NppDataResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== "npp") {
      return { error: "Bạn không có quyền truy cập thông tin này." };
    }

    const userId = session.userId;

    // 1. Lấy thông tin distributor của user hiện tại
    const [distributors] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, domain FROM distributors WHERE user_id = ? AND is_active = 1 LIMIT 1",
      [userId]
    );

    if (distributors.length === 0) {
      return { error: "Không tìm thấy thông tin nhà phân phối của bạn." };
    }

    const distributor = distributors[0];
    const distributorId = distributor.id;

    // 2. Lấy danh sách tài khoản đã bán qua distributor này
    const [orders] = await pool.query<RowDataPacket[]>(
      `SELECT 
        o.id, 
        COALESCE(p.title, 'Sản phẩm đã xoá') as name, 
        u.username as buyer, 
        o.amount as price, 
        DATE_FORMAT(o.created_at, '%d/%m/%Y %H:%i') as date 
      FROM orders o 
      LEFT JOIN products p ON o.product_id = p.id 
      JOIN users u ON o.user_id = u.id 
      WHERE o.distributor_id = ? AND o.status = 'completed' 
      ORDER BY o.created_at DESC`,
      [distributorId]
    );

    // 3. Lấy danh sách người mua qua distributor này
    const [buyers] = await pool.query<RowDataPacket[]>(
      `SELECT 
        u.username as name, 
        COUNT(o.id) as count, 
        SUM(o.amount) as totalSpent, 
        DATE_FORMAT(MAX(o.created_at), '%d/%m/%Y %H:%i') as lastDate 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE o.distributor_id = ? AND o.status = 'completed' 
      GROUP BY u.id, u.username 
      ORDER BY totalSpent DESC`,
      [distributorId]
    );

    const soldAccountsList = orders.map((o) => ({
      id: o.id,
      name: o.name,
      buyer: o.buyer,
      price: Number(o.price),
      date: o.date,
    }));

    const buyersList = buyers.map((b) => ({
      name: b.name,
      count: Number(b.count),
      totalSpent: Number(b.totalSpent),
      lastDate: b.lastDate,
    }));

    return {
      success: true,
      distributorName: distributor.name,
      domain: distributor.domain,
      soldAccounts: soldAccountsList,
      buyers: buyersList,
    };
  } catch (error: any) {
    console.error("Get NPP data error:", error);
    return { error: "Lỗi hệ thống: " + (error.message || "Unknown error") };
  }
}
