import AccountShell from "@/features/account/AccountShell";
//قابل استفاده برای همه صفحات حساب کاربری است
// چیدمان مشترک پروفایل، سفارش، علاقه‌مندی و آدرس
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountShell>{children}</AccountShell>;
}




