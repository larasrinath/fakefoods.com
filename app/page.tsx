"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dishImageSrc } from "@/lib/assets";
import { CUISINES, RESTAURANTS } from "@/lib/data";
import { money, priceTier } from "@/lib/format";
import { FoodArt } from "@/components/FoodArt";
import { Header } from "@/components/Header";
import { CartBar } from "@/components/CartBar";
import { useFakeFoods } from "@/lib/store";
import type { Restaurant } from "@/lib/types";

function featuredDishFor(restaurant: Restaurant) {
  const dishes = restaurant.menu.flatMap((section) => section.items);
  return dishes.find((dish) => dish.popular) ?? dishes[0];
}

export default function BrowsePage() {
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const activeOrder = useFakeFoods((s) => s.order);

  const restaurants = cuisine
    ? RESTAURANTS.filter((r) => r.cuisine === cuisine)
    : RESTAURANTS;

  return (
    <div className="flex-1 pb-28">
      <Header />

      <main className="px-4">
        <h1 className="mt-6 text-2xl font-bold tracking-tight">
          What are you craving?
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Order it. Feel it. Skip the consequences.
        </p>

        {/* search entry — navigates to /search */}
        <Link
          href="/search"
          className="mt-4 flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-[15px] text-stone-400 shadow-sm"
        >
          <span aria-hidden>🔍</span>
          Pizza, ramen, something sweet…
        </Link>

        {mounted && activeOrder && (
          <Link
            href="/order/tracking"
            className="mt-4 flex items-center justify-between rounded-2xl bg-stone-900 px-4 py-3.5 text-white animate-pop-in"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 animate-ping-soft" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </span>
              Your order is on its way
            </span>
            <span className="text-sm text-stone-300">Track →</span>
          </Link>
        )}

        {/* cuisine filter */}
        <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          <button
            onClick={() => setCuisine(null)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border ${
              cuisine === null
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-600 border-stone-200"
            }`}
          >
            All
          </button>
          {CUISINES.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c === cuisine ? null : c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border ${
                cuisine === c
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-600 border-stone-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* restaurant cards */}
        <div className="mt-4 flex flex-col gap-4">
          {restaurants.map((r) => {
            const featuredDish = featuredDishFor(r);

            return (
              <Link
                key={r.id}
                href={`/r/${r.slug}`}
                className="overflow-hidden rounded-3xl bg-white border border-stone-200 shadow-sm active:scale-[0.99] transition-transform"
              >
                <div className="relative">
                  <FoodArt
                    emoji={featuredDish.emoji}
                    hue={featuredDish.hue}
                    imageSrc={dishImageSrc(featuredDish)}
                    imageAlt=""
                    className="h-56 w-full"
                    emojiClassName="text-6xl"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-bold text-lg">{r.name}</h2>
                    <span className="flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-sm font-semibold">
                      ⭐ {r.rating}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-stone-500">{r.tagline}</p>
                  <p className="mt-1 text-xs font-medium text-stone-400">
                    Featured: {featuredDish.name}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
                    <span>{r.cuisine}</span>
                    <span aria-hidden>·</span>
                    <span>{priceTier(r.priceTier)}</span>
                    <span aria-hidden>·</span>
                    <span>🕐 {r.deliveryMinutes}–{r.deliveryMinutes + 10} min</span>
                    <span aria-hidden>·</span>
                    <span>{money(r.deliveryFeeCents)} delivery</span>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    {r.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <CartBar />
    </div>
  );
}
