"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRestaurantById } from "@/lib/data";
import { useFakeFoods } from "@/lib/store";
import {
  STAGES,
  currentStage,
  driverMessages,
  driverRouteProgress,
  etaClock,
  minutesRemaining,
  stageIndex,
} from "@/lib/tracking";
import { TrackingMap } from "@/components/TrackingMap";

export default function TrackingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const order = useFakeFoods((s) => s.order);

  useEffect(() => setMounted(true), []);

  // real-time tick
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (mounted && !order) router.replace("/");
  }, [mounted, order, router]);

  // when the delivery completes, move to the delivered/landing screen
  const stage = order ? currentStage(order, now) : "received";
  useEffect(() => {
    if (order && stage === "delivered") {
      const t = setTimeout(() => router.push("/order/delivered"), 2200);
      return () => clearTimeout(t);
    }
  }, [order, stage, router]);

  if (!mounted || !order) return <div className="flex-1" />;

  const restaurant = getRestaurantById(order.restaurantId)!;
  const idx = stageIndex(stage);
  const mins = minutesRemaining(order, now);
  const msgs = driverMessages(order, now);
  const driverVisible = idx >= stageIndex("driver_assigned");

  return (
    <div className="flex-1 pb-12">
      <main className="px-4 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-stone-500">
              {stage === "delivered" ? "Your order" : "Estimated arrival"}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              {stage === "delivered" ? (
                "Delivered 🎉"
              ) : (
                <>
                  {etaClock(order)}
                  <span className="ml-2 align-middle text-base font-semibold text-stone-400">
                    {mins} min
                  </span>
                </>
              )}
            </h1>
          </div>
          <Link
            href="/"
            className="mt-1 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500"
          >
            Browse
          </Link>
        </div>

        {/* status line + progress */}
        <p className="mt-3 text-sm font-medium text-stone-700">
          {STAGES[idx].label}
          {stage !== "delivered" && <AnimatedDots />}
        </p>
        <div className="mt-2 flex gap-1.5">
          {STAGES.slice(0, -1).map((s, i) => (
            <div
              key={s.stage}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-700 ${
                i <= idx ? "bg-orange-600" : "bg-stone-200"
              }`}
            />
          ))}
        </div>

        {/* map — full-bleed */}
        <div className="mt-5 -mx-4 border-y border-stone-200 shadow-sm">
          <TrackingMap
            restaurant={restaurant}
            routeProgress={driverRouteProgress(order, now)}
            driverEmoji={order.driver.emoji}
            showDriver={driverVisible}
          />
        </div>

        {/* driver card */}
        {driverVisible && (
          <section className="mt-4 flex items-center gap-3 rounded-2xl bg-white border border-stone-200 p-4 shadow-sm animate-pop-in">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-2xl">
              {order.driver.emoji}
            </span>
            <div className="flex-1">
              <p className="font-semibold">{order.driver.name}</p>
              <p className="text-xs text-stone-500">
                {order.driver.vehicle} · ⭐ {order.driver.rating}
              </p>
            </div>
            <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-500">
              Your driver
            </span>
          </section>
        )}

        {/* driver messages */}
        {msgs.length > 0 && (
          <section className="mt-4 flex flex-col gap-2">
            {msgs.map((m) => (
              <div
                key={m.at}
                className="max-w-[85%] rounded-2xl rounded-tl-md bg-white border border-stone-200 px-4 py-2.5 text-sm shadow-sm animate-pop-in"
              >
                {m.text}
                <span className="mt-1 block text-[10px] text-stone-400">
                  {new Date(m.at).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </section>
        )}

        {/* order summary strip */}
        <section className="mt-4 rounded-2xl bg-white border border-stone-200 p-4 text-sm shadow-sm">
          <p className="font-semibold">{restaurant.name}</p>
          <p className="mt-0.5 text-xs text-stone-500">
            {order.lines.reduce((n, l) => n + l.quantity, 0)} items · Order {order.id} ·
            Deliver to {order.address}
          </p>
        </section>

        {stage === "delivered" && (
          <Link
            href="/order/delivered"
            className="mt-5 block w-full rounded-2xl bg-stone-900 px-5 py-4 text-center font-semibold text-white shadow-xl animate-pop-in"
          >
            Your order has arrived →
          </Link>
        )}
      </main>
    </div>
  );
}

function AnimatedDots() {
  return (
    <span className="inline-flex w-6 justify-start" aria-hidden>
      <span className="animate-pulse">…</span>
    </span>
  );
}
