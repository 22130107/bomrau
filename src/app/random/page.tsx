import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { RandomSpin, SpinProduct } from "@/components/RandomSpin";
import { ProductCard } from "@/components/ProductCard";
import { getSession } from "@/lib/session";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const metadata: Metadata = {
  title: "Quay Random Nhận Acc - BomRauTFT",
  description: "Quay random nhận tài khoản game TFT ngẫu nhiên từ các danh mục tại BomRauTFT",
};

export default async function RandomPage() {
  const session = await getSession();
  let balance = 0;

  if (session) {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT balance FROM users WHERE id = ?",
      [session.userId]
    );
    if (rows.length > 0) {
      balance = Number(rows[0].balance);
    }
  }

  const [spinProductRows] = await pool.query<RowDataPacket[]>(`
    SELECT p.id, p.title, p.image_url, p.price, p.original_price, p.discount_percent,
           c.name as category_name, c.slug as category_slug,
           (SELECT COUNT(*) FROM accounts WHERE product_id = p.id AND status = 'available') as available_accounts
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'available'
      AND (
        c.is_spin_enabled = 1
        OR EXISTS (
          SELECT 1 FROM categories ec
          WHERE ec.is_spin_enabled = 1
            AND JSON_CONTAINS(p.extra_categories, CAST(ec.id AS JSON))
        )
      )
    ORDER BY p.is_pinned DESC, p.id DESC
  `);

  const [spinCostRows] = await pool.query<RowDataPacket[]>(
    "SELECT `value` FROM settings WHERE `key` = 'spin_cost' LIMIT 1"
  );
  const spinCost = spinCostRows.length > 0 ? Number(spinCostRows[0].value) : 10000;

  const spinProducts: SpinProduct[] = spinProductRows
    .filter(row => Number(row.available_accounts) > 0)
    .map(row => ({
      id: row.id,
      title: row.title,
      image_url: row.image_url || "",
      price: Number(row.price),
      original_price: Number(row.original_price) || 0,
      discount_percent: Number(row.discount_percent) || 0,
      category_name: row.category_name,
      category_slug: row.category_slug,
      available_accounts: Number(row.available_accounts) || 0,
    }));

  return (
    <div className="pt-[70px] md:pt-[90px]">
      <Header />
      <main>
        <Breadcrumb items={[
          { label: "Trang chu", href: "/", icon: "home" },
          { label: "Quay Random" },
        ]} />
        <section className="py-6 md:py-10 animate-fade-in-up">
          <div className="mx-auto w-full max-w-[1200px] px-[14px] flex flex-col items-center">
            <h1 className="font-bold mb-2 border-[rgb(251,191,36)] text-[rgb(251,191,36)] text-[28px] md:text-[36px] leading-[48px] md:leading-[64px] pl-4 md:pl-6 border-l-[4px] self-start">
              Quay Random Nhận Acc
            </h1>
            <p className="text-[rgba(238,238,238,0.6)] text-[14px] md:text-[16px] mb-6 md:mb-8 self-start pl-4 md:pl-6">
              Chi phí {spinCost.toLocaleString("vi-VN")}đ / lượt. Acc nhận được sẽ được thêm vào lịch sử mua hàng của bạn.
            </p>
            <RandomSpin
              isLoggedIn={!!session}
              userId={session?.userId ?? null}
              balance={balance}
              spinProducts={spinProducts}
              spinCost={spinCost}
            />

            {spinProducts.length > 0 && (
              <div className="w-full mt-10 md:mt-14">
                <p className="text-[rgba(238,238,238,0.5)] text-[13px] md:text-[14px] mb-4 md:mb-6 font-medium tracking-wide uppercase">
                  Sản phẩm có thể quay
                </p>
                <ul className="flex flex-wrap gap-[16px] md:gap-[32px] animate-fade-in-up">
                  {spinProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id.toString()}
                      name={product.title}
                      image={product.image_url}
                      price={product.price}
                      originalPrice={product.original_price}
                      discount={product.discount_percent}
                      remaining={product.available_accounts}
                      href={`/category/${product.category_slug}/detail.html?id=${product.id}`}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
