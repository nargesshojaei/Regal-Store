// مرحله اطلاعات خریدار: نام، آدرس، شغل، تاریخ تحویل، توضیحات و کد پستی
import type { Metadata } from "next";
import CheckoutForm from "@/features/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "تکمیل اطلاعات | رگال",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
