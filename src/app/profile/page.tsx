import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileContent } from "@/components/ProfileContent";
import { getSession } from "@/lib/session";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const metadata: Metadata = {
  title: "Tài khoản của tôi - BomRauTFT",
  description: "Quản lý tài khoản, nạp tiền, xem lịch sử mua hàng tại BomRauTFT.",
};

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string | null;
  balance: number;
  role: "admin" | "npp" | "user";
  avatar_url: string | null;
  created_at: string;
}

interface OrderRow extends RowDataPacket {
  id: number;
  product_title: string;
  amount: number;
  status: "pending" | "completed" | "cancelled" | "refunded";
  created_at: string;
}

interface StatsRow extends RowDataPacket {
  total_spent: number;
  total_orders: number;
}

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // ── 1. Thông tin user đầy đủ ──────────────────────────────────────────────
  const [userRows] = await pool.query<UserRow[]>(
    `SELECT id, username, email, balance, role, avatar_url, created_at
     FROM users WHERE id = ? LIMIT 1`,
    [session.userId]
  );
  const user = userRows[0];
  if (!user) redirect("/login");

  // ── 2. Thống kê tổng hợp (tổng chi tiêu + tổng đơn) ─────────────────────
  const [statsRows] = await pool.query<StatsRow[]>(
    `SELECT
       COALESCE(SUM(amount), 0) AS total_spent,
       COUNT(*) AS total_orders
     FROM orders
     WHERE user_id = ? AND status = 'completed'`,
    [session.userId]
  );
  const stats = statsRows[0];

  // ── 3. Lịch sử mua hàng (kèm trạng thái đơn) ─────────────────────────────
  const [orderRows] = await pool.query<OrderRow[]>(
    `SELECT o.id, p.title AS product_title, o.amount, o.status, o.created_at
     FROM orders o
     JOIN products p ON o.product_id = p.id
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC
     LIMIT 50`,
    [session.userId]
  );

  return (
    <div className="pt-[70px] md:pt-[90px] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-6 md:py-10 px-4">
        <ProfileContent
          user={{
            username: user.username,
            email: user.email || "Chưa cập nhật",
            balance: Number(user.balance),
            role: user.role,
            avatarUrl: user.avatar_url,
            joinDate: new Date(user.created_at).toLocaleDateString("vi-VN"),
            totalSpent: Number(stats.total_spent),
            totalOrders: Number(stats.total_orders),
            purchasedAccounts: orderRows.map((o) => ({
              id: o.id,
              name: o.product_title,
              date: new Date(o.created_at).toLocaleDateString("vi-VN"),
              price: Number(o.amount),
              status: o.status,
            })),
          }}
        />
      </main>
      <Footer />
    </div>
  );
}
