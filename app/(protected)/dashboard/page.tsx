'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DailySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
}

interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DailySummary>({
    date: new Date().toLocaleDateString(),
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    mealCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dailyGoal, setDailyGoal] = useState<DailyGoals>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
  });

  const fetchSummary = async () => {
    try {
      const [summaryResponse, goalsResponse] = await Promise.all([
        fetch('/api/nutrition/today', { cache: 'no-store' }),
        fetch('/api/goals/current', { cache: 'no-store' }),
      ]);

      if (summaryResponse.ok) {
        const data = await summaryResponse.json();
        setSummary(data);
      }

      if (goalsResponse.ok) {
        const goals = await goalsResponse.json();
        setDailyGoal({
          calories: goals.target_calories ?? 2000,
          protein: goals.target_protein ?? 150,
          carbs: goals.target_carbs ?? 250,
          fat: goals.target_fat ?? 65,
        });
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();

    const handleGoalsUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{
        target_calories?: number;
        target_protein?: number;
        target_carbs?: number;
        target_fat?: number;
      }>;

      if (customEvent.detail) {
        setDailyGoal({
          calories: customEvent.detail.target_calories ?? 2000,
          protein: customEvent.detail.target_protein ?? 150,
          carbs: customEvent.detail.target_carbs ?? 250,
          fat: customEvent.detail.target_fat ?? 65,
        });
      }

      fetchSummary();
    };

    window.addEventListener('goals-updated', handleGoalsUpdated as EventListener);

    // Refetch every 3 seconds to always show fresh data
    const interval = setInterval(() => {
      fetchSummary();
    }, 3000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('goals-updated', handleGoalsUpdated as EventListener);
    };
  }, []);

  const progressPercent = dailyGoal.calories > 0 ? Math.min((summary.totalCalories / dailyGoal.calories) * 100, 100) : 0;
  const remaining = Math.max(dailyGoal.calories - summary.totalCalories, 0);

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-64 rounded-3xl bg-gradient-to-br from-blue-950 via-purple-950 to-pink-950 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-100 via-white to-blue-100 p-8 text-slate-900 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:from-zinc-950 dark:via-slate-950 dark:to-neutral-950 dark:text-white dark:shadow-2xl dark:shadow-black/40">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 backdrop-blur dark:border-white/20 dark:bg-white/10 dark:text-white/80">
              ✨ AI nutrition dashboard
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-white/75">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} •
              track meals, hit goals, and see nutrition updates live.
            </p>
          </div>
        <Link href="/meal-scanner">
          <Button className="bg-white text-slate-900 hover:bg-white/90">
            + Log Meal
          </Button>
        </Link>
        </div>
      </div>

      {/* Daily Calorie Progress */}
      <Card className="overflow-hidden border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-zinc-950/80 dark:shadow-black/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Progress Circle */}
          <div className="flex items-center justify-center">
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 p-4">
              <div className="absolute inset-3 rounded-full border border-slate-200 bg-white shadow-inner dark:border-white/10 dark:bg-black"></div>
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray={`${progressPercent * 2.83} 283`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-slate-900 dark:text-white">{Math.round(summary.totalCalories)}</div>
                <div className="text-sm text-slate-500 dark:text-white/60">/ {dailyGoal.calories} kcal</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 p-5 text-white shadow-lg shadow-blue-500/20">
              <p className="text-white/70 text-sm mb-1">Remaining</p>
              <p className="text-3xl font-bold text-white">{Math.round(remaining)} kcal</p>
              <p className="mt-1 text-sm text-white/80">Keep going — you’re on track.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Card className="border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                <p className="text-slate-500 text-xs mb-1 dark:text-white/60">Protein</p>
                <p className="text-lg font-bold text-rose-400">{Math.round(summary.totalProtein)}g</p>
              </Card>
              <Card className="border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                <p className="text-slate-500 text-xs mb-1 dark:text-white/60">Carbs</p>
                <p className="text-lg font-bold text-amber-400">{Math.round(summary.totalCarbs)}g</p>
              </Card>
              <Card className="border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                <p className="text-slate-500 text-xs mb-1 dark:text-white/60">Fat</p>
                <p className="text-lg font-bold text-emerald-400">{Math.round(summary.totalFat)}g</p>
              </Card>
            </div>

            <Link href="/settings">
              <Button variant="secondary" className="w-full rounded-xl bg-white text-slate-900 hover:bg-white/90">
                Set Daily Goals
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-0 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg shadow-purple-500/20">
          <p className="text-sm text-white/80">Meals logged</p>
          <p className="mt-2 text-4xl font-bold">{summary.mealCount}</p>
          <p className="mt-2 text-sm text-white/80">Today's total meal entries</p>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-sky-500 to-cyan-500 p-6 text-white shadow-lg shadow-cyan-500/20">
          <p className="text-sm text-white/80">Calories left</p>
          <p className="mt-2 text-4xl font-bold">{Math.round(remaining)}</p>
          <p className="mt-2 text-sm text-white/80">Energy remaining in your goal</p>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-rose-500 to-orange-500 p-6 text-white shadow-lg shadow-rose-500/20">
          <p className="text-sm text-white/80">Protein goal</p>
          <p className="mt-2 text-4xl font-bold">{Math.round((summary.totalProtein / dailyGoal.protein) * 100)}%</p>
          <p className="mt-2 text-sm text-white/80">Of your daily target</p>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-500 p-6 text-white shadow-lg shadow-emerald-500/20">
          <p className="text-sm text-white/80">Macro balance</p>
          <p className="mt-2 text-4xl font-bold">Live</p>
          <p className="mt-2 text-sm text-white/80">Auto-refreshing every 3 seconds</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
        <Card className="group border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
          <h3 className="text-lg font-semibold mb-2">📸 Scan Meal</h3>
          <p className="text-slate-600 text-sm mb-4 dark:text-white/65">Analyze your food with AI</p>
          <Link href="/meal-scanner">
            <Button variant="outline" className="w-full border-blue-500/30 text-blue-300 group-hover:bg-blue-500/10">
              Open Scanner
            </Button>
          </Link>
        </Card>

        <Card className="group border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
          <h3 className="text-lg font-semibold mb-2">📊 History</h3>
          <p className="text-slate-600 text-sm mb-4 dark:text-white/65">View past meals</p>
          <Link href="/history">
            <Button variant="outline" className="w-full border-purple-500/30 text-purple-300 group-hover:bg-purple-500/10">
              View History
            </Button>
          </Link>
        </Card>

        <Card className="group border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
          <h3 className="text-lg font-semibold mb-2">📰 Nutrition Articles</h3>
          <p className="text-slate-600 text-sm mb-4 dark:text-white/65">Read smart tips and healthy habits</p>
          <Link href="/articles">
            <Button variant="outline" className="w-full border-emerald-500/30 text-emerald-300 group-hover:bg-emerald-500/10">
              Explore Articles
            </Button>
          </Link>
        </Card>

        <Card className="group border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
          <h3 className="text-lg font-semibold mb-2">🛍️ Store</h3>
          <p className="text-slate-600 text-sm mb-4 dark:text-white/65">Shop nutrition-support products and bundles</p>
          <Link href="/store">
            <Button variant="outline" className="w-full border-pink-500/30 text-pink-300 group-hover:bg-pink-500/10">
              Open Store
            </Button>
          </Link>
        </Card>

        <Card className="group border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
          <h3 className="text-lg font-semibold mb-2">⚙️ Settings</h3>
          <p className="text-slate-600 text-sm mb-4 dark:text-white/65">Configure your goals</p>
          <Link href="/settings">
            <Button variant="outline" className="w-full border-orange-500/30 text-orange-300 group-hover:bg-orange-500/10">
              Go to Settings
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
