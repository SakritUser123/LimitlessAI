'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Meal {
  id: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: string;
  created_at: string;
}

export default function HistoryPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch('/api/meals/history');
        if (!response.ok) throw new Error('Failed to fetch meals');
        const data = await response.json();
        setMeals(data.meals || []);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const filteredMeals = filter === 'all' 
    ? meals 
    : meals.filter(meal => meal.meal_type === filter);

  const groupedByDate: { [key: string]: Meal[] } = {};
  filteredMeals.forEach(meal => {
    const date = new Date(meal.created_at).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(meal);
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-64 rounded-lg bg-gradient-to-br from-blue-950 via-purple-950 to-pink-950 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 text-slate-900 dark:text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-gradient-to-r from-slate-100 via-white to-blue-100 p-8 text-slate-900 shadow-xl shadow-slate-200/60 dark:from-slate-900 dark:via-purple-900 dark:to-blue-900 dark:text-white dark:shadow-2xl dark:shadow-slate-900/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 backdrop-blur dark:border-white/20 dark:bg-white/10 dark:text-white/80">
                🗂️ Meal logs
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Meal History</h1>
              <p className="mt-2 max-w-2xl text-slate-600 dark:text-white/75">Review your meals, spot patterns, and track progress over time.</p>
            </div>
            <Link href="/meal-scanner">
              <Button className="rounded-xl bg-white text-slate-900 hover:bg-white/90">
                + Log Meal
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
            <p className="text-sm text-slate-500 dark:text-white/60">Meals found</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{meals.length}</p>
          </Card>
          <Card className="border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
            <p className="text-sm text-slate-500 dark:text-white/60">Filtered view</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 capitalize dark:text-white">{filter}</p>
          </Card>
          <Card className="border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
            <p className="text-sm text-slate-500 dark:text-white/60">Most recent entry</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{meals[0] ? new Date(meals[0].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '--'}</p>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto mb-8 mt-8 flex max-w-6xl flex-wrap gap-2">
        {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(type => (
          <Button
            key={type}
            onClick={() => setFilter(type as any)}
            variant={filter === type ? "default" : "outline"}
            className={filter === type ? 'rounded-full bg-white text-slate-900 hover:bg-white/90' : 'rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10'}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      {/* Meals List */}
      {filteredMeals.length === 0 ? (
        <Card className="border border-slate-200 bg-white p-12 text-center shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-2xl text-white shadow-lg">
            🍽️
          </div>
          <p className="mb-4 text-slate-600 dark:text-white/65">No meals found</p>
          <Link href="/meal-scanner">
            <Button className="rounded-xl bg-white text-slate-900 hover:bg-white/90">
              Log Your First Meal
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="mx-auto max-w-6xl space-y-8">
          {Object.entries(groupedByDate).map(([date, dateMeals]) => (
            <div key={date}>
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{date}</h2>
              <div className="space-y-3">
                {dateMeals.map(meal => (
                  <Card key={meal.id} className="border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold capitalize text-slate-900 dark:text-white">{meal.meal_type}</p>
                        <p className="text-sm text-slate-500 dark:text-white/60">{meal.description}</p>
                      </div>
                      <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text">{Math.round(meal.calories)} kcal</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                      <div className="rounded-2xl bg-rose-50 p-3 dark:bg-white/5">
                        <p className="text-slate-500 dark:text-white/60">Protein</p>
                        <p className="font-semibold text-rose-300">{Math.round(meal.protein)}g</p>
                      </div>
                      <div className="rounded-2xl bg-amber-50 p-3 dark:bg-white/5">
                        <p className="text-slate-500 dark:text-white/60">Carbs</p>
                        <p className="font-semibold text-amber-300">{Math.round(meal.carbs)}g</p>
                      </div>
                      <div className="rounded-2xl bg-emerald-50 p-3 dark:bg-white/5">
                        <p className="text-slate-500 dark:text-white/60">Fat</p>
                        <p className="font-semibold text-emerald-300">{Math.round(meal.fat)}g</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
