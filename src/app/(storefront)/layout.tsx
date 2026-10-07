import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* هدر و فوتر روی همه صفحات فروشگاه ثابت می‌مانند */}
      <Header />
      <main className="min-w-0 min-h-screen overflow-x-clip bg-white">{children}</main>
      <Footer />
    </>
  );
}
    