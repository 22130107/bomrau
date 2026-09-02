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

export default async function RandomPage(props: { searchParams?: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const categorySlug = searchParams?.category || null;

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

  let categoryName = "Quay Random";
  let spinCategoryId: number | null = null;
  let spinCost = 0;

  if (categorySlug) {
    const [catRows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, spin_price FROM categories WHERE slug = ? AND is_spin_enabled = 1",
      [categorySlug]
    );
    if (catRows.length > 0) {
      spinCategoryId = catRows[0].id;
      categoryName = catRows[0].name;
      if (catRows[0].spin_price !== null) {
        spinCost = Number(catRows[0].spin_price);
      }
    }
  } else {
    const [spinCostRows] = await pool.query<RowDataPacket[]>(
      "SELECT `value` FROM settings WHERE `key` = 'spin_cost' LIMIT 1"
    );
    if (spinCostRows.length > 0) {
      spinCost = Number(spinCostRows[0].value);
    }
  }

  let spinProductRows: RowDataPacket[];
  if (categorySlug) {
    const [catRows] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM categories WHERE slug = ?",
      [categorySlug]
    );
    const categoryId = catRows.length > 0 ? catRows[0].id : 0;

    [spinProductRows] = await pool.query<RowDataPacket[]>(`
      SELECT p.id, p.title, p.image_url, p.price, p.original_price, p.discount_percent,
             c.name as category_name, c.slug as category_slug,
             CASE
               WHEN p.fake_remaining_count > 0 THEN p.fake_remaining_count
               ELSE (SELECT COUNT(*) FROM accounts WHERE product_id = p.id AND status = 'available')
             END as available_accounts,
             CASE
               WHEN p.fake_sold_count > 0 THEN p.fake_sold_count
               ELSE (SELECT COUNT(*) FROM orders WHERE product_id = p.id AND status = 'completed')
             END as sold_count
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'available'
        AND (p.category_id = ? OR JSON_CONTAINS(p.extra_categories, CAST(? AS JSON)))
      ORDER BY p.is_pinned DESC, p.id DESC
    `, [categoryId, categoryId]);
  } else {
    [spinProductRows] = await pool.query<RowDataPacket[]>(`
      SELECT p.id, p.title, p.image_url, p.price, p.original_price, p.discount_percent,
             c.name as category_name, c.slug as category_slug,
             CASE
               WHEN p.fake_remaining_count > 0 THEN p.fake_remaining_count
               ELSE (SELECT COUNT(*) FROM accounts WHERE product_id = p.id AND status = 'available')
             END as available_accounts,
             CASE
               WHEN p.fake_sold_count > 0 THEN p.fake_sold_count
               ELSE (SELECT COUNT(*) FROM orders WHERE product_id = p.id AND status = 'completed')
             END as sold_count
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
  }

  const staticProducts: SpinProduct[] = [
    {
      id: 99999,
      title: "Shyvana thần long tini",
      image_url: "/gify.jpg",
      price: 3799000,
      original_price: 3799000,
      discount_percent: 0,
      category_name: "Túi Mù",
      category_slug: "random",
      available_accounts: 0,
      sold_count: 0,
    },
  ];

  const allSpinProducts: SpinProduct[] = [
    ...staticProducts,
    ...spinProductRows
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
        sold_count: Number(row.sold_count) || 0,
      })),
  ];

  const effectiveSpinCost = spinCost > 0 ? spinCost : 3799000;

  return (
    <div className="pt-[70px] md:pt-[90px]">
      <Header />
      <main>
        <Breadcrumb items={[
          { label: "Trang chu", href: "/", icon: "home" },
          { label: categoryName },
        ]} />
        <section className="py-6 md:py-10 animate-fade-in-up">
          <div className="mx-auto w-full max-w-[1200px] px-[14px] flex flex-col items-center">
            <h1 className="font-bold mb-2 border-[rgb(251,191,36)] text-[rgb(251,191,36)] text-[28px] md:text-[36px] leading-[48px] md:leading-[64px] pl-4 md:pl-6 border-l-[4px] self-start">
              {categoryName}
            </h1>
            <p className="text-[rgba(238,238,238,0.6)] text-[14px] md:text-[16px] mb-6 md:mb-8 self-start pl-4 md:pl-6">
              {`Chi phí ${effectiveSpinCost.toLocaleString("vi-VN")}đ / lượt. Acc nhận được sẽ được thêm vào lịch sử mua hàng của bạn.`}
            </p>
            <RandomSpin
              isLoggedIn={!!session}
              userId={session?.userId ?? null}
              balance={balance}
              spinProducts={allSpinProducts}
              spinCost={effectiveSpinCost}
              spinCategoryId={spinCategoryId}
            />

            {allSpinProducts.length > 0 && (
              <div className="w-full mt-10 md:mt-14">
                <p className="text-[rgba(238,238,238,0.5)] text-[13px] md:text-[14px] mb-4 md:mb-6 font-medium tracking-wide uppercase">
                  Sản phẩm có thể quay
                </p>
                <ul className="flex flex-wrap gap-[16px] md:gap-[32px] animate-fade-in-up">
                  {allSpinProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id.toString()}
                      name={product.title}
                      image={product.image_url}
                      price={product.price}
                      originalPrice={product.original_price}
                      discount={product.discount_percent}
                      sold={product.id === 99999 ? undefined : product.sold_count}
                      remaining={product.id === 99999 ? undefined : product.available_accounts}
                      href={product.id === 99999 ? "/category/random/detail.html?id=99999" : `/category/${product.category_slug}/detail.html?id=${product.id}`}
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
