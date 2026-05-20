import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DistributorContent } from "@/components/DistributorContent";

export const metadata: Metadata = {
  title: "Nhà Phân Phối - BomRauTFT",
  robots: "noindex, nofollow",
};

export default function NppPage() {
  return (
    <div className="pt-[70px] md:pt-[90px] min-h-screen flex flex-col">
      <Header isLoggedIn={true} username="npp" />
      <main className="flex-1 py-6 md:py-10 px-4">
        <DistributorContent />
      </main>
      <Footer />
    </div>
  );
}
