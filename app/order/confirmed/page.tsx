"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDish, getRestaurantById } from "@/lib/data";
import { money } from "@/lib/format";
import { useFakeFoods } from "@/lib/store";
import { etaClock } from "@/lib/tracking";

export default function ConfirmedPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const order = useFakeFoods((s) => s.order);

  useEffect(() => {
    if (mounted && !order) router.replace("/");
  }, [mounted, order, router]);

  if (!mounted || !order) return <div className="flex-1" />;

  const restaurant = getRestaurantById(order.restaurantId)!;

  return (
    <div className="flex-1 pb-10">
      <main className="flex flex-col items-center px-4 pt-16 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl animate-pop-in">
          ✅
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight animate-pop-in">
          Order placed!
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {restaurant.name} is on it. Arriving around{" "}
          <span className="font-semibold text-stone-700">{etaClock(order)}</span>.
        </p>
        <p className="mt-1 text-xs text-stone-400">Order {order.id}</p>

        <Link
          href="/order/tracking"
          className="mt-8 w-full rounded-2xl bg-stone-900 px-5 py-4 font-semibold text-white shadow-xl active:scale-[0.98] transition-transform"
        >
          Track your order →
        </Link>

        {/* receipt */}
        <section className="mt-6 w-full rounded-2xl bg-white border border-stone-200 p-4 text-left text-sm shadow-sm">
          <h2 className="font-semibold">Receipt</h2>
          <div className="mt-2 flex flex-col gap-1.5">
            {order.lines.map((line) => {
              const dish = getDish(restaurant, line.dishId);
              return (
                <div
                  key={line.lineId}
                  className="flex items-center justify-between text-stone-600"
                >
                  <span>
                    {line.quantity}× {dish?.name ?? "Item"}
                  </span>
                  <span>{money(line.unitPriceCents * line.quantity)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 border-t border-stone-100 pt-3 flex flex-col gap-1 text-stone-500">
            <Row label="Subtotal" value={money(order.subtotalCents)} />
            <Row label="Delivery fee" value={money(order.deliveryFeeCents)} />
            <Row label="Service fee" value={money(order.serviceFeeCents)} />
            <Row label="Tax" value={money(order.taxCents)} />
            <Row label="Tip" value={money(order.tipCents)} />
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-stone-100 pt-3 text-base font-bold text-stone-800">
            <span>Total</span>
            <span>{money(order.totalCents)}</span>
          </div>
        </section>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
