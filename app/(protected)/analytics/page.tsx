'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatDate } from '@/lib/utils';

type AnalyticsResponse = {
  period: { start: string; end: string; days: number };
  dataSource?: string;
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  summary: {
    totalMeals: number;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
    daysWithMeals: number;
    averageMealsPerDay: number;
    avgCaloriesPerDay: number;
    avgCaloriesPerPeriodDay: number;
    avgProteinPerDay: number;
    avgCarbsPerDay: number;
    avgFatPerDay: number;
    avgFiberPerDay: number;
    mealStreak: number;
  };
  macroSplit: { protein: number; carbs: number; fat: number };
  goalProgress: { calories: number; protein: number; carbs: number; fat: number };
  highestDay: any;
  lowestDay: any;
  mealTypeCounts: Record<string, number>;
  hourlyDistribution: Record<string, number>;
  data: Array<{
    date: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
    mealCount: number;
    calorieProgress: number;
  }>;
};

const PIE_COLORS = ['#6366f1', '#06b6d4', '#f97316'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(14);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`/api/analytics?days=${days}`, {
          cache: 'no-store',
          credentials: 'include',
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load analytics');
        }

        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [days]);

  const trendData = useMemo(() => {
    return analytics?.data.map((day) => ({
      date: formatDate(day.date),
      calories: Math.round(day.totalCalories),
      protein: Math.round(day.totalProtein),
      carbs: Math.round(day.totalCarbs),
      fat: Math.round(day.totalFat),
      fiber: Math.round(day.totalFiber),
      meals: day.mealCount,
      progress: Math.round(day.calorieProgress),
    })) || [];
  }, [analytics]);

  const hourlyData = useMemo(() => {
    if (!analytics?.hourlyDistribution) return [];
    return Object.entries(analytics.hourlyDistribution)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [analytics]);

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="h-96 rounded-[2rem] bg-gradient-to-br from-blue-950 via-purple-950 to-pink-950 animate-pulse" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-6 md:p-8">
        <Card className="border border-slate-200 bg-white p-8 text-center text-slate-900 dark:border-white/10 dark:bg-zinc-950 dark:text-white">
          <h1 className="text-2xl font-bold mb-2">Analytics unavailable</h1>
          <p className="text-slate-600 mb-6 dark:text-white/70">{error || 'No analytics data found.'}</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const macroPie = [
    { name: 'Protein', value: analytics.macroSplit.protein },
    { name: 'Carbs', value: analytics.macroSplit.carbs },
    { name: 'Fat', value: analytics.macroSplit.fat },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 text-slate-900 dark:text-white">
      <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-blue-100 p-8 text-slate-900 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:from-zinc-950 dark:via-slate-950 dark:to-blue-950 dark:text-white dark:shadow-2xl dark:shadow-black/40">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 backdrop-blur dark:border-white/20 dark:bg-white/10 dark:text-white/80">
              📈 Analytics
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Nutrition analytics</h1>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-white/80">
              A more accurate view of your meals, goal progress, macro balance, meal timing, and consistency.
            </p>
          </div>
          <div className="flex gap-2">
            {[7, 14, 30].map((value) => (
              <Button
                key={value}
                onClick={() => setDays(value)}
                variant="outline"
                aria-pressed={days === value}
                className={
                  days === value
                    ? 'border-white bg-white text-slate-900 shadow-lg shadow-white/20 hover:bg-white/95'
                    : 'border-slate-300 bg-white text-slate-700 backdrop-blur-sm hover:border-slate-400 hover:bg-slate-50 dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:border-white/60 dark:hover:bg-white/20'
                }
              >
                {value}d
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20 dark:text-white">
          <p className="text-sm text-slate-500 dark:text-white/60">Total calories</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{analytics.summary.totalCalories}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-white/60">Across {analytics.summary.daysWithMeals} active days</p>
        </Card>
        <Card className="border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20 dark:text-white">
          <p className="text-sm text-slate-500 dark:text-white/60">Meal streak</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{analytics.summary.mealStreak} days</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-white/60">Consecutive days with meals logged</p>
        </Card>
        <Card className="border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20 dark:text-white">
          <p className="text-sm text-slate-500 dark:text-white/60">Avg meals / day</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{analytics.summary.averageMealsPerDay}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-white/60">Based on selected period</p>
        </Card>
        <Card className="border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20 dark:text-white">
          <p className="text-sm text-slate-500 dark:text-white/60">Fiber total</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{analytics.summary.totalFiber}g</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-white/60">High fiber helps satiety and digestion</p>
        </Card>
      </div>

      {analytics.dataSource && (
        <Card className="border border-amber-500/20 bg-amber-500/10 p-4 text-amber-100 shadow-sm">
          <p className="text-sm font-medium">
            Showing data from <span className="font-bold">{analytics.dataSource}</span>
            {analytics.dataSource !== `last ${days} days` ? ' because the selected range had no meals.' : ''}
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20 dark:text-white">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Daily calorie trend</h2>
              <p className="text-sm text-slate-500 dark:text-white/60">Calories and meal count by day</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="calories" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="meals" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20 dark:text-white">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 dark:text-white">Macro split</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={macroPie} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={5}>
                  {macroPie.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-white/80">
            <p>Protein: {analytics.macroSplit.protein}%</p>
            <p>Carbs: {analytics.macroSplit.carbs}%</p>
            <p>Fat: {analytics.macroSplit.fat}%</p>
          </div>
          {!macroPie.some((item) => item.value > 0) && (
            <p className="mt-3 text-sm text-slate-500 dark:text-white/60">
              No macro data in this range yet.
            </p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20 dark:text-white">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 dark:text-white">Goal progress</h2>
          <div className="space-y-4">
            {[
              { label: 'Calories', value: analytics.goalProgress.calories, color: 'bg-blue-500' },
              { label: 'Protein', value: analytics.goalProgress.protein, color: 'bg-rose-500' },
              { label: 'Carbs', value: analytics.goalProgress.carbs, color: 'bg-amber-500' },
              { label: 'Fat', value: analytics.goalProgress.fat, color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span>{Math.round(item.value)}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden dark:bg-white/10">
                  <div className={`h-full ${item.color}`} style={{ width: `${Math.min(item.value, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20 dark:text-white">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 dark:text-white">Meal timing</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {!hourlyData.some((item) => item.count > 0) && (
            <p className="mt-3 text-sm text-slate-500 dark:text-white/60">
              No meal timing data yet.
            </p>
          )}
        </Card>
      </div>

      <Card className="border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20 dark:text-white">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 dark:text-white">Daily breakdown</h2>
        <div className="grid gap-4">
          {trendData.map((day) => (
            <div key={day.date} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{day.date}</p>
                  <p className="text-sm text-slate-500 dark:text-white/60">{day.meals} meals</p>
                </div>
                <p className="text-sm font-medium text-blue-300">{day.progress}% of calorie goal</p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5 text-sm">
                <div><p className="text-slate-500 dark:text-white/60">Calories</p><p className="font-semibold text-slate-900 dark:text-white">{day.calories}</p></div>
                <div><p className="text-slate-500 dark:text-white/60">Protein</p><p className="font-semibold text-slate-900 dark:text-white">{day.protein}g</p></div>
                <div><p className="text-slate-500 dark:text-white/60">Carbs</p><p className="font-semibold text-slate-900 dark:text-white">{day.carbs}g</p></div>
                <div><p className="text-slate-500 dark:text-white/60">Fat</p><p className="font-semibold text-slate-900 dark:text-white">{day.fat}g</p></div>
                <div><p className="text-slate-500 dark:text-white/60">Fiber</p><p className="font-semibold text-slate-900 dark:text-white">{day.fiber}g</p></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-center">
        <Link href="/dashboard">
          <Button variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
