import PaymentResult from "@/features/checkout/PaymentResult";

type CheckoutResultPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function CheckoutResultPage({
  searchParams,
}: CheckoutResultPageProps) {
  const { status } = await searchParams;

  return (
    <PaymentResult status={status === "success" ? "success" : "failed"} />
  );
}
