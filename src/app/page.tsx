import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsSection } from "@/components/NewsSection";
import { CategorySection } from "@/components/CategorySection";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const metadata: Metadata = {
  title: "BomRauTFT - Shop Mua Bán Nick Game TFT Uy Tín, Giá Rẻ",
  description: "BomRauTFT là Shop TFT uy tín, giá rẻ, đa dạng, đầy đủ Mobile và PC. Mua bán tài khoản game TFT chất lượng cao với giá tốt nhất.",
};

export default async function HomePage() {
  const [notifications] = await pool.query<RowDataPacket[]>(`
    SELECT title, content, image_url 
    FROM notifications 
    WHERE is_active = 1 
    ORDER BY is_pinned DESC, id DESC
  `);

  const initialNotifications = notifications.map(row => ({
    title: row.title,
    content: row.content,
    image: row.image_url || "",
  }));

  return (
    <div className="pt-[70px] md:pt-[90px]">
      <Header />
      <main>
        <NewsSection notifications={initialNotifications} />
        <CategorySection />
      </main>
      <Footer />
    </div>
  );
}
