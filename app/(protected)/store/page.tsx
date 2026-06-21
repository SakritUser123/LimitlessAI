'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const featuredProducts = [
  {
    name: 'Whey Protein Isolate',
    category: 'Protein',
    price: '$39.99',
    rating: '4.8',
    description: 'Fast-digesting protein powder to support recovery and help make daily protein targets easier to hit.',
    highlights: ['25g protein', 'Low sugar', 'Post-workout friendly'],
    accent: 'from-blue-500 to-cyan-500',
    badge: 'Best Seller',
  },
  {
    name: 'Greens + Fiber Blend',
    category: 'Daily Wellness',
    price: '$29.99',
    rating: '4.7',
    description: 'A convenient mix of greens, fiber, and digestive support ingredients for everyday nutrition coverage.',
    highlights: ['5g fiber', 'Easy morning mix', 'Supports digestion'],
    accent: 'from-emerald-500 to-teal-500',
    badge: 'Daily Pick',
  },
  {
    name: 'Electrolyte Hydration Sticks',
    category: 'Hydration',
    price: '$18.99',
    rating: '4.6',
    description: 'Portable hydration packets designed for workouts, busy days, and better fluid balance without heavy sugar.',
    highlights: ['Zero crash', 'Travel friendly', 'Workout support'],
    accent: 'from-orange-500 to-pink-500',
    badge: 'Trending',
  },
  {
    name: 'Omega-3 Softgels',
    category: 'Essentials',
    price: '$24.99',
    rating: '4.9',
    description: 'A simple nutrition staple to round out healthy fat intake and complement a balanced daily routine.',
    highlights: ['Heart-friendly fats', 'Easy daily use', '60 servings'],
    accent: 'from-violet-500 to-fuchsia-500',
    badge: 'Top Rated',
  },
  {
    name: 'High-Protein Snack Bars',
    category: 'Snacks',
    price: '$21.99',
    rating: '4.5',
    description: 'Convenient bars for on-the-go nutrition when you need a smarter snack between meals or after class/work.',
    highlights: ['15g protein', 'Portable', 'Great for busy days'],
    accent: 'from-amber-500 to-orange-500',
    badge: 'Quick Fuel',
  },
  {
    name: 'Creatine Monohydrate',
    category: 'Performance',
    price: '$19.99',
    rating: '4.8',
    description: 'A straightforward performance supplement often used to support training consistency and strength goals.',
    highlights: ['Unflavored', '90 servings', 'Gym staple'],
    accent: 'from-slate-600 to-slate-900',
    badge: 'Performance',
  },
];

const bundles = [
  {
    title: 'Lean Goal Stack',
    price: '$64.99',
    summary: 'Protein isolate + greens blend + snack bars for better satiety and simple macro support.',
  },
  {
    title: 'Workout Support Stack',
    price: '$49.99',
    summary: 'Creatine + hydration sticks to support training sessions and daily performance consistency.',
  },
  {
    title: 'Daily Essentials Stack',
    price: '$44.99',
    summary: 'Omega-3 + greens blend for a practical daily nutrition add-on routine.',
  },
];

const categories = ['Protein', 'Hydration', 'Daily Wellness', 'Snacks', 'Performance', 'Essentials'];

export default function StorePage() {
  return (
    <div className="space-y-8 p-6 text-slate-900 dark:text-white md:p-8">
      <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-r from-amber-50 via-white to-emerald-100 p-8 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:from-zinc-950 dark:via-slate-950 dark:to-emerald-950 dark:shadow-2xl dark:shadow-black/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 backdrop-blur dark:border-white/20 dark:bg-white/10 dark:text-white/80">
              🛍️ Nutrition Store
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Support your nutrition goals with smart products</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-white/80">
              Browse practical products that can help with protein intake, hydration, recovery, healthy fats, and everyday nutrition consistency.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90">
                Shop featured picks
              </Button>
              <Link href="/settings">
                <Button variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                  Match with your goals
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: 'Featured products', value: '18+' },
              { label: 'Best price today', value: '$18.99' },
              { label: 'Top rated picks', value: '4.9★' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-white/50">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <div key={category} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-white/10 dark:bg-zinc-950 dark:text-white/80">
            {category}
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuredProducts.map((product) => (
          <Card
            key={product.name}
            className="overflow-hidden border border-slate-200 bg-white p-0 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20"
          >
            <div className={`h-2 bg-gradient-to-r ${product.accent}`} />
            <div className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-white/10 dark:text-white/70">
                    {product.category}
                  </div>
                  <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{product.name}</h2>
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/75">
                  {product.badge}
                </div>
              </div>

              <p className="text-sm leading-6 text-slate-600 dark:text-white/70">{product.description}</p>

              <div className="flex flex-wrap gap-2">
                {product.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              <div className="flex items-end justify-between border-t border-slate-200 pt-5 dark:border-white/10">
                <div>
                  <p className="text-sm text-slate-500 dark:text-white/55">Price</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{product.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 dark:text-white/55">Rating</p>
                  <p className="text-lg font-semibold text-amber-500">{product.rating} ★</p>
                </div>
              </div>

              <Button className="h-auto w-full rounded-xl py-3">View product</Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr,0.9fr]">
        <Card className="border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Goal-based bundles</h2>
              <p className="mt-2 text-slate-600 dark:text-white/70">
                Curated combinations built around common nutrition habits like protein support, hydration, and daily essentials.
              </p>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
              Save up to 15%
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {bundles.map((bundle) => (
              <div key={bundle.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{bundle.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-white/70">{bundle.summary}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{bundle.price}</span>
                  <Button size="sm">Choose</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Why these products?</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600 dark:text-white/70">
            <p>
              <strong className="text-slate-900 dark:text-white">Protein support:</strong> helps users reach intake targets more consistently when whole-food meals fall short.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Hydration tools:</strong> useful around workouts, long days, and times when plain water is not enough.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Daily essentials:</strong> simple add-ons can make routines easier to maintain without overcomplicating nutrition.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-medium text-slate-700 dark:text-white/80">Store note</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-white/70">
              Product listings are curated for nutrition support and planning. They are not a substitute for medical advice or a balanced diet.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}