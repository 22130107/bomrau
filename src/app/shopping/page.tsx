import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Mua Nick TFT - Shop BomRauTFT | Giá Rẻ, Uy Tín",
  description: "Danh sách tài khoản game TFT giá rẻ, uy tín. Acc VIP, Siêu Rẻ, Pet Tím, Thần Thoại. Giao dịch nhanh chóng, an toàn.",
};

const products = [
  { id: "yone-than-kiem", name: "YoneThanKiem", image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fa6797c5f7dcc93244a336e219b9c7a3d70dfa77d.webp?generation=1779095277777844&alt=media", price: 2499000, originalPrice: 3570000, discount: 30, sold: 4, remaining: 1 },
  { id: "yasuo-long-kiem", name: "YasuoLongKiem", image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F9a5e150145e8027b1a5f5f7ad7e06fbb2cc76f8d.webp?generation=1779095277779894&alt=media", price: 2998000, originalPrice: 4282857, discount: 30, sold: 8, remaining: 2 },
  { id: "lee-tieu-long", name: "LeeTieuLong", image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F568911a788ccc414e60c9cfe29640b3299f1da24.webp?generation=1779095277776142&alt=media", price: 2998000, originalPrice: 4282857, discount: 30, sold: 6, remaining: 4 },
  { id: "acc-400", name: "ACC #400", image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fda3e0588f933c37893b29bee910324203675786b.webp?generation=1779095277763191&alt=media", price: 2999000, originalPrice: 3748750, discount: 20 },
  { id: "acc-538", name: "ACC #538", image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F3a388b685ed5cc99723fd8f56d62627527bfe51a.webp?generation=1779095277784991&alt=media", price: 2999000, originalPrice: 3748750, discount: 20 },
  { id: "acc-416", name: "ACC #416", image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F511ebf6fe2eb3a08c039900d88a04a5e673f5ed7.webp?generation=1779095277780048&alt=media", price: 3499000, originalPrice: 4373750, discount: 20 },
];

export default function ShoppingPage() {
  return (
    <div className="pt-[70px] md:pt-[90px]">
      <Header />
      <main>
        <Breadcrumb items={[
          { label: "Trang chủ", href: "/", icon: "home" },
          { label: "Shopping", href: "/shopping" },
          { label: "Vip" },
        ]} />
        <div className="pt-6 md:pt-10 pb-6 md:pb-10">
          <div className="mx-auto w-full max-w-[1200px] px-[14px]">
            <h2 className="font-bold mb-[16px] md:mb-[32px] border-[rgb(251,191,36)] text-[rgb(251,191,36)] text-[28px] md:text-[36px] leading-[48px] md:leading-[64px] pl-4 md:pl-6 border-l-[4px]">
              VIP
            </h2>
            <ul className="flex flex-wrap mt-[32px] md:mt-[64px] gap-[16px] md:gap-[32px] animate-fade-in-up">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
