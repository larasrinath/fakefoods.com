"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { RESTAURANTS } from "@/lib/data";
import type { Dish, Restaurant } from "@/lib/types";
import { money } from "@/lib/format";
import { FoodArt } from "@/components/FoodArt";
import { Header } from "@/components/Header";
import { CartBar } from "@/components/CartBar";

type DishHit = { restaurant: Restaurant; dish: Dish };

function searchAll(query: string): { restaurants: Restaurant[]; dishes: DishHit[] } {
  const q = query.trim().toLowerCase();
  if (!q) return { restaurants: [], dishes: [] };
  const restaurants = RESTAURANTS.filter((r) =>
    [r.name, r.cuisine, r.tagline, ...r.tags].some((t) =>
      t.toLowerCase().includes(q)
    )
  );
  const dishes: DishHit[] = [];
  for (const restaurant of RESTAURANTS) {
    for (const section of restaurant.menu) {
      for (const dish of section.items) {
        if (
          dish.name.toLowerCase().includes(q) ||
          dish.description.toLowerCase().includes(q)
        ) {
          dishes.push({ restaurant, dish });
        }
      }
    }
  }
  return { restaurants, dishes };
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), []);

  const { restaurants, dishes } = useMemo(() => searchAll(query), [query]);
  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex-1 pb-28">
      <Header back="/" />

      <main className="px-4">
        <div className="sticky top-14 z-30 -mx-4 bg-[--background]/95 backdrop-blur px-4 pb-3 pt-4">
          <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm focus-within:border-orange-400">
            <span aria-hidden>🔍</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pizza, ramen, something sweet…"
              aria-label="Search restaurants and dishes"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-stone-400"
            />
            {hasQuery && (
              <button
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="text-stone-400 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {!hasQuery && (
          <div className="mt-10 text-center text-sm text-stone-500">
            <p className="text-4xl" aria-hidden>
              🔎
            </p>
            <p className="mt-3">Search every menu in the city.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["pizza", "ramen", "tacos", "donuts", "spicy", "cheese"].map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasQuery && restaurants.length === 0 && dishes.length === 0 && (
          <div className="mt-10 text-center text-sm text-stone-500">
            <p className="text-4xl" aria-hidden>
              🤷
            </p>
            <p className="mt-3">
              Nothing matching “{query.trim()}” — even in a fake city.
            </p>
          </div>
        )}

        {restaurants.length > 0 && (
          <section className="mt-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-stone-400">
              Restaurants
            </h2>
            <div className="mt-2 flex flex-col gap-2">
              {restaurants.map((r) => (
                <Link
                  key={r.id}
                  href={`/r/${r.slug}`}
                  className="flex items-center gap-3 rounded-2xl bg-white border border-stone-200 p-3 shadow-sm active:scale-[0.99] transition-transform"
                >
                  <FoodArt
                    emoji={r.emoji}
                    hue={r.hue}
                    className="h-14 w-14 shrink-0 rounded-xl"
                    emojiClassName="text-2xl"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{r.name}</p>
                    <p className="truncate text-xs text-stone-500">
                      {r.cuisine} · ⭐ {r.rating} · {r.deliveryMinutes}–
                      {r.deliveryMinutes + 10} min
                    </p>
                  </div>
                  <span aria-hidden className="text-stone-300">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {dishes.length > 0 && (
          <section className="mt-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-stone-400">
              Dishes
            </h2>
            <div className="mt-2 flex flex-col gap-2">
              {dishes.map(({ restaurant, dish }) => (
                <Link
                  key={`${restaurant.id}-${dish.id}`}
                  href={`/r/${restaurant.slug}?dish=${dish.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-white border border-stone-200 p-3 shadow-sm active:scale-[0.99] transition-transform"
                >
                  <FoodArt
                    emoji={dish.emoji}
                    hue={dish.hue}
                    className="h-14 w-14 shrink-0 rounded-xl"
                    emojiClassName="text-2xl"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{dish.name}</p>
                    <p className="truncate text-xs text-stone-500">
                      {restaurant.name} · {money(dish.basePriceCents)}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-200 text-base font-bold text-orange-600"
                  >
                    +
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <CartBar />
    </div>
  );
}
