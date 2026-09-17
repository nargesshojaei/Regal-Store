import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import StoreProvider from "@/lib/store-provider";
import { cn } from "@/lib/utils";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "رگال | فروشگاه پوشاک زنانه",
  description: "لباس‌هایی که داستان شما را روایت می‌کنند.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={cn("font-sans", vazirmatn.variable)}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
