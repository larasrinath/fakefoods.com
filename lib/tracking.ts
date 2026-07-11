import type { SimOrder, TrackingStage } from "./types";

// The tracker runs in real time: stage is a pure function of elapsed time vs the
// order's ETA, so it survives reloads — close the app, come back, the "delivery"
// has progressed like a real one.

export const STAGES: { stage: TrackingStage; label: string; from: number }[] = [
  { stage: "received", label: "Order received", from: 0 },
  { stage: "preparing", label: "Restaurant is preparing your order", from: 0.04 },
  { stage: "driver_assigned", label: "Driver assigned", from: 0.38 },
  { stage: "picked_up", label: "Order picked up", from: 0.5 },
  { stage: "on_the_way", label: "On the way", from: 0.56 },
  { stage: "arriving", label: "Arriving now", from: 0.92 },
  { stage: "delivered", label: "Delivered", from: 1 },
];

/** Progress through the delivery window, 0..1 (can exceed 1 after delivery). */
export function orderProgress(order: SimOrder, now: number): number {
  const elapsedMs = now - order.placedAt;
  return elapsedMs / (order.etaMinutes * 60_000);
}

export function currentStage(order: SimOrder, now: number): TrackingStage {
  const p = orderProgress(order, now);
  let stage: TrackingStage = "received";
  for (const s of STAGES) {
    if (p >= s.from) stage = s.stage;
  }
  return stage;
}

export function stageIndex(stage: TrackingStage): number {
  return STAGES.findIndex((s) => s.stage === stage);
}

export function minutesRemaining(order: SimOrder, now: number): number {
  const remainingMs = order.placedAt + order.etaMinutes * 60_000 - now;
  return Math.max(0, Math.ceil(remainingMs / 60_000));
}

export function etaClock(order: SimOrder): string {
  const eta = new Date(order.placedAt + order.etaMinutes * 60_000);
  return eta.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** Driver messages that appear as the delivery progresses. */
export function driverMessages(
  order: SimOrder,
  now: number
): { at: number; text: string }[] {
  const p = orderProgress(order, now);
  const msgs: { at: number; text: string }[] = [];
  const t = (frac: number) => order.placedAt + frac * order.etaMinutes * 60_000;
  if (p >= 0.5)
    msgs.push({
      at: t(0.5),
      text: `Hi! I've got your order from the restaurant — heading your way now. – ${order.driver.name}`,
    });
  if (p >= 0.8)
    msgs.push({ at: t(0.8), text: "Almost there, about 5 minutes out! 🚴" });
  if (p >= 0.95)
    msgs.push({ at: t(0.95), text: "I'm outside! Leaving it at your door. 🙌" });
  return msgs;
}

/**
 * Driver position along a stylized route, 0..1.
 * 0 until pickup, then eases toward the destination.
 */
export function driverRouteProgress(order: SimOrder, now: number): number {
  const p = orderProgress(order, now);
  const pickupAt = 0.5;
  if (p <= pickupAt) return 0;
  const travel = Math.min(1, (p - pickupAt) / (1 - pickupAt));
  // ease-in-out so the marker doesn't move robotically
  return travel < 0.5
    ? 2 * travel * travel
    : 1 - Math.pow(-2 * travel + 2, 2) / 2;
}
