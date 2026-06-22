import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CategoryCard } from "@/components/CategoryCard";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const metadata: Metadata = {
  title: "Danh Mục Sản Phẩm - Shop BomRauTFT",
  description: "Khám phá danh mục tài khoản game TFT uy tín, chất lượng tại BomRauTFT.",
};

export default async function CategoriesPage() {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT c.name as title, c.slug, c.description as price, c.image_url as image,
           c.fake_remaining_count as remaining,
           c.fake_sold_count as sold
    FROM categories c
    WHERE c.is_active = 1
    ORDER BY c.sort_order ASC
  `);

  return (
    <div className="pt-[70px] md:pt-[90px]">
      <Header />
      <main>
        <Breadcrumb items={[
          { label: "Trang chủ", href: "/", icon: "home" },
          { label: "Danh mục" },
        ]} />
        <section className="pt-6 md:pt-10 pb-6 md:pb-10 animate-fade-in-up">
          <div className="mx-auto w-full max-w-[1200px] px-[14px]">
            <h2 className="font-bold mb-[16px] md:mb-[32px] border-[rgb(251,191,36)] text-[rgb(251,191,36)] text-[28px] md:text-[36px] leading-[48px] md:leading-[64px] pl-4 md:pl-6 border-l-[4px]">
              Danh Mục Sản Phẩm
            </h2>
            <ul className="flex flex-wrap mt-[32px] md:mt-[64px] gap-[16px] md:gap-[32px]">
              {rows.map((category, index) => (
                <CategoryCard 
                  key={index}
                  image={category.image}
                  alt={category.title}
                  title={category.title}
                  price={category.price}
                  sold={category.sold}
                  remaining={category.remaining}
                  href={`/category/${category.slug}`}
                />
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
