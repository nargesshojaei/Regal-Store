import { redirect } from "next/navigation";
import AdminFooter from "@/components/layout/AdminFooter";
import AdminHeader from "@/components/layout/AdminHeader";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { hasAdminSession } from "@/lib/auth/admin-session";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    // بدون accessToken معتبر، داشبورد باز نمی‌شود.
    if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-01">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
      <AdminFooter />
    </div>
  );
}
