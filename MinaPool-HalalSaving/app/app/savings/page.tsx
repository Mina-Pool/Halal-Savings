// app/app/savings/page.tsx
import { Suspense } from "react";
import SavingsClient from "./SavingsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-5 py-10 text-neutral-500">
          Loading savings…
        </div>
      }
    >
      <SavingsClient />
    </Suspense>
  );
}
