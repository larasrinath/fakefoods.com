import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata = {
  title: "About — FakeFoods",
};

export default function AboutPage() {
  return (
    <div className="flex-1 pb-16">
      <Header back="/" />
      <main className="px-5">
        <h1 className="mt-8 text-2xl font-bold tracking-tight">
          None of this is real. That&apos;s the point.
        </h1>

        <div className="mt-5 flex flex-col gap-4 text-[15px] leading-relaxed text-stone-600">
          <p>
            FakeFoods is a <strong>simulated food-delivery experience</strong>. The
            restaurants are fictional, the checkout is theater, no payment is ever
            taken, and nothing will ever show up at your door.
          </p>
          <p>
            It exists for one reason: sometimes the urge to order food isn&apos;t about
            hunger. It&apos;s boredom, stress, habit, a long night. And the urge wants
            the <em>ritual</em> — browsing the menus, building the order, watching the
            little driver icon crawl across the map.
          </p>
          <p>
            So we let you do the whole ritual. Pick a restaurant, customize your order,
            add the drink, tip the imaginary driver, &quot;pay&quot;, and track your
            delivery in real time — because real urges don&apos;t pass in ninety
            seconds, and neither does our tracker.
          </p>
          <p>
            When it &quot;arrives,&quot; you&apos;ll have spent nothing, eaten nothing,
            and — hopefully — the craving will have loosened its grip along the way.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-white border border-stone-200 p-5 text-sm leading-relaxed text-stone-600 shadow-sm">
          <h2 className="font-bold text-stone-800">The fine print, plainly</h2>
          <ul className="mt-3 flex flex-col gap-2 list-disc pl-4">
            <li>No payment is ever processed. There is nothing to charge.</li>
            <li>Everything stays on your device. No account, no tracking, no server.</li>
            <li>
              This is a habit tool, not medical care. It doesn&apos;t treat eating
              disorders, anxiety, or anything else — if you&apos;re struggling, please
              reach out to a professional.
            </li>
            <li>
              If you&apos;re actually hungry, close this app and eat real food. Hunger
              is not a craving to be outsmarted.
            </li>
          </ul>
        </div>

        <Link
          href="/"
          className="mt-8 block w-full rounded-2xl bg-orange-600 px-5 py-4 text-center font-semibold text-white shadow-xl shadow-orange-600/25"
        >
          Okay — let me fake-order something
        </Link>
      </main>
    </div>
  );
}
