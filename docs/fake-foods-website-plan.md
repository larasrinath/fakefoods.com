# FakeFoods — Simulated Food-Ordering Experience Plan

Date: 2026-07-11
Last updated: 2026-07-11

## 1. Concept

FakeFoods is a **simulation of ordering food delivery**. It is not a store. Nothing is
ever sold, no payment is ever taken, and no food is ever delivered. The user goes
through the entire ritual of ordering — pick a restaurant, build a meal, add sides,
add-ons and drinks, review the cart, "confirm", "pay", and watch a live delivery
tracker — and then it simply ends. Nothing arrives. Nothing is charged.

The purpose is to **curb impulse food-ordering and the anxiety/urge that drives it.**
When someone feels the pull to open DoorDash/UberEats and order at 1am (or out of
boredom, stress, or habit), they can open FakeFoods instead, act out the entire
craving loop, get the dopamine of building and placing an order, and come out the
other side without spending money or ordering real food.

Think of it as a **pressure-release valve** or a placebo for the ordering compulsion —
as realistic and satisfying as a real delivery app, right up to the moment of "order
placed," then a gentle, non-judgmental landing.

## 2. Core Principle

> Give the user the *complete feeling* of ordering food, and none of the consequences.

Everything that makes real ordering satisfying should be present and feel real:

- Restaurant browsing and menus
- Building and customizing a meal
- A cart total that ticks up
- A checkout and "payment" flow
- An order confirmation
- **Live delivery tracking** (the dopamine hook — prep, driver, map, ETA)
- A "delivered" moment

Everything that makes real ordering costly is absent:

- No real payment, ever
- No real food
- No real restaurants, drivers, or personal data leaving the device
- No account required

## 3. Tone and Emotional Design

The app is a supportive tool, not a joke and not a shame machine.

Tone:

- Calm, warm, a little playful
- Never shaming ("you shouldn't eat this")
- Never clinical or medical
- Honest that it is a simulation — but the honesty comes *after* the experience,
  not as a constant interruption that breaks the immersion

The emotional arc:

1. **Craving/urge** — user arrives wanting to order.
2. **Immersion** — user builds an order that feels completely real.
3. **Release** — user "places" the order and gets the confirmation + tracking payoff.
4. **Landing** — a gentle reveal/reminder: nothing was ordered, nothing was charged,
   and an optional check-in ("Feeling better? Craving passed?").

The reveal should feel like relief, not a rug-pull. Example landing copy:

> Order placed. Nothing was charged, and nothing is on its way — but you did the whole
> thing. The urge got its moment. How are you feeling now?

## 4. What Success Looks Like

This is not measured in orders or revenue. Success = **the urge passed without a real
order.**

Signals we care about:

- User completes the flow (builds an order and "places" it)
- Time spent in the flow (enough to satisfy the ritual)
- Self-reported relief on the landing check-in
- Repeat use *as a coping tool* (came back instead of ordering real food)
- Optional: user-tracked "real orders avoided" / estimated money saved

Explicit non-goals:

- Real transactions
- Upsell / conversion
- Data monetization
- Any medical or treatment claim

## 5. Guardrails (Important)

- **This is not medical treatment or therapy.** It is a self-help / habit tool. Avoid
  claims about curing binge eating, eating disorders, addiction, or anxiety disorders.
- **Never take real payment.** No card fields that hit a processor, no real payment SDK.
  The "pay" screen is a convincing mock only.
- **No dark patterns.** The goal is to *reduce* compulsive ordering, so the app must
  not itself become a compulsion trap or manipulate the user.
- **Not a substitute for eating.** If someone is actually hungry and needs food, the
  app should never discourage real eating. Consider a gentle "actually hungry? go eat
  something real" off-ramp.
- **Privacy-first.** No account needed; keep everything on-device by default.
- **No real restaurant brands / logos / trade dress.** Use fictional restaurants.

## 6. Target User

- People who impulse-order food delivery out of boredom, stress, habit, loneliness, or
  late-night restlessness and want to break the loop.
- People trying to cut delivery spending.
- People who want the *ritual* of ordering without the food or cost.

Not for:

- People seeking clinical treatment for an eating disorder (point them to real help).
- Anyone who is actually hungry and needs to eat.

## 7. The Core Experience (End-to-End Flow)

This is the heart of the product. It should mirror a real delivery app step for step.

1. **Landing / "What are you craving?"**
   - Optional mood/craving prompt ("hungry for what?", "why are you ordering?").
   - Or skip straight to browsing.

2. **Restaurant list**
   - Grid/list of fictional restaurants with cuisine, rating, "delivery time", "delivery
     fee" (all cosmetic), promos, "trending" tags.
   - Filters: cuisine, price, rating, "under 30 min", etc.

3. **Restaurant / menu page**
   - Menu sections (Popular, Mains, Sides, Drinks, Desserts).
   - Dish cards with photo, name, price, description.

4. **Dish customization**
   - Add-ons, toppings, size, spice level, "make it a combo", special instructions.
   - Price updates live as options change.

