import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsSection } from "@/components/NewsSection";
import { CategorySection } from "@/components/CategorySection";
import { TuiMuSection } from "@/components/TuiMuSection";
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "BomRauTFT",
        url: "https://bomrautft.com",
        description: "Shop mua bán nick game TFT uy tín, giá rẻ.",
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: "https://bomrautft.com/search?q={search_term_string}" },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        name: "BomRauTFT",
        url: "https://bomrautft.com",
        logo: "https://bomrautft.com/icon.png",
      },
    ],
  };

  return (
    <div className="pt-[70px] md:pt-[90px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <NewsSection notifications={initialNotifications} />
        <TuiMuSection />
        <CategorySection />
      </main>
      <Footer />
    </div>
  );
}
