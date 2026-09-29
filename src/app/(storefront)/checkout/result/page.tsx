// آدرس ?status=success صفحه موفق است. هر مقدار دیگر صفحه ناموفق است.
import PaymentResult from "@/features/checkout/PaymentResult";



type CheckoutResultPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function CheckoutResultPage({
  searchParams,
}: CheckoutResultPageProps) {
  const params = await searchParams;
  let status: "success" | "failed" = "failed";
  if (params.status === "success") status = "success";

  return <PaymentResult status={status} />;
}
