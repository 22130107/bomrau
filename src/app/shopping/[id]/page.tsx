import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetail } from "@/components/ProductDetail";
import { Breadcrumb } from "@/components/Breadcrumb";

// Demo data - sẽ thay bằng fetch từ DB
const products: Record<string, { name: string; image: string; price: number; originalPrice: number; discount: number; petTim?: string }> = {
  "yone-than-kiem": { name: "YoneThanKiem", image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fa6797c5f7dcc93244a336e219b9c7a3d70dfa77d.webp?generation=1779095277777844&alt=media", price: 2499000, originalPrice: 3570000, discount: 30, petTim: "Yone Thần Kiếm" },
  "yasuo-long-kiem": { name: "YasuoLongKiem", image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F9a5e150145e8027b1a5f5f7ad7e06fbb2cc76f8d.webp?generation=1779095277779894&alt=media", price: 2998000, originalPrice: 4282857, discount: 30, petTim: "Yasuo Long Kiếm" },
  "lee-tieu-long": { name: "LeeTieuLong", image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F568911a788ccc414e60c9cfe29640b3299f1da24.webp?generation=1779095277776142&alt=media", price: 2998000, originalPrice: 4282857, discount: 30, petTim: "Lee Tiểu Long" },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = products[id];
  if (!product) return { title: "Sản phẩm không tồn tại" };
  return {
    title: `${product.name} - Mua Nick TFT | BomRauTFT`,
    description: `Mua tài khoản ${product.name} giá ${product.price.toLocaleString("vi-VN")}đ (giảm ${product.discount}%). Pet tím: ${product.petTim || "N/A"}. Giao dịch uy tín tại BomRauTFT.`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products[id];

  if (!product) {
    return (
      <div className="pt-[70px] md:pt-[90px]">
        <Header />
        <main className="flex items-center justify-center min-h-[50vh]">
          <p className="text-[rgb(251,191,36)] text-[24px] font-bold">Sản phẩm không tồn tại</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pt-[70px] md:pt-[90px]">
      <Header />
      <main className="py-6 md:py-10">
        <Breadcrumb items={[
          { label: "Trang chủ", href: "/", icon: "home" },
          { label: "Shopping", href: "/shopping" },
          { label: product.name },
        ]} />
        <div className="mt-4 md:mt-6">
          <ProductDetail {...product} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
