"use client";

import { notFound, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { dishImageSrc, restaurantImageSrc } from "@/lib/assets";
import { getDish, getRestaurant } from "@/lib/data";
import type { Dish } from "@/lib/types";
import { money, priceTier } from "@/lib/format";
import { FoodArt } from "@/components/FoodArt";
import { Header } from "@/components/Header";
import { CartBar } from "@/components/CartBar";
import { DishSheet } from "@/components/DishSheet";

export default function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const restaurant = getRestaurant(slug);
  const [openDish, setOpenDish] = useState<Dish | null>(null);

  // deep link from search: /r/[slug]?dish=<id> opens the dish sheet directly
  const dishParam = useSearchParams().get("dish");
  useEffect(() => {
    if (restaurant && dishParam) {
      const dish = getDish(restaurant, dishParam);
      if (dish) setOpenDish(dish);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dishParam, slug]);

  if (!restaurant) notFound();

  const popular = restaurant.menu
    .flatMap((s) => s.items)
    .filter((d) => d.popular);

  const sections = [
    ...(popular.length ? [{ title: "Popular", items: popular }] : []),
    ...restaurant.menu,
  ];

  return (
    <div className="flex-1 pb-28">
      <Header back="/" />

      <FoodArt
        emoji={restaurant.emoji}
        hue={restaurant.hue}
        imageSrc={restaurantImageSrc(restaurant)}
        imageAlt=""
        className="h-40 w-full"
        emojiClassName="text-7xl"
      />

      <main className="px-4">
        <div className="-mt-8 rounded-3xl bg-white border border-stone-200 p-4 shadow-sm relative">
          <h1 className="text-xl font-bold">{restaurant.name}</h1>
          <p className="mt-0.5 text-sm text-stone-500">{restaurant.tagline}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
            <span>⭐ {restaurant.rating} ({restaurant.ratingCount.toLocaleString()})</span>
            <span aria-hidden>·</span>
            <span>{restaurant.cuisine}</span>
            <span aria-hidden>·</span>
            <span>{priceTier(restaurant.priceTier)}</span>
            <span aria-hidden>·</span>
            <span>🕐 {restaurant.deliveryMinutes}–{restaurant.deliveryMinutes + 10} min</span>
            <span aria-hidden>·</span>
            <span>{money(restaurant.deliveryFeeCents)} delivery</span>
          </div>
        </div>

        {sections.map((section) => (
          <section key={section.title} className="mt-7">
            <h2 className="text-lg font-bold">{section.title}</h2>
            <div className="mt-3 flex flex-col gap-3">
              {section.items.map((dish) => (
                <button
                  key={`${section.title}-${dish.id}`}
                  onClick={() => setOpenDish(dish)}
                  className="flex items-stretch justify-between gap-3 rounded-2xl bg-white border border-stone-200 p-3 text-left shadow-sm active:scale-[0.99] transition-transform"
                >
                  <span className="flex-1 py-0.5">
                    <span className="font-semibold">{dish.name}</span>
                    <span className="mt-0.5 block text-xs text-stone-500 line-clamp-2">
                      {dish.description}
                    </span>
                    <span className="mt-1.5 block text-sm font-semibold text-stone-800">
                      {money(dish.basePriceCents)}
                    </span>
                  </span>
                  <span className="relative shrink-0">
                    <FoodArt
                      emoji={dish.emoji}
                      hue={dish.hue}
                      imageSrc={dishImageSrc(dish)}
                      imageAlt=""
                      className="h-20 w-20 rounded-xl"
                      emojiClassName="text-3xl"
                    />
                    <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-stone-200 shadow text-base font-bold text-orange-600">
                      +
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>

      {openDish && (
        <DishSheet
          restaurant={restaurant}
          dish={openDish}
          onClose={() => setOpenDish(null)}
        />
      )}

      <CartBar />
    </div>
  );
}
