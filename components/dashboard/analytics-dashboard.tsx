'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics?days=7');
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="h-96 bg-muted rounded-lg animate-pulse" />;
  }

  if (!analytics) {
    return <Card className="p-8 text-center text-muted-foreground">Unable to load analytics</Card>;
  }

  return (
    <div className="grid gap-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">7-Day Summary</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Meals</p>
            <p className="text-2xl font-bold">{analytics.totalMeals}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Calories</p>
            <p className="text-2xl font-bold">{Math.round(analytics.avgCaloriesPerDay)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Protein</p>
            <p className="text-2xl font-bold">{Math.round(analytics.avgProteinPerDay)}g</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Period</p>
            <p className="text-2xl font-bold">{analytics.period.days}d</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Breakdown</h2>
        <div className="space-y-3">
          {analytics.data.map((day: any) => (
            <div key={day.date} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{day.date}</span>
                <span className="text-sm text-muted-foreground">{day.meals?.length || 0} meals</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Calories</p>
                  <p className="font-semibold">{Math.round(day.totalCalories)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Protein</p>
                  <p className="font-semibold">{Math.round(day.totalProtein)}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Carbs</p>
                  <p className="font-semibold">{Math.round(day.totalCarbs)}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fat</p>
                  <p className="font-semibold">{Math.round(day.totalFat)}g</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
