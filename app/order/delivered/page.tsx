"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRestaurantById } from "@/lib/data";
import { money } from "@/lib/format";
import { monthKey, useFakeFoods } from "@/lib/store";
import type { Feeling } from "@/lib/types";

export default function DeliveredPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const order = useFakeFoods((s) => s.order);
  const completeOrder = useFakeFoods((s) => s.completeOrder);
  const history = useFakeFoods((s) => s.history);
  const thisMonth = history.filter((e) => monthKey(e.at) === monthKey(Date.now()));
  const monthCents = thisMonth.reduce((sum, e) => sum + e.totalCents, 0);

  const [feeling, setFeeling] = useState<Feeling | null>(null);
  // hold on to the total for display after completeOrder clears the order
  const [orderTotal, setOrderTotal] = useState<number | null>(null);
  const [restaurantName, setRestaurantName] = useState<string>("");

  useEffect(() => {
    if (mounted && !order && feeling === null) router.replace("/");
  }, [mounted, order, feeling, router]);

  if (!mounted || (!order && feeling === null)) return <div className="flex-1" />;

  const handleFeeling = (f: Feeling) => {
    if (order) {
      setOrderTotal(order.totalCents);
      setRestaurantName(getRestaurantById(order.restaurantId)?.name ?? "");
      completeOrder(f);
    }
    setFeeling(f);
  };

  // ---------- after check-in ----------
  if (feeling !== null) {
    return (
      <div className="flex-1">
        <main className="flex flex-col items-center px-6 pt-20 text-center pb-12">
          <span className="text-6xl animate-pop-in">
            {feeling === "better" ? "😌" : feeling === "still" ? "🫶" : "🍳"}
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight">
            {feeling === "better" && "That's the whole trick."}
            {feeling === "still" && "That's okay. Urges take their time."}
            {feeling === "hungry" && "Then eat! For real."}
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-500">
            {feeling === "better" &&
              "You gave the craving its full ritual — the browsing, the ordering, the wait — and it passed without costing you anything."}
            {feeling === "still" &&
              "You still rode this one out from start to finish, and that counts. If it's still loud in a while, you can always order again — it's free here."}
            {feeling === "hungry" &&
              "This app is for cravings, not for hunger. If your body actually needs food, go have a real meal — no app required, no guilt attached."}
          </p>

          {orderTotal !== null && (
            <div className="mt-8 w-full max-w-sm rounded-2xl bg-white border border-stone-200 p-4 text-sm shadow-sm">
              <div className="flex items-center justify-between py-1 text-stone-600">
                <span>This order ({restaurantName})</span>
                <span className="font-semibold">{money(orderTotal)} not spent</span>
              </div>
              <div className="flex items-center justify-between border-t border-stone-100 pt-2 mt-1 text-stone-600">
                <span>
                  This month · {thisMonth.length} craving
                  {thisMonth.length === 1 ? "" : "s"}
                </span>
                <span className="font-semibold">{money(monthCents)} saved</span>
              </div>
            </div>
          )}

          <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
            <Link
              href="/stats"
              className="rounded-2xl bg-stone-900 px-5 py-4 font-semibold text-white shadow-xl"
            >
              See your savings →
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-stone-200 bg-white px-5 py-4 font-semibold text-stone-700"
            >
              Order something else (still fake, still free)
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ---------- the gentle reveal ----------
  return (
    <div className="flex-1">
      <main className="flex flex-col items-center px-6 pt-20 text-center pb-12">
        <div className="relative">
          <span className="text-7xl animate-pop-in">📦</span>
          <span className="absolute -right-4 -top-2 text-3xl animate-float-slow">✨</span>
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight animate-pop-in">
          Delivered.
        </h1>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-stone-600">
          And here&apos;s the quiet part: nothing was charged, and nothing is at your
          door. But you did the whole thing — you browsed, you chose, you ordered, you
          waited, it arrived.
        </p>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-stone-600">
          The urge got its moment.
        </p>

        <p className="mt-10 text-sm font-semibold text-stone-700">
          How are you feeling now?
        </p>
        <div className="mt-4 flex w-full max-w-sm flex-col gap-3">
          <button
            onClick={() => handleFeeling("better")}
            className="rounded-2xl bg-stone-900 px-5 py-4 font-semibold text-white shadow-xl active:scale-[0.98] transition-transform"
          >
            😌 Better — craving's handled
          </button>
          <button
            onClick={() => handleFeeling("still")}
            className="rounded-2xl border border-stone-200 bg-white px-5 py-4 font-semibold text-stone-700 active:scale-[0.98] transition-transform"
          >
            😕 Still craving a bit
          </button>
          <button
            onClick={() => handleFeeling("hungry")}
            className="rounded-2xl border border-stone-200 bg-white px-5 py-4 font-semibold text-stone-700 active:scale-[0.98] transition-transform"
          >
            🍽️ I'm actually hungry
          </button>
        </div>
      </main>
    </div>
  );
}
