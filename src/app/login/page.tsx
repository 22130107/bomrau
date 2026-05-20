import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Đăng Nhập - BomRauTFT",
  description: "Đăng nhập hoặc đăng ký tài khoản BomRauTFT để mua nick game TFT.",
};

export default function LoginPage() {
  return (
    <div className="pt-[70px] md:pt-[90px] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
