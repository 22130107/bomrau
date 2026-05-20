import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileContent } from "@/components/ProfileContent";

export const metadata: Metadata = {
  title: "Tài khoản của tôi - BomRauTFT",
  description: "Quản lý tài khoản, nạp tiền, xem lịch sử mua hàng tại BomRauTFT.",
};

export default function ProfilePage() {
  return (
    <div className="pt-[70px] md:pt-[90px] min-h-screen flex flex-col">
      <Header isLoggedIn={true} username="player01" />
      <main className="flex-1 py-6 md:py-10 px-4">
        <ProfileContent />
      </main>
      <Footer />
    </div>
  );
}
