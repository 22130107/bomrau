import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsSection } from "@/components/NewsSection";
import { CategorySection } from "@/components/CategorySection";

export const metadata: Metadata = {
  title: "BomRauTFT - Shop Mua Bán Nick Game TFT Uy Tín, Giá Rẻ",
  description: "BomRauTFT là Shop TFT uy tín, giá rẻ, đa dạng, đầy đủ Mobile và PC. Mua bán tài khoản game TFT chất lượng cao với giá tốt nhất.",
};

export default function HomePage() {
  return (
    <div className="pt-[70px] md:pt-[90px]">
      <Header />
      <main>
        <NewsSection />
        <CategorySection />
      </main>
      <Footer />
    </div>
  );
}
