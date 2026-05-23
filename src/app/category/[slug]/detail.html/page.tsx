import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductDetail } from "@/components/ProductDetail";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Chi Tiết Sản Phẩm - Shop BomRauTFT",
  description: "Chi tiết sản phẩm TFT giá rẻ, uy tín.",
};

export default async function ProductDetailPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>, 
  searchParams: Promise<{ id?: string }> 
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const slug = resolvedParams.slug;
  const productId = resolvedSearchParams.id;

  if (!productId) {
    notFound();
  }

  // Lấy thông tin Category
  const [categories] = await pool.query<RowDataPacket[]>("SELECT id, name, image_url FROM categories WHERE slug = ?", [slug]);
  if (categories.length === 0) {
    notFound();
  }
  const category = categories[0];

  // Lấy thông tin Product
  const [products] = await pool.query<RowDataPacket[]>(`
    SELECT id, title, image_url, price, original_price, discount_percent, fake_sold_count, fake_remaining_count, pet_tim, san_tim, chuong, extra_info
    FROM products 
    WHERE id = ? AND status = 'available'
  `, [productId]);

  if (products.length === 0) {
    notFound();
  }
  const product = products[0];

  // Lấy số lượng Acc thực tế còn trong kho
  const [accounts] = await pool.query<RowDataPacket[]>(`
    SELECT COUNT(*) as count FROM accounts WHERE product_id = ? AND status = 'available'
  `, [productId]);
  const realRemainingCount = accounts[0].count;

  // Lấy session và thông tin người dùng hiện tại
  const session = await getSession();
  let currentUser = null;
  if (session) {
    const [userRows] = await pool.query<RowDataPacket[]>(
      "SELECT id, username, balance FROM users WHERE id = ? LIMIT 1",
      [session.userId]
    );
    if (userRows.length > 0) {
      currentUser = {
        id: userRows[0].id,
        username: userRows[0].username,
        balance: Number(userRows[0].balance),
      };
    }
  }

  return (
    <div className="pt-[70px] md:pt-[90px]">
      <Header />
      <main>
        <Breadcrumb items={[
          { label: "Trang chủ", href: "/", icon: "home" },
          { label: category.name, href: `/category/${slug}` },
          { label: product.title },
        ]} />
        <div className="pt-6 md:pt-10 pb-10">
          <ProductDetail 
            productId={Number(productId)}
            currentUser={currentUser}
            name={product.title}
            image={product.image_url || category.image_url}
            price={Number(product.price)}
            originalPrice={Number(product.original_price)}
            discount={Number(product.discount_percent)}
            petTim={product.pet_tim || undefined}
            sanTim={product.san_tim || undefined}
            chuong={product.chuong || undefined}
            extraInfo={product.extra_info || undefined}
            isOutOfStock={realRemainingCount === 0}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
