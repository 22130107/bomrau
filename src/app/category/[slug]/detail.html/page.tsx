import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductDetail } from "@/components/ProductDetail";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { notFound } from "next/navigation";


export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ id?: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { id } = await searchParams;
  if (!id) return {};
  const [categories] = await pool.query<RowDataPacket[]>("SELECT id, name FROM categories WHERE slug = ?", [slug]);
  const [products] = await pool.query<RowDataPacket[]>("SELECT id, title, image_url FROM products WHERE id = ? AND status = 'available'", [id]);
  if (products.length === 0 || categories.length === 0) return {};
  const product = products[0];
  const category = categories[0];
  const image = product.image_url || "";
  return {
    title: `${product.title} - BomRauTFT | Mua Nick TFT Giá Rẻ`,
    description: `Mua tài khoản game TFT ${product.title} giá rẻ, uy tín. Danh mục ${category.name}. Giao dịch nhanh chóng, an toàn.`,
    openGraph: {
      title: `${product.title} - BomRauTFT`,
      description: `Mua tài khoản game TFT ${product.title} giá rẻ.`,
      images: image ? [{ url: image }] : [],
    },
    alternates: { canonical: `/category/${slug}/detail.html?id=${id}` },
  };
}

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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image_url || category.image_url || "",
    description: `Mua tài khoản game TFT ${product.title} giá rẻ, uy tín tại BomRauTFT.`,
    offers: {
      "@type": "Offer",
      price: Number(product.price),
      priceCurrency: "VND",
      availability: realRemainingCount > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://bomrautft.com/category/${slug}/detail.html?id=${productId}`,
    },
    category: category.name,
  };

  return (
    <div className="pt-[70px] md:pt-[90px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Header />
      <main>
        <Breadcrumb items={[
          { label: "Trang chủ", href: "/", icon: "home" },
          { label: category.name, href: `/category/${slug}` },
          { label: product.title },
        ]} />
        <div className="pt-6 md:pt-10 pb-10">
          <ProductDetail 
            name={product.title}
            image={product.image_url || category.image_url}
            price={Number(product.price)}
            originalPrice={Number(product.original_price)}
            discount={Number(product.discount_percent)}
            petTim={product.pet_tim || undefined}
            sanTim={product.san_tim || undefined}
            chuong={product.chuong || undefined}
            extraInfo={product.extra_info || undefined}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
