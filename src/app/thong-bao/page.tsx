import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsSection } from "@/components/NewsSection";

export const metadata: Metadata = {
  title: "Thông Báo - BomRauTFT",
  description: "Tin tức, khuyến mãi mới nhất từ BomRauTFT. Cập nhật ưu đãi giảm giá tài khoản game TFT.",
};

export default function ThongBaoPage() {
  return (
    <div className="pt-[70px] md:pt-[90px]">
      <Header />
      <main>
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}
