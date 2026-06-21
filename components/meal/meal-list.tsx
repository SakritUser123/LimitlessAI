'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { formatCalories, formatMacro, formatTime } from '@/lib/utils';

interface Meal {
  id: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string;
}

export function MealList() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch('/api/meals');
        const data = await res.json();
        // Filter to today only
        const today = new Date().toISOString().split('T')[0];
        setMeals(data.filter((m: Meal) => m.created_at.startsWith(today)));
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (loading) {
    return <Card className="p-6 h-64 animate-pulse" />;
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Today's Meals</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {meals.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No meals logged yet</p>
        ) : (
          meals.map((meal) => (
            <div key={meal.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <p className="font-medium text-sm">{meal.description}</p>
              <p className="text-xs text-muted-foreground">{formatTime(meal.created_at)}</p>
              <div className="flex justify-between mt-2 text-xs">
                <span>{formatCalories(meal.calories)}</span>
                <span className="text-muted-foreground">
                  P: {formatMacro(meal.protein)} C: {formatMacro(meal.carbs)} F: {formatMacro(meal.fat)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
