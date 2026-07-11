"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useFakeFoods } from "@/lib/store";
import { money } from "@/lib/format";

/** Floating "view cart" bar shown on browse/menu pages when the cart has items. */
export function CartBar() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const lines = useFakeFoods((s) => s.lines);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0);

  if (!mounted || count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 px-4 pointer-events-none">
      <Link
        href="/cart"
        className="pointer-events-auto mx-auto flex w-full max-w-lg items-center justify-between rounded-2xl bg-orange-600 px-5 py-4 text-white shadow-xl shadow-orange-600/30 animate-slide-up"
      >
        <span className="flex items-center gap-2 font-semibold">
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/25 px-1.5 text-sm font-bold">
            {count}
          </span>
          View cart
        </span>
        <span className="font-bold">{money(subtotal)}</span>
      </Link>
    </div>
  );
}
