export type OptionGroup = {
  id: string;
  title: string; // "Size", "Add-ons", "Spice"
  type: "single" | "multi";
  required?: boolean;
  options: { id: string; label: string; priceDeltaCents: number }[];
};

export type Dish = {
  id: string;
  name: string;
  description: string;
  basePriceCents: number;
  emoji: string; // placeholder art
  hue: number; // gradient hue for the card art
  popular?: boolean;
  optionGroups?: OptionGroup[];
};

export type MenuSection = {
  title: string; // "Popular", "Mains", "Drinks"...
  items: Dish[];
};

export type Restaurant = {
  id: string;
  slug: string;
  name: string; // fictional
  cuisine: string;
  tagline: string;
  rating: number; // cosmetic
  ratingCount: number; // cosmetic
  deliveryMinutes: number; // real-time tracking window
  deliveryFeeCents: number; // cosmetic
  priceTier: 1 | 2 | 3;
  tags: string[]; // "Trending", "Late night", etc.
  emoji: string;
  hue: number;
  /** Position on the stylized city map (street intersections, 400×300 viewBox). */
  mapPos: { x: number; y: number };
  menu: MenuSection[];
};

export type CartLine = {
  lineId: string;
  restaurantId: string;
  dishId: string;
  quantity: number;
  selectedOptionIds: string[];
  unitPriceCents: number; // base + selected option deltas
  note?: string;
};

export type TrackingStage =
  | "received"
  | "preparing"
  | "driver_assigned"
  | "picked_up"
  | "on_the_way"
  | "arriving"
  | "delivered";

export type Driver = {
  name: string;
  emoji: string;
  vehicle: string;
  rating: number;
};

export type Feeling = "better" | "still" | "hungry";

/** One completed simulated order — a craving ridden out. */
export type CravingEntry = {
  id: string;
  at: number; // completed timestamp (ms)
  restaurantId: string;
  restaurantName: string;
  totalCents: number;
  feeling: Feeling;
};

export type SimOrder = {
  id: string;
  restaurantId: string;
  lines: CartLine[];
  subtotalCents: number;
  deliveryFeeCents: number;
  serviceFeeCents: number;
  taxCents: number;
  tipCents: number;
  totalCents: number;
  placedAt: number; // local timestamp (ms)
  etaMinutes: number; // real-time delivery window
  driver: Driver;
  address: string;
};
