import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminContent } from "@/components/AdminContent";

export const metadata: Metadata = {
  title: "Admin - BomRauTFT",
  robots: "noindex, nofollow",
};

export default function AdminPage() {
  return (
    <div className="pt-[70px] md:pt-[90px] min-h-screen flex flex-col">
      <Header isLoggedIn={true} username="admin" />
      <main className="flex-1 py-6 md:py-10 px-4">
        <AdminContent />
      </main>
      <Footer />
    </div>
  );
}
