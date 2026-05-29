import type { Metadata } from "next";
import { Open_Sans, Nunito } from "next/font/google";
import "./globals.css";
import { ContactButton } from "@/components/ContactButton";
import { ClientErrorDiagnostic } from "@/components/ClientErrorDiagnostic";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "vietnamese"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "BomRauTFT - Shop Mua Bán Nick Game TFT Uy Tín, Giá Rẻ",
  description: "BomRauTFT là Shop TFT uy tín, giá rẻ, đa dạng, đầy đủ Mobile và PC. Mua bán tài khoản game TFT chất lượng cao.",
  keywords: "mua nick tft, shop tft, bomrautft, nick game tft, tài khoản tft giá rẻ",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "BomRauTFT - Shop Mua Bán Nick Game TFT",
    description: "Shop TFT uy tín, giá rẻ, đa dạng, đầy đủ Mobile và PC.",
    type: "website",
    url: "https://bomrautft.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${openSans.variable} ${nunito.variable}`}>
      <body className="min-h-screen bg-[rgb(15,23,42)] text-[rgb(238,238,238)] font-[family-name:var(--font-open-sans)]">
        {children}
        <ContactButton />
        <ClientErrorDiagnostic />
      </body>
    </html>
  );
}
