"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRestaurantById } from "@/lib/data";
import { money } from "@/lib/format";
import { useFakeFoods } from "@/lib/store";
import { Header } from "@/components/Header";

const PAYMENT_METHODS = [
  { id: "ffpay", label: "FakeFoods Pay", detail: "Balance: plenty", emoji: "👛" },
  { id: "card", label: "Visa •••• 4242", detail: "Card on file", emoji: "💳" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lines = useFakeFoods((s) => s.lines);
  const cartRestaurantId = useFakeFoods((s) => s.cartRestaurantId);
  const totals = useFakeFoods((s) => s.totals)();
  const placeOrder = useFakeFoods((s) => s.placeOrder);

  const [address, setAddress] = useState("Home");
  const [payment, setPayment] = useState("ffpay");
  const [placing, setPlacing] = useState(false);

  const restaurant = cartRestaurantId ? getRestaurantById(cartRestaurantId) : null;

  useEffect(() => {
    if (mounted && (!restaurant || lines.length === 0) && !placing) {
      router.replace("/cart");
    }
  }, [mounted, restaurant, lines.length, placing, router]);

  if (!mounted || !restaurant || lines.length === 0) {
    return (
      <div className="flex-1">
        <Header back="/cart" />
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setPlacing(true);
    // a brief "processing payment" beat makes it feel real
    setTimeout(() => {
      placeOrder(address);
      router.push("/order/confirmed");
    }, 1400);
  };

  return (
    <div className="flex-1 pb-36">
      <Header back="/cart" />

      <main className="px-4">
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Checkout</h1>

        {/* delivery details */}
        <section className="mt-5 rounded-2xl bg-white border border-stone-200 p-4 shadow-sm">
          <h2 className="font-semibold">Delivery details</h2>
          <label className="mt-3 block text-xs font-medium text-stone-500" htmlFor="addr">
            Deliver to
          </label>
          <input
            id="addr"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-orange-400"
            placeholder="Home"
          />
          <div className="mt-3 flex items-center justify-between rounded-xl bg-stone-50 px-3.5 py-3 text-sm">
            <span className="flex items-center gap-2">
              <span>⚡</span>
              <span className="font-medium">Standard delivery</span>
            </span>
            <span className="text-stone-500">
              {restaurant.deliveryMinutes}–{restaurant.deliveryMinutes + 10} min
            </span>
          </div>
        </section>

        {/* payment */}
        <section className="mt-4 rounded-2xl bg-white border border-stone-200 p-4 shadow-sm">
          <h2 className="font-semibold">Payment</h2>
          <div className="mt-3 flex flex-col gap-2">
            {PAYMENT_METHODS.map((pm) => (
              <label
                key={pm.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 ${
                  payment === pm.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-stone-200 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={payment === pm.id}
                  onChange={() => setPayment(pm.id)}
                  className="h-4 w-4 accent-orange-600"
                />
                <span className="text-xl">{pm.emoji}</span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{pm.label}</span>
                  <span className="block text-xs text-stone-500">{pm.detail}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* order summary */}
        <section className="mt-4 rounded-2xl bg-white border border-stone-200 p-4 text-sm shadow-sm">
          <h2 className="font-semibold">
            Order summary <span className="font-normal text-stone-400">· {restaurant.name}</span>
          </h2>
          <div className="mt-2 flex items-center justify-between py-1 text-stone-600">
            <span>{lines.reduce((n, l) => n + l.quantity, 0)} items</span>
            <span>{money(totals.subtotalCents)}</span>
          </div>
          <div className="flex items-center justify-between py-1 text-stone-600">
            <span>Fees, tax & tip</span>
            <span>
              {money(
                totals.deliveryFeeCents +
                  totals.serviceFeeCents +
                  totals.taxCents +
                  totals.tipCents
              )}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-stone-100 pt-3 text-base font-bold">
            <span>Total</span>
            <span>{money(totals.totalCents)}</span>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-[--background] via-[--background] to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6">
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="mx-auto flex w-full max-w-lg items-center justify-center gap-3 rounded-2xl bg-orange-600 px-5 py-4 font-semibold text-white shadow-xl shadow-orange-600/30 active:scale-[0.98] transition-transform disabled:opacity-90"
        >
          {placing ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Processing payment…
            </>
          ) : (
            <>Place order · {money(totals.totalCents)}</>
          )}
        </button>
      </div>
    </div>
  );
}
