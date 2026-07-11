"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { money } from "@/lib/format";
import { groupByMonth, monthKey, monthLabel, useFakeFoods } from "@/lib/store";
import type { Feeling } from "@/lib/types";
import { Header } from "@/components/Header";

const ACCENT = "#ea580c"; // current month (emphasis)
const CONTEXT = "#78716c"; // past months (de-emphasis)

const FEELINGS: { key: Feeling; emoji: string; label: string }[] = [
  { key: "better", emoji: "😌", label: "Felt better after" },
  { key: "still", emoji: "😕", label: "Still craving after" },
  { key: "hungry", emoji: "🍽️", label: "Was actually hungry" },
];

/** Last n month keys, oldest → newest, ending at the current month. */
function lastMonths(n: number): string[] {
  const out: string[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = n - 1; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(monthKey(m.getTime()));
  }
  return out;
}

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const history = useFakeFoods((s) => s.history);

  if (!mounted) {
    return (
      <div className="flex-1">
        <Header back="/" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex-1">
        <Header back="/" />
        <main className="flex flex-col items-center px-6 pt-24 text-center">
          <span className="text-6xl">💸</span>
          <h1 className="mt-4 text-xl font-bold">No cravings ridden out yet</h1>
          <p className="mt-2 max-w-sm text-sm text-stone-500">
            Every fake order you complete lands here — with a running total of what
            it would have cost for real.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-2xl bg-orange-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/25"
          >
            Ride out a craving
          </Link>
        </main>
      </div>
    );
  }

  const nowKey = monthKey(Date.now());
  const byMonth = groupByMonth(history);
  const thisMonth = byMonth.get(nowKey) ?? [];
  const monthCents = thisMonth.reduce((s, e) => s + e.totalCents, 0);
  const allCents = history.reduce((s, e) => s + e.totalCents, 0);
  const avgCents = Math.round(allCents / history.length);

  // chart data: last 6 months, zero-filled
  const months = lastMonths(6);
  const chart = months.map((key) => ({
    key,
    cents: (byMonth.get(key) ?? []).reduce((s, e) => s + e.totalCents, 0),
  }));
  const maxCents = Math.max(...chart.map((c) => c.cents), 1);

  // chart geometry
  const W = 340;
  const H = 150;
  const plotH = 112;
  const baseline = 128;
  const band = W / chart.length;
  const barW = 24;

  const feelingCounts = FEELINGS.map((f) => ({
    ...f,
    count: history.filter((e) => e.feeling === f.key).length,
  }));

  return (
    <div className="flex-1 pb-16">
      <Header back="/" />
      <main className="px-4">
        {/* hero */}
        <section className="mt-6">
          <p className="text-sm text-stone-500">
            Saved in {monthLabel(nowKey).split(" ")[0]} — money you didn&apos;t spend
          </p>
          <p className="mt-1 text-5xl font-bold tracking-tight">{money(monthCents)}</p>
          <p className="mt-1.5 text-sm text-stone-500">
            {thisMonth.length} craving{thisMonth.length === 1 ? "" : "s"} ridden out
            this month
          </p>
        </section>

        {/* KPI row */}
        <section className="mt-6 grid grid-cols-3 gap-3">
          <StatTile label="All-time saved" value={money(allCents)} />
          <StatTile label="Cravings ridden" value={String(history.length)} />
          <StatTile label="Avg per craving" value={money(avgCents)} />
        </section>

        {/* monthly chart — emphasis: this month in accent, context in gray */}
        <section className="mt-6 rounded-2xl bg-white border border-stone-200 p-4 shadow-sm">
          <h2 className="font-semibold">Last 6 months</h2>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mt-3 w-full"
            role="img"
            aria-label="Money saved per month over the last six months"
          >
            {/* baseline (hairline) */}
            <line x1="0" y1={baseline} x2={W} y2={baseline} stroke="#e7e5e4" strokeWidth="1" />
            {chart.map((c, i) => {
              const h = Math.round((c.cents / maxCents) * plotH);
              const x = i * band + (band - barW) / 2;
              const y = baseline - h;
              const isNow = c.key === nowKey;
              const fill = isNow ? ACCENT : CONTEXT;
              return (
                <g key={c.key}>
                  <title>{`${monthLabel(c.key)}: ${money(c.cents)}`}</title>
                  {c.cents > 0 && (
                    // 4px rounded data-end, square baseline
                    <path
                      d={`M ${x} ${baseline} L ${x} ${y + 4} Q ${x} ${y} ${x + 4} ${y} L ${x + barW - 4} ${y} Q ${x + barW} ${y} ${x + barW} ${y + 4} L ${x + barW} ${baseline} Z`}
                      fill={fill}
                    />
                  )}
                  {/* direct label on the emphasized month only */}
                  {isNow && c.cents > 0 && (
                    <text
                      x={x + barW / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#1c1917"
                    >
                      {money(c.cents)}
                    </text>
                  )}
                  <text
                    x={i * band + band / 2}
                    y={H - 6}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#78716c"
                  >
                    {monthLabel(c.key).slice(0, 3)}
                  </text>
                </g>
              );
            })}
          </svg>
        </section>

        {/* feelings breakdown */}
        <section className="mt-4 rounded-2xl bg-white border border-stone-200 p-4 shadow-sm">
          <h2 className="font-semibold">How they ended</h2>
          <div className="mt-2">
            {feelingCounts.map((f) => (
              <div
                key={f.key}
                className="flex items-center justify-between py-2 text-sm text-stone-600"
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden>{f.emoji}</span> {f.label}
                </span>
                <span className="font-semibold text-stone-800">{f.count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* month-by-month log (table view) */}
        {[...byMonth.entries()].map(([key, entries]) => (
          <section key={key} className="mt-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-bold">{monthLabel(key)}</h2>
              <span className="text-sm font-semibold text-stone-500">
                {money(entries.reduce((s, e) => s + e.totalCents, 0))} saved
              </span>
            </div>
            <div className="mt-2 divide-y divide-stone-100 rounded-2xl bg-white border border-stone-200 shadow-sm">
              {entries.map((e) => (
                <div key={e.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold">{e.restaurantName}</p>
                    <p className="mt-0.5 text-xs text-stone-500">
                      {new Date(e.at).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      ·{" "}
                      {new Date(e.at).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}{" "}
                      · {FEELINGS.find((f) => f.key === e.feeling)?.emoji}
                    </p>
                  </div>
                  <span className="font-semibold">{money(e.totalCents)}</span>
                </div>
              ))}
            </div>
          </section>
        ))}

        <p className="mt-8 text-center text-xs text-stone-400">
          All of this stays on your device.
        </p>
      </main>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white border border-stone-200 p-3 shadow-sm">
      <p className="text-[11px] text-stone-500">{label}</p>
      <p className="mt-1 text-lg font-bold tracking-tight">{value}</p>
    </div>
  );
}
