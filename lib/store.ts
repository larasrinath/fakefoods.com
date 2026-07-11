"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, CravingEntry, Dish, Feeling, SimOrder } from "./types";
import { DRIVERS, getRestaurantById } from "./data";

// Fee model (all cosmetic — nothing is ever charged)
const SERVICE_FEE_RATE = 0.1;
const SERVICE_FEE_CAP_CENTS = 500;
const TAX_RATE = 0.08875;

export function computeUnitPrice(dish: Dish, selectedOptionIds: string[]): number {
  let price = dish.basePriceCents;
  for (const group of dish.optionGroups ?? []) {
    for (const opt of group.options) {
      if (selectedOptionIds.includes(opt.id)) price += opt.priceDeltaCents;
    }
  }
  return price;
}

export function optionLabels(dish: Dish, selectedOptionIds: string[]): string[] {
  const labels: string[] = [];
  for (const group of dish.optionGroups ?? []) {
    for (const opt of group.options) {
      if (selectedOptionIds.includes(opt.id) && opt.priceDeltaCents >= 0)
        labels.push(opt.label);
    }
  }
  return labels;
}

type Totals = {
  subtotalCents: number;
  deliveryFeeCents: number;
  serviceFeeCents: number;
  taxCents: number;
  tipCents: number;
  totalCents: number;
};

type FakeFoodsState = {
  // cart (single restaurant at a time, like real delivery apps)
  cartRestaurantId: string | null;
  lines: CartLine[];
  tipPercent: number; // 0 | 10 | 15 | 20 | 25
  // active simulated order
  order: SimOrder | null;
  // every craving ridden out (it all stays on this device)
  history: CravingEntry[];

  addLine: (line: Omit<CartLine, "lineId">) => "added" | "different-restaurant";
  clearCartAndAdd: (line: Omit<CartLine, "lineId">) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  setTipPercent: (pct: number) => void;
  totals: () => Totals;
  placeOrder: (address: string) => SimOrder;
  completeOrder: (feeling: Feeling) => void;
};

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export const useFakeFoods = create<FakeFoodsState>()(
  persist(
    (set, get) => ({
      cartRestaurantId: null,
      lines: [],
      tipPercent: 15,
      order: null,
      history: [],

      addLine: (line) => {
        const { cartRestaurantId, lines } = get();
        if (cartRestaurantId && cartRestaurantId !== line.restaurantId && lines.length > 0) {
          return "different-restaurant";
        }
        set({
          cartRestaurantId: line.restaurantId,
          lines: [...lines, { ...line, lineId: makeId("ln") }],
        });
        return "added";
      },

      clearCartAndAdd: (line) => {
        set({
          cartRestaurantId: line.restaurantId,
          lines: [{ ...line, lineId: makeId("ln") }],
        });
      },

      updateQuantity: (lineId, quantity) => {
        if (quantity <= 0) {
          get().removeLine(lineId);
          return;
        }
        set({
          lines: get().lines.map((l) =>
            l.lineId === lineId ? { ...l, quantity } : l
          ),
        });
      },

      removeLine: (lineId) => {
        const lines = get().lines.filter((l) => l.lineId !== lineId);
        set({ lines, cartRestaurantId: lines.length ? get().cartRestaurantId : null });
      },

      setTipPercent: (pct) => set({ tipPercent: pct }),

      totals: () => {
        const { lines, tipPercent, cartRestaurantId } = get();
        const subtotalCents = lines.reduce(
          (sum, l) => sum + l.unitPriceCents * l.quantity,
          0
        );
        const restaurant = cartRestaurantId
          ? getRestaurantById(cartRestaurantId)
          : undefined;
        const deliveryFeeCents = lines.length ? restaurant?.deliveryFeeCents ?? 0 : 0;
        const serviceFeeCents = lines.length
          ? Math.min(Math.round(subtotalCents * SERVICE_FEE_RATE), SERVICE_FEE_CAP_CENTS)
          : 0;
        const taxCents = Math.round(subtotalCents * TAX_RATE);
        const tipCents = Math.round((subtotalCents * tipPercent) / 100);
        return {
          subtotalCents,
          deliveryFeeCents,
          serviceFeeCents,
          taxCents,
          tipCents,
          totalCents:
            subtotalCents + deliveryFeeCents + serviceFeeCents + taxCents + tipCents,
        };
      },

      placeOrder: (address) => {
        const { lines, cartRestaurantId } = get();
        const totals = get().totals();
        const restaurant = getRestaurantById(cartRestaurantId!);
        const driver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
        const order: SimOrder = {
          id: makeId("ff").toUpperCase(),
          restaurantId: cartRestaurantId!,
          lines,
          ...totals,
          placedAt: Date.now(),
          etaMinutes: restaurant?.deliveryMinutes ?? 20,
          driver,
          address: address.trim() || "Home",
        };
        set({ order, lines: [], cartRestaurantId: null });
        return order;
      },

      completeOrder: (feeling) => {
        const { order, history } = get();
        if (!order) return;
        const entry: CravingEntry = {
          id: makeId("cv"),
          at: Date.now(),
          restaurantId: order.restaurantId,
          restaurantName: getRestaurantById(order.restaurantId)?.name ?? "Unknown",
          totalCents: order.totalCents,
          feeling,
        };
        set({ order: null, history: [...history, entry] });
      },
    }),
    {
      name: "fakefoods",
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>;
        if (version < 1) {
          // v0 kept plain counters; fold them into a single synthetic entry
          const cents = (state.centsNotSpent as number) ?? 0;
          const history: CravingEntry[] = [];
          if (cents > 0) {
            history.push({
              id: "cv-legacy",
              at: Date.now(),
              restaurantId: "",
              restaurantName: "Earlier cravings",
              totalCents: cents,
              feeling: "better",
            });
          }
          state.history = history;
          delete state.ordersRidden;
          delete state.centsNotSpent;
        }
        return state;
      },
    }
  )
);

// Derived helpers ---------------------------------------------------------------

export function monthKey(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });
}

export function groupByMonth(history: CravingEntry[]): Map<string, CravingEntry[]> {
  const map = new Map<string, CravingEntry[]>();
  for (const e of [...history].sort((a, b) => b.at - a.at)) {
    const key = monthKey(e.at);
    map.set(key, [...(map.get(key) ?? []), e]);
  }
  return map;
}
