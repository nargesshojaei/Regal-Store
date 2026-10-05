// ظاهر درگاه. پرداخت یعنی موفق، انصراف یعنی ناموفق.
import type { Metadata } from "next";
import PaymentGateway from "@/features/checkout/PaymentGateway";

export const metadata: Metadata = {
  title: "درگاه پرداخت | رگال",
};

export default function PayPage() {
  return <PaymentGateway />;
}
