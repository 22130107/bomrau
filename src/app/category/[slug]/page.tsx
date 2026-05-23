import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Mua Nick TFT - Shop BomRauTFT | Giá Rẻ, Uy Tín",
  description: "Danh sách tài khoản game TFT giá rẻ, uy tín. Acc VIP, Siêu Rẻ, Pet Tím, Thần Thoại. Giao dịch nhanh chóng, an toàn.",
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const [categories] = await pool.query<RowDataPacket[]>("SELECT id, name, image_url FROM categories WHERE slug = ?", [slug]);
  
  if (categories.length === 0) {
    notFound();
  }

  const category = categories[0];

  const [products] = await pool.query<RowDataPacket[]>(`
    SELECT id, title as name, image_url, original_price as originalPrice, price, discount_percent as discount,
           fake_sold_count, fake_remaining_count
    FROM products 
    WHERE category_id = ? AND status = 'available'
    ORDER BY id DESC
  `, [category.id]);

  return (
    <div className="pt-[70px] md:pt-[90px]">
      <Header />
      <main>
        <Breadcrumb items={[
          { label: "Trang chủ", href: "/", icon: "home" },
          { label: "Danh mục", href: "/#danhmuc" },
          { label: category.name },
        ]} />
        <div className="pt-6 md:pt-10 pb-6 md:pb-10">
          <div className="mx-auto w-full max-w-[1200px] px-[14px]">
            <h2 className="font-bold mb-[16px] md:mb-[32px] border-[rgb(251,191,36)] text-[rgb(251,191,36)] text-[28px] md:text-[36px] leading-[48px] md:leading-[64px] pl-4 md:pl-6 border-l-[4px]">
              {category.name}
            </h2>
            {products.length === 0 ? (
              <p className="text-[rgba(238,238,238,0.6)] text-[16px] italic">Hiện chưa có sản phẩm nào trong danh mục này.</p>
            ) : (
              <ul className="flex flex-wrap mt-[32px] md:mt-[64px] gap-[16px] md:gap-[32px] animate-fade-in-up">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id.toString()}
                    name={product.name}
                    price={Number(product.price)}
                    originalPrice={Number(product.originalPrice)}
                    discount={Number(product.discount)}
                    image={product.image_url || category.image_url}
                    sold={Number(product.fake_sold_count) || undefined}
                    remaining={Number(product.fake_remaining_count) || undefined}
                    href={`/category/${slug}/detail.html?id=${product.id}`}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
