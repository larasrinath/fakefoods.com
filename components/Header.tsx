"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { appLogoMarkSrc } from "@/lib/assets";
import { useFakeFoods } from "@/lib/store";

export function Header({ back }: { back?: string }) {
  // Avoid hydration mismatch: cart count comes from localStorage.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = useFakeFoods((s) =>
    s.lines.reduce((sum, l) => sum + l.quantity, 0)
  );

  return (
    <header className="sticky top-0 z-40 bg-[--background]/90 backdrop-blur border-b border-stone-200">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          {back && (
            <Link
              href={back}
              aria-label="Back"
              className="mr-1 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-stone-200 text-lg"
            >
              ←
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Image
              src={appLogoMarkSrc}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-cover"
              aria-hidden
            />
            <span>
              fake<span className="text-orange-600">foods</span>
            </span>
          </Link>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            href="/about"
            className="text-sm text-stone-500 hover:text-stone-800 px-2 py-1"
          >
            about
          </Link>
          <Link
            href="/stats"
            aria-label="Savings"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-stone-200 text-lg"
          >
            💸
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-stone-200 text-lg"
          >
            🛒
            {mounted && count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
