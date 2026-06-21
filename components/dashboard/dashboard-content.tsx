'use client';

import { Suspense } from 'react';
import { MealScanner } from '@/components/meal/meal-scanner';
import { DailySummary } from '@/components/dashboard/daily-summary';
import { MacroBreakdown } from '@/components/dashboard/macro-breakdown';
import { MealList } from '@/components/meal/meal-list';

export function DashboardContent() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your meals and monitor your nutrition goals
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6">
        <MealScanner />
      </div>

      {/* Daily Summary */}
      <Suspense fallback={<div className="h-40 bg-muted rounded-lg animate-pulse" />}>
        <DailySummary />
      </Suspense>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Macro Breakdown */}
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-64 bg-muted rounded-lg animate-pulse" />}>
            <MacroBreakdown />
          </Suspense>
        </div>

        {/* Today's Meals */}
        <div>
          <Suspense fallback={<div className="h-64 bg-muted rounded-lg animate-pulse" />}>
            <MealList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
