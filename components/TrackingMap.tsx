"use client";

import { useEffect, useRef, useState } from "react";
import { RESTAURANTS } from "@/lib/data";
import type { Restaurant } from "@/lib/types";

// Stylized, self-contained city map (no external map service).
// Every restaurant lives at a fixed street intersection; the delivery route is
// computed from the ordering restaurant's pin to home.

export const HOME = { x: 365, y: 40 };
const V_STREETS = [40, 110, 180, 250, 320];

/** Manhattan-style route from a restaurant to home along the street grid. */
function routePath(from: { x: number; y: number }): string {
  const { x: sx, y: sy } = from;
  const { x: hx, y: hy } = HOME;
  if (sy === hy) return `M ${sx} ${sy} L ${hx} ${hy}`;
  // jog via the vertical street closest to the midpoint (nicer than a plain L)
  const mid = (sx + hx) / 2;
  const mx = V_STREETS.reduce(
    (best, s) =>
      s !== sx && Math.abs(s - mid) < Math.abs(best - mid) ? s : best,
    V_STREETS.find((s) => s !== sx) ?? sx
  );
  if (mx === sx) return `M ${sx} ${sy} L ${sx} ${hy} L ${hx} ${hy}`;
  return `M ${sx} ${sy} L ${mx} ${sy} L ${mx} ${hy} L ${hx} ${hy}`;
}

export function TrackingMap({
  restaurant,
  routeProgress,
  driverEmoji,
  showDriver,
}: {
  restaurant: Restaurant;
  routeProgress: number;
  driverEmoji: string;
  showDriver: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pos, setPos] = useState(restaurant.mapPos);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(len * Math.min(1, Math.max(0, routeProgress)));
    setPos({ x: pt.x, y: pt.y });
  }, [routeProgress]);

  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full bg-[#eef3ea]"
      role="img"
      aria-label="Live delivery map"
    >
      {/* water + parks */}
      <rect x="48" y="48" width="54" height="49" rx="6" fill="#d7e6f2" />
      <rect x="258" y="178" width="54" height="49" rx="6" fill="#dcead2" />
      <rect x="118" y="243" width="124" height="40" rx="6" fill="#dcead2" />
      <rect x="188" y="48" width="54" height="49" rx="6" fill="#e7e2d5" />

      {/* street grid */}
      <g stroke="#ffffff" strokeWidth="10" strokeLinecap="round">
        {V_STREETS.map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="300" />
        ))}
        {[40, 105, 170, 235].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} />
        ))}
      </g>
      <g stroke="#f4f1ea" strokeWidth="3">
        {[75, 145, 215, 285, 355].map((x) => (
          <line key={`mv${x}`} x1={x} y1="0" x2={x} y2="300" />
        ))}
        {[72, 137, 202, 268].map((y) => (
          <line key={`mh${y}`} x1="0" y1={y} x2="400" y2={y} />
        ))}
      </g>

      {/* other restaurants, faded into the city */}
      {RESTAURANTS.filter((r) => r.id !== restaurant.id).map((r) => (
        <g key={r.id} transform={`translate(${r.mapPos.x}, ${r.mapPos.y})`} opacity="0.55">
          <circle r="10" fill="#ffffff" stroke="#d6d3d1" strokeWidth="1.5" />
          <text y="4" textAnchor="middle" fontSize="10">
            {r.emoji}
          </text>
        </g>
      ))}

      {/* route */}
      <path
        ref={pathRef}
        d={routePath(restaurant.mapPos)}
        fill="none"
        stroke="#1c1917"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="1 9"
      />

      {/* ordering restaurant pin */}
      <g transform={`translate(${restaurant.mapPos.x}, ${restaurant.mapPos.y})`}>
        <circle r="15" fill="#ea580c" />
        <circle r="15" fill="none" stroke="#ea580c" strokeWidth="2" opacity="0.35">
          <animate attributeName="r" values="15;22" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <text y="5" textAnchor="middle" fontSize="14">
          {restaurant.emoji}
        </text>
      </g>

      {/* home pin */}
      <g transform={`translate(${HOME.x}, ${HOME.y})`}>
        <circle r="14" fill="#1c1917" />
        <text y="5" textAnchor="middle" fontSize="13">
          🏠
        </text>
      </g>

      {/* driver */}
      {showDriver && (
        <g
          style={{ transition: "transform 0.9s linear" }}
          transform={`translate(${pos.x}, ${pos.y})`}
        >
          <circle r="16" fill="#ffffff" stroke="#ea580c" strokeWidth="3" />
          <text y="5" textAnchor="middle" fontSize="14">
            {driverEmoji}
          </text>
        </g>
      )}
    </svg>
  );
}
