import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminContent, AdminStats, AdminProduct, AdminAccount, AdminCategory, AdminDistributor, AdminUser, AdminOrder, AdminNotification } from "@/components/AdminContent";
import { getSession } from "@/lib/session";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";


export const metadata: Metadata = {
  title: "Admin - BomRauTFT",
  robots: "noindex, nofollow",
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  // 1. Fetch Stats
  const [revenueRows] = await pool.query<RowDataPacket[]>("SELECT SUM(amount) as total FROM orders WHERE status = 'completed'");
  const [unsoldAccountCountRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM accounts WHERE status = 'available'");
  const [soldAccountCountRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM accounts WHERE status = 'sold'");
  const [orderCountRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM orders");

  const stats: AdminStats = {
    totalRevenue: Number(revenueRows[0].total) || 0,
    totalUnsoldAccounts: Number(unsoldAccountCountRows[0].total) || 0,
    totalSoldAccounts: Number(soldAccountCountRows[0].total) || 0,
    totalOrders: Number(orderCountRows[0].total) || 0,
  };

  // 2. Fetch Products
  const [productRows] = await pool.query<RowDataPacket[]>(`
    SELECT p.id, p.category_id, p.title, p.image_url, 
           p.price, p.original_price, p.discount_percent, p.fake_sold_count, p.fake_remaining_count, p.status, p.is_pinned,
           p.pet_tim, p.san_tim, p.chuong, p.extra_info,
           c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.is_pinned DESC, p.id DESC
  `);

  const initialProducts: AdminProduct[] = productRows.map(row => ({
    id: row.id,
    category_id: row.category_id,
    title: row.title,
    image_url: row.image_url || "",
    original_price: Number(row.original_price) || 0,
    price: Number(row.price),
    discount_percent: Number(row.discount_percent) || 0,
    fake_sold_count: Number(row.fake_sold_count) || 0,
    fake_remaining_count: Number(row.fake_remaining_count) || 0,
    category_name: row.category_name || "N/A",
    status: row.status as "available" | "hidden",
    is_pinned: Boolean(row.is_pinned),
    pet_tim: row.pet_tim || "",
    san_tim: row.san_tim || "",
    chuong: row.chuong || "",
    extra_info: row.extra_info || ""
  }));

  // Fetch Accounts
  const [accountRows] = await pool.query<RowDataPacket[]>(`
    SELECT a.id, a.product_id, a.distributor_id, a.login_username, a.login_password, 
           a.cost_price, a.status, a.note,
           p.title as product_title, d.name as distributor_name
    FROM accounts a
    LEFT JOIN products p ON a.product_id = p.id
    LEFT JOIN distributors d ON a.distributor_id = d.id
    ORDER BY a.id DESC
  `);

  const initialAccounts: AdminAccount[] = accountRows.map(row => ({
    id: row.id,
    product_id: row.product_id,
    distributor_id: row.distributor_id || null,
    login_username: row.login_username,
    login_password: row.login_password,
    cost_price: Number(row.cost_price) || 0,
    status: row.status as "available" | "sold" | "hidden",
    note: row.note || "",
    product_title: row.product_title || "N/A",
    distributor_name: row.distributor_name || "N/A",
  }));

  // 3. Fetch Categories
  const [categoryRows] = await pool.query<RowDataPacket[]>(`
    SELECT c.id, c.name, c.slug, c.description, c.image_url, c.sort_order,
           c.fake_remaining_count as productCount,
           c.fake_sold_count as soldCount
    FROM categories c
    ORDER BY c.sort_order
  `);

  const initialCategories: AdminCategory[] = categoryRows.map(row => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || "",
    image_url: row.image_url || "",
    sort_order: Number(row.sort_order) || 0,
    productCount: Number(row.productCount) || 0,
    soldCount: Number(row.soldCount) || 0,
  }));

  // 4. Fetch Distributors
  const [distributorRows] = await pool.query<RowDataPacket[]>(`
    SELECT d.id, d.name, d.domain, d.phone, d.email, d.is_active,
           (SELECT COUNT(*) FROM accounts a WHERE a.distributor_id = d.id AND a.status = 'sold') as totalSupplied
    FROM distributors d
    ORDER BY d.id DESC
  `);

  const initialDistributors: AdminDistributor[] = distributorRows.map(row => ({
    id: row.id,
    name: row.name,
    domain: row.domain,
    phone: row.phone || "",
    email: row.email || "",
    totalSupplied: Number(row.totalSupplied),
    is_active: Boolean(row.is_active),
  }));

  // 5. Fetch Users
  const [userRows] = await pool.query<RowDataPacket[]>(`
    SELECT u.id, u.username, u.email, u.balance, u.created_at,
           (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id AND o.status = 'completed') as totalPurchased
    FROM users u
    ORDER BY u.id DESC
  `);

  const initialUsers: AdminUser[] = userRows.map(row => ({
    id: row.id,
    username: row.username,
    email: row.email,
    balance: Number(row.balance),
    joinDate: new Date(row.created_at).toLocaleDateString("vi-VN"),
    totalPurchased: Number(row.totalPurchased),
  }));

  // 6. Fetch Orders
  const [orderRows] = await pool.query<RowDataPacket[]>(`
    SELECT o.id, u.username as user, p.title as product, o.amount, o.created_at, o.status
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN products p ON o.product_id = p.id
    ORDER BY o.id DESC
  `);

  const initialOrders: AdminOrder[] = orderRows.map(row => ({
    id: row.id,
    user: row.user || "N/A",
    product: row.product || "N/A",
    amount: Number(row.amount),
    date: new Date(row.created_at).toLocaleDateString("vi-VN"),
    status: row.status as "pending" | "completed" | "cancelled" | "refunded",
  }));

  // 7. Fetch Notifications
  const [notificationRows] = await pool.query<RowDataPacket[]>(`
    SELECT id, title, content, image_url, is_pinned, is_active, created_at
    FROM notifications
    ORDER BY id DESC
  `);

  const initialNotifications: AdminNotification[] = notificationRows.map(row => ({
    id: row.id,
    title: row.title,
    content: row.content,
    image_url: row.image_url || "",
    is_pinned: Boolean(row.is_pinned),
    is_active: Boolean(row.is_active),
    date: new Date(row.created_at).toLocaleDateString("vi-VN"),
  }));

  return (
    <div className="pt-[70px] md:pt-[90px] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-6 md:py-10 px-4">
        <AdminContent 
          stats={stats}
          initialProducts={initialProducts}
          initialAccounts={initialAccounts}
          initialCategories={initialCategories}
          initialDistributors={initialDistributors}
          initialUsers={initialUsers}
          initialOrders={initialOrders}
          initialNotifications={initialNotifications}
        />
      </main>
      <Footer />
    </div>
  );
}
