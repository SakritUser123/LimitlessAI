'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { formatCalories, formatMacro } from '@/lib/utils';

interface DailySummaryData {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  mealCount: number;
}

export function DailySummary() {
  const [summary, setSummary] = useState<DailySummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/nutrition/today');
        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="h-32 bg-muted rounded-lg animate-pulse" />;
  }

  if (!summary) {
    return <div className="text-center py-8 text-muted-foreground">Unable to load summary</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Today's Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Calories</p>
          <p className="text-2xl font-bold">{formatCalories(summary.totalCalories)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Protein</p>
          <p className="text-2xl font-bold">{formatMacro(summary.totalProtein)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Carbs</p>
          <p className="text-2xl font-bold">{formatMacro(summary.totalCarbs)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Fat</p>
          <p className="text-2xl font-bold">{formatMacro(summary.totalFat)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Meals</p>
          <p className="text-2xl font-bold">{summary.mealCount}</p>
        </div>
      </div>
    </Card>
  );
}
