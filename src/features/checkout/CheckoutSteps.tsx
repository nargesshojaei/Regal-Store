import { Check, CreditCard, ShoppingBag, UserRound } from "lucide-react";

// سه قدم بالای صفحه خرید
const steps = [
  { id: "cart", label: "سبد خرید", icon: ShoppingBag },
  { id: "info", label: "تکمیل اطلاعات", icon: UserRound },
  { id: "pay", label: "پرداخت", icon: CreditCard },
] as const;

type StepId = (typeof steps)[number]["id"];

function circleClass(done: boolean, active: boolean) {
  if (active) return "border-primary bg-primary-tint-02 text-primary";
  if (done) return "border-primary bg-primary text-white";
  return "border-neutral-03 bg-white text-neutral-08";
}

export default function CheckoutSteps({ current }: { current: StepId }) {
  const currentIndex = steps.findIndex((step) => step.id === current);

  return (
    <ol className="mx-auto flex max-w-lg items-start justify-center">
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        const Icon = step.icon;
        const isLast = index === steps.length - 1;

        return (
          <li key={step.id} className="flex items-start">
            <div className="flex w-24 flex-col items-center gap-2">
              <span
                className={`flex size-11 items-center justify-center rounded-full border ${circleClass(done, active)}`}
              >
                {done ? (
                  <Check className="size-4" strokeWidth={2} />
                ) : (
                  <Icon className="size-4" strokeWidth={1.75} />
                )}
              </span>
              <span
                className={`text-center text-xs ${active ? "font-medium text-primary" : "text-neutral-09"}`}
              >
                {step.label}
              </span>
            </div>
            {isLast ? null : (
              <span
                className={`mt-5 h-px w-10 sm:w-16 ${done ? "bg-primary" : "bg-neutral-03"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