5. **Add drinks / sides / desserts**
   - Cross-sell suggestions ("people also added…") — realistic but not manipulative.

6. **Cart**
   - Line items, quantities, edit/remove.
   - Subtotal, "delivery fee", "service fee", "tax", tip selector, total.
   - The total ticking up is part of the satisfying realism.

7. **Checkout**
   - "Delivery address" (cosmetic / optional, on-device).
   - "Delivery time" (now / schedule).
   - "Payment method" — a **fake** card/wallet UI. No real processing.
   - Place order button.

8. **Order confirmation**
   - "Order placed!" celebratory moment.
   - Order number, estimated arrival, itemized receipt.

9. **Live delivery tracking** (the payoff)
   - Status timeline: Order received → Restaurant preparing → Driver assigned →
     Picked up → On the way → Arriving → Delivered.
   - Fake but believable driver name/photo, vehicle, live-ish map with a moving marker,
     shrinking ETA.
   - Optional fake "driver messages" ("I'm 2 minutes away!").

10. **Delivered + Landing / reveal**
    - "Delivered" moment.
    - Gentle reveal: nothing was real, nothing charged.
    - Check-in: "Craving handled? Feeling better?" + optional stats ("that would have
      been ~$24 and 900 calories you didn't spend/eat").
    - Off-ramps: "do it again", "I'm actually hungry — go eat", "close".

## 8. Feature Scope

### Must Have (MVP / Phase 1)

- Restaurant list with fictional restaurants
- Restaurant menu pages with dishes
- Dish customization (add-ons, size, options) with live price
- Drinks / sides
- Cart with subtotal, fees, tip, total
- Fake checkout + fake payment screen
- Order confirmation with receipt
- Delivery tracking with status timeline and ETA countdown
- Delivered + gentle landing/reveal
- Mobile-first, works fully offline / on-device
- No account, no real data leaving the device

### Should Have (Phase 2)

- Live-ish map with moving driver marker
- Fake driver persona + messages
- "What are you craving / why are you ordering" intro prompt
- Landing check-in ("feeling better?") with simple mood capture
- "Money not spent" / "orders avoided" running tally (local)
- Save favorite fake orders / reorder
- Sound + haptics for key moments (order placed, delivered)

### Later (Phase 3+)

- Streaks / gentle habit stats ("5 cravings ridden out this week")
- Multiple cuisines / seasonal menus
- Shareable "I fake-ordered instead" cards (optional, private by default)
- Optional journaling ("what was I actually feeling?")
- Configurable realism (fast-forward tracking vs. real-time)
- Accessibility deep pass
- Optional real-help resources link for anyone who needs it

## 9. Screens / Sitemap

- `/` — Intro / "what are you craving?" or straight to restaurants
- `/restaurants` — Restaurant browse + filters
- `/restaurants/[slug]` — Menu
- `/restaurants/[slug]/[dish]` — Dish customization (or modal)
- `/cart` — Cart + tip + totals
- `/checkout` — Address, time, fake payment
- `/order/[id]/confirmed` — Order confirmation + receipt
- `/order/[id]/tracking` — Live delivery tracking
- `/order/[id]/delivered` — Delivered + landing/reveal + check-in
- `/stats` — (later) money-not-spent / cravings-ridden-out
- `/about` — What this is and why (the honest explanation)

## 10. UX / Visual Direction

- Look and feel of a **real, polished delivery app** (that's the point) — but with an
  original, fictional brand so it's clearly not impersonating anyone.
- Fast, tactile, satisfying micro-interactions: add-to-cart animation, total counting
  up, "order placed" confetti/pulse, tracking timeline advancing, ETA ticking down.
- Realistic food photography or high-quality illustration for dishes.
- Warm, appetizing palette; clean commerce-style layout.
- Delivery tracking screen should feel premium — map, moving marker, driver card,
  progress bar — because it's the emotional climax.
- The reveal/landing screen shifts tone: calmer, softer, supportive.

## 11. Data Model (prototype)

Static, on-device JSON to start.

```ts
type Restaurant = {
  id: string;
  slug: string;
  name: string;            // fictional
  cuisine: string;
  rating: number;          // cosmetic
  deliveryMinutes: number; // cosmetic estimate
  deliveryFeeCents: number;// cosmetic
  priceTier: 1 | 2 | 3;
  tags: string[];          // "trending", "late night", etc.
  image: string;
  menu: MenuSection[];
};

type MenuSection = {
  title: string;           // "Popular", "Mains", "Drinks"...
  items: Dish[];
};

type Dish = {
  id: string;
  name: string;
  description: string;
  basePriceCents: number;
  image: string;
  optionGroups?: OptionGroup[];
};

type OptionGroup = {
  id: string;
  title: string;           // "Size", "Add-ons", "Spice"
  type: "single" | "multi";
  required?: boolean;
  options: { id: string; label: string; priceDeltaCents: number }[];
};

type CartLine = {
  dishId: string;
  restaurantId: string;
  quantity: number;
  selectedOptionIds: string[];
  computedPriceCents: number;
  note?: string;
};

type SimOrder = {
  id: string;
  restaurantId: string;
  lines: CartLine[];
  subtotalCents: number;
  feesCents: number;
  tipCents: number;
  totalCents: number;
  placedAt: number;        // local timestamp
  etaMinutes: number;
};

type TrackingStage =
  | "received"
  | "preparing"
  | "driver_assigned"
  | "picked_up"
  | "on_the_way"
  | "arriving"
  | "delivered";
```

Everything lives in local state / local storage. Nothing is sent to a server.

## 12. Delivery Tracking — Simulation Design

The tracker is the signature feature. It should feel alive.

- A stage machine advances through `TrackingStage` on timers.
- ETA counts down in real time (with an optional "fast-forward" for impatient users).
- Map: a marker moves along a route toward a "your location" pin. Can be a stylized
  map + animated path rather than a real mapping service (keeps it offline + brand-safe).
- Driver persona: fictional name, avatar, vehicle, and a couple of scripted messages
  timed to stages.
- Progress bar + status label update at each stage.
- On "delivered", transition to the landing/reveal screen.

**Decision (2026-07-11): real-time.** The tracker runs at the pace of a real delivery
(ETA ~18–25 min, counting down in real time). Rationale: urges last longer than 90
seconds — riding out the full delivery window is the point. No fast-forward in the
main flow.

## 13. Technical Architecture

- **Frontend:** React + a modern full-stack framework (Next.js) or a lightweight SPA
  (Vite). No backend required for the prototype.
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Local component state + a small store (Zustand/Context) for cart + order.
- **Persistence:** localStorage / IndexedDB (favorites, stats, in-progress order).
- **Data:** Static JSON catalog of fictional restaurants, menus, dishes.
- **Map/tracking:** Self-contained animated map (SVG/canvas) — no external map API to
  keep it offline, private, and brand-safe.
- **No payment SDK.** Fake payment UI only.
- **Deployment:** Vercel/Netlify, or installable PWA so it's one tap away when the urge
  hits (PWA/offline is a strong fit for the use case).

Prototype path:

1. Static restaurant/menu JSON.
2. Build the flow: browse → menu → customize → cart → checkout → confirm.
3. Add the delivery tracking simulation.
4. Add the delivered/landing reveal + check-in.
5. Add persistence (favorites, stats, "money not spent").

## 14. Seed Content

Start with ~5 fictional restaurants across cuisines so the browse + filter feels real:

1. **Midnight Slice** — pizza (late night)
2. **Bunbao** — burgers / American
3. **Green Bowl** — healthy / bowls
4. **Sakura Express** — sushi / Japanese
5. **Sugar Hour** — desserts / drinks

Each with 6–10 dishes, options, and drinks — enough to make a satisfying order and
exercise customization, cart totals, and cross-sell.

## 15. Implementation Phases

### Phase 1 — Core Ordering Simulation
Goal: prove the ritual feels satisfying.
- App shell (mobile-first, PWA-ready)
- Restaurant list + menu pages (static JSON)
- Dish customization with live pricing
- Cart with fees, tip, total
- Fake checkout + fake payment
- Order confirmation + receipt
- Basic delivery tracking (status timeline + ETA countdown)
- Delivered + gentle landing/reveal

Exit criteria: a user can build an order, "pay", watch it "arrive", and land on the
reveal — and it feels real enough to scratch the itch.

### Phase 2 — Immersion + Support
Goal: maximize the dopamine payoff and the supportive landing.
- Animated map + moving driver
- Driver persona + messages
- Intro craving prompt
- Landing check-in ("feeling better?")
- "Money not spent" / cravings-ridden-out tally
- Favorites / reorder
- Sound + haptics

Exit criteria: the tracking screen is a genuine payoff, and the landing consistently
lands as relief.

### Phase 3 — Habit Support
- Streaks / gentle stats
- Journaling / mood capture
- More restaurants / seasonal menus
- Configurable realism
- Accessibility deep pass
- Optional real-help resources

## 16. Decisions

Resolved 2026-07-11:

- **Tracking speed: real-time.** Urges last longer than a compressed animation — the
  tracker matches a real delivery window (~18–25 min).
- **Reveal: at the end.** The flow stays fully immersive; the gentle reveal happens on
  the delivered screen. `/about` is honest for anyone who reads it.

Still open:

- How explicit should the "money saved / calories avoided" framing be? Risk of it
  feeling shame-y — keep it optional and neutral.
- Web app, installable PWA, or native later? (PWA is the fastest path to "one tap when
  the urge hits.")
- Do we ever add an "I'm actually hungry" off-ramp that encourages real eating? (Yes —
  recommended, to avoid discouraging genuine hunger.)
- Fully offline/on-device only, or optional cloud sync for stats across devices later?

## 17. Recommended Next Step

Build the **Phase 1 core ordering simulation** with static data — browse → menu →
customize → cart → fake checkout → confirmation → basic tracking → delivered/reveal.
That's the smallest thing that can actually test the core hypothesis: *does acting out
the full order loop relieve the urge to place a real one?*
