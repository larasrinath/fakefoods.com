"use client";

import { useMemo, useState } from "react";
import { dishImageSrc } from "@/lib/assets";
import type { Dish, Restaurant } from "@/lib/types";
import { computeUnitPrice, useFakeFoods } from "@/lib/store";
import { money } from "@/lib/format";
import { FoodArt } from "./FoodArt";

export function DishSheet({
  restaurant,
  dish,
  onClose,
}: {
  restaurant: Restaurant;
  dish: Dish;
  onClose: () => void;
}) {
  const addLine = useFakeFoods((s) => s.addLine);
  const clearCartAndAdd = useFakeFoods((s) => s.clearCartAndAdd);

  // Preselect the first option of every required single-choice group.
  const [selected, setSelected] = useState<string[]>(() =>
    (dish.optionGroups ?? [])
      .filter((g) => g.type === "single" && g.required)
      .map((g) => g.options[0].id)
  );
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [conflict, setConflict] = useState(false);

  const unitPrice = useMemo(
    () => computeUnitPrice(dish, selected),
    [dish, selected]
  );

  const toggle = (groupId: string, optionId: string, type: "single" | "multi") => {
    const group = dish.optionGroups!.find((g) => g.id === groupId)!;
    setSelected((prev) => {
      if (type === "multi") {
        return prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId];
      }
      const others = prev.filter((id) => !group.options.some((o) => o.id === id));
      // allow deselecting a non-required single choice
      if (!group.required && prev.includes(optionId)) return others;
      return [...others, optionId];
    });
  };

  const line = {
    restaurantId: restaurant.id,
    dishId: dish.id,
    quantity,
    selectedOptionIds: selected,
    unitPriceCents: unitPrice,
    note: note.trim() || undefined,
  };

  const handleAdd = () => {
    const result = addLine(line);
    if (result === "different-restaurant") {
      setConflict(true);
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-white animate-slide-up">
        <FoodArt
          emoji={dish.emoji}
          hue={dish.hue}
          imageSrc={dishImageSrc(dish)}
          imageAlt=""
          imageFit="contain"
          className="aspect-square w-full rounded-t-3xl bg-stone-100"
          emojiClassName="text-7xl animate-float-slow"
        />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow text-lg"
        >
          ✕
        </button>

        <div className="p-5 pb-32">
          <h2 className="text-xl font-bold">{dish.name}</h2>
          <p className="mt-1 text-sm text-stone-500">{dish.description}</p>
          <p className="mt-2 font-semibold text-stone-800">{money(dish.basePriceCents)}</p>

          {(dish.optionGroups ?? []).map((group) => (
            <fieldset key={group.id} className="mt-6">
              <legend className="flex items-baseline gap-2 font-semibold">
                {group.title}
                {group.required ? (
                  <span className="text-xs font-medium text-orange-600">Required</span>
                ) : (
                  <span className="text-xs font-medium text-stone-400">Optional</span>
                )}
              </legend>
              <div className="mt-2 divide-y divide-stone-100 rounded-2xl border border-stone-200 bg-white">
                {group.options.map((opt) => {
                  const checked = selected.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type={group.type === "single" ? "radio" : "checkbox"}
                          name={group.id}
                          checked={checked}
                          onChange={() => toggle(group.id, opt.id, group.type)}
                          onClick={() => {
                            // allow radio deselect for optional single groups
                            if (group.type === "single" && !group.required && checked)
                              toggle(group.id, opt.id, group.type);
                          }}
                          className="h-4 w-4 accent-orange-600"
                        />
                        <span className="text-sm">{opt.label}</span>
                      </span>
                      {opt.priceDeltaCents > 0 && (
                        <span className="text-sm text-stone-500">
                          +{money(opt.priceDeltaCents)}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <div className="mt-6">
            <label className="font-semibold" htmlFor="dish-note">
              Special instructions
            </label>
            <textarea
              id="dish-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Extra napkins, ring the bell, etc."
              rows={2}
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
            />
          </div>
        </div>

        {/* sticky footer */}
        <div className="sticky bottom-0 flex items-center gap-3 border-t border-stone-100 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center rounded-full border border-stone-200">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-11 w-11 text-xl text-stone-600"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="h-11 w-11 text-xl text-stone-600"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="flex flex-1 items-center justify-between rounded-2xl bg-orange-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/25 active:scale-[0.98] transition-transform"
          >
            <span>Add to cart</span>
            <span>{money(unitPrice * quantity)}</span>
          </button>
        </div>

        {conflict && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 p-6">
            <div className="w-full rounded-3xl bg-white p-6 animate-pop-in">
              <h3 className="font-bold text-lg">Start a new cart?</h3>
              <p className="mt-2 text-sm text-stone-500">
                Your cart has items from another restaurant. Adding this will clear it.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setConflict(false)}
                  className="flex-1 rounded-2xl border border-stone-200 py-3 font-semibold"
                >
                  Keep cart
                </button>
                <button
                  onClick={() => {
                    clearCartAndAdd(line);
                    onClose();
                  }}
                  className="flex-1 rounded-2xl bg-orange-600 py-3 font-semibold text-white"
                >
                  New cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
