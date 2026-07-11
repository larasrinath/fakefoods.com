"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDish, getRestaurantById } from "@/lib/data";
import { money } from "@/lib/format";
import { optionLabels, useFakeFoods } from "@/lib/store";
import { FoodArt } from "@/components/FoodArt";
import { Header } from "@/components/Header";

const TIP_OPTIONS = [0, 10, 15, 20, 25];

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lines = useFakeFoods((s) => s.lines);
  const cartRestaurantId = useFakeFoods((s) => s.cartRestaurantId);
  const tipPercent = useFakeFoods((s) => s.tipPercent);
  const setTipPercent = useFakeFoods((s) => s.setTipPercent);
  const updateQuantity = useFakeFoods((s) => s.updateQuantity);
  const removeLine = useFakeFoods((s) => s.removeLine);
  const totals = useFakeFoods((s) => s.totals)();

  const restaurant = cartRestaurantId ? getRestaurantById(cartRestaurantId) : null;

  if (!mounted) {
    return (
      <div className="flex-1">
        <Header back="/" />
      </div>
    );
  }

  if (!restaurant || lines.length === 0) {
    return (
      <div className="flex-1">
        <Header back="/" />
        <main className="flex flex-col items-center px-6 pt-24 text-center">
          <span className="text-6xl">🛒</span>
          <h1 className="mt-4 text-xl font-bold">Your cart is empty</h1>
          <p className="mt-1 text-sm text-stone-500">
            Whatever you&apos;re craving, it&apos;s in here somewhere.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-2xl bg-orange-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/25"
          >
            Browse restaurants
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-40">
      <Header back={`/r/${restaurant.slug}`} />

      <main className="px-4">
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Your cart</h1>
        <p className="mt-1 text-sm text-stone-500">
          From <span className="font-semibold text-stone-700">{restaurant.name}</span>
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {lines.map((line) => {
            const dish = getDish(restaurant, line.dishId);
            if (!dish) return null;
            const opts = optionLabels(dish, line.selectedOptionIds);
            return (
              <div
                key={line.lineId}
                className="flex items-start gap-3 rounded-2xl bg-white border border-stone-200 p-3 shadow-sm"
              >
                <FoodArt
                  emoji={dish.emoji}
                  hue={dish.hue}
                  className="h-16 w-16 shrink-0 rounded-xl"
                  emojiClassName="text-2xl"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold">{dish.name}</span>
                    <span className="font-semibold">
                      {money(line.unitPriceCents * line.quantity)}
                    </span>
                  </div>
                  {opts.length > 0 && (
                    <p className="mt-0.5 text-xs text-stone-500 truncate">
                      {opts.join(" · ")}
                    </p>
                  )}
                  {line.note && (
                    <p className="mt-0.5 text-xs italic text-stone-400 truncate">
                      “{line.note}”
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-stone-200">
                      <button
                        onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                        className="h-8 w-8 text-lg text-stone-600"
                        aria-label={`Decrease ${dish.name} quantity`}
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-semibold">
                        {line.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                        className="h-8 w-8 text-lg text-stone-600"
                        aria-label={`Increase ${dish.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeLine(line.lineId)}
                      className="text-xs font-medium text-stone-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* tip */}
        <section className="mt-6">
          <h2 className="font-semibold">Add a tip</h2>
          <div className="mt-2 flex gap-2">
            {TIP_OPTIONS.map((pct) => (
              <button
                key={pct}
                onClick={() => setTipPercent(pct)}
                className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold ${
                  tipPercent === pct
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-600 border-stone-200"
                }`}
              >
                {pct === 0 ? "None" : `${pct}%`}
              </button>
            ))}
          </div>
        </section>

        {/* totals */}
        <section className="mt-6 rounded-2xl bg-white border border-stone-200 p-4 text-sm shadow-sm">
          <Row label="Subtotal" value={money(totals.subtotalCents)} />
          <Row label="Delivery fee" value={money(totals.deliveryFeeCents)} />
          <Row label="Service fee" value={money(totals.serviceFeeCents)} />
          <Row label="Tax" value={money(totals.taxCents)} />
          <Row label={`Tip (${tipPercent}%)`} value={money(totals.tipCents)} />
          <div className="mt-2 flex items-center justify-between border-t border-stone-100 pt-3 text-base font-bold">
            <span>Total</span>
            <span>{money(totals.totalCents)}</span>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-[--background] via-[--background] to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6">
        <Link
          href="/checkout"
          className="mx-auto flex w-full max-w-lg items-center justify-between rounded-2xl bg-orange-600 px-5 py-4 font-semibold text-white shadow-xl shadow-orange-600/30 active:scale-[0.98] transition-transform"
        >
          <span>Go to checkout</span>
          <span>{money(totals.totalCents)}</span>
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-stone-600">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
