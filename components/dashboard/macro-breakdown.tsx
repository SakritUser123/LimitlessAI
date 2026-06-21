'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getMacroPercentage } from '@/lib/utils';

interface DailySummaryData {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export function MacroBreakdown() {
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
    return <Card className="p-6 h-64 animate-pulse" />;
  }

  if (!summary) {
    return <Card className="p-6"><p className="text-muted-foreground">Unable to load macros</p></Card>;
  }

  const proteinPercent = getMacroPercentage(summary.totalProtein * 4, summary.totalCalories);
  const carbsPercent = getMacroPercentage(summary.totalCarbs * 4, summary.totalCalories);
  const fatPercent = getMacroPercentage(summary.totalFat * 9, summary.totalCalories);

  const macros = [
    { label: 'Protein', value: proteinPercent, color: 'bg-blue-500', grams: summary.totalProtein },
    { label: 'Carbs', value: carbsPercent, color: 'bg-amber-500', grams: summary.totalCarbs },
    { label: 'Fat', value: fatPercent, color: 'bg-red-500', grams: summary.totalFat },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Macro Breakdown</h2>
      <div className="space-y-6">
        {macros.map((macro) => (
          <div key={macro.label}>
            <div className="flex justify-between mb-2">
              <span className="font-medium">{macro.label}</span>
              <span className="text-sm text-muted-foreground">{macro.value}% ({macro.grams}g)</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`${macro.color} h-2 rounded-full transition-all`}
                style={{ width: `${Math.min(macro.value, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
