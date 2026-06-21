'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const articles = [
  {
    title: 'How to build a balanced plate',
    summary: 'A simple formula for protein, carbs, fiber, and healthy fats at every meal.',
    category: 'Basics',
    readTime: '4 min',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Smart snacking without overdoing calories',
    summary: 'Learn how to choose snacks that keep you full and support your goals.',
    category: 'Habits',
    readTime: '3 min',
    accent: 'from-orange-500 to-pink-500',
  },
  {
    title: 'Why protein matters for weight control',
    summary: 'Protein helps with satiety, muscle repair, and staying energized during the day.',
    category: 'Nutrition',
    readTime: '5 min',
    accent: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Meal timing and energy levels',
    summary: 'Find a rhythm that keeps your day steady without unnecessary hunger spikes.',
    category: 'Lifestyle',
    readTime: '4 min',
    accent: 'from-violet-500 to-fuchsia-500',
  },
];

export default function ArticlesPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 text-slate-900 dark:text-white">
      <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-blue-100 p-8 text-slate-900 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:from-zinc-950 dark:via-slate-950 dark:to-blue-950 dark:text-white dark:shadow-2xl dark:shadow-black/40">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 backdrop-blur dark:border-white/20 dark:bg-white/10 dark:text-white/80">
            📰 Nutrition Articles
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Learn better food habits</h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-white/80">
            Quick, practical reads to help you eat smarter, stay consistent, and make the dashboard even more useful.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/meal-scanner">
              <Button className="bg-white text-slate-900 hover:bg-white/90">Scan a Meal</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <Card key={article.title} className="overflow-hidden border border-slate-200 bg-white p-0 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
            <div className={`h-2 bg-gradient-to-r ${article.accent}`} />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-white/60">
                <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-white/10">{article.category}</span>
                <span>{article.readTime}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{article.title}</h2>
                <p className="mt-2 text-slate-600 dark:text-white/65">{article.summary}</p>
              </div>
              <Button variant="outline" className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10">
                Read article
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
