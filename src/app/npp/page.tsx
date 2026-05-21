import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DistributorContent } from "@/components/DistributorContent";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Nhà Phân Phối - BomRauTFT",
  robots: "noindex, nofollow",
};

export default async function NppPage() {
  const session = await getSession();
  if (!session || session.role !== "npp") {
    redirect("/login");
  }

  return (
    <div className="pt-[70px] md:pt-[90px] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-6 md:py-10 px-4">
        <DistributorContent />
      </main>
      <Footer />
    </div>
  );
}
