'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCalories, formatMacro, formatDate, formatTime } from '@/lib/utils';

interface Meal {
  id: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: string;
  created_at: string;
  image_url?: string;
}

export function MealHistory() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch(`/api/meals?offset=${page * 20}&limit=20`);
        const data = await res.json();
        setMeals(data);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [page]);

  if (loading) {
    return <div className="h-96 rounded-3xl bg-gradient-to-br from-blue-950 via-purple-950 to-pink-950 animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      {meals.length === 0 ? (
        <Card className="border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:text-white/65 dark:shadow-black/20">
          <p>No meals logged yet. Start by scanning your first meal!</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {meals.map((meal) => (
              <Card key={meal.id} className="border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
                <div className="flex gap-4">
                  {meal.image_url && (
                    <img
                      src={meal.image_url}
                      alt="Meal"
                      className="h-24 w-24 rounded-2xl object-cover shadow-md"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{meal.description}</h3>
                        <p className="text-sm text-white/60">
                          {formatDate(meal.created_at)} at {formatTime(meal.created_at)}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-sm capitalize text-white/75">
                        {meal.meal_type}
                      </span>
                    </div>
                    <div className="grid gap-3 text-sm md:grid-cols-4">
                      <div className="rounded-2xl bg-white/5 p-3">
                        <p className="text-white/60">Calories</p>
                        <p className="font-semibold text-blue-300">{formatCalories(meal.calories)}</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-3">
                        <p className="text-white/60">Protein</p>
                        <p className="font-semibold text-rose-300">{formatMacro(meal.protein)}</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-3">
                        <p className="text-white/60">Carbs</p>
                        <p className="font-semibold text-amber-300">{formatMacro(meal.carbs)}</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-3">
                        <p className="text-white/60">Fat</p>
                        <p className="font-semibold text-emerald-300">{formatMacro(meal.fat)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="rounded-full text-white/80 hover:bg-white/10 hover:text-white">Edit</Button>
                    <Button variant="ghost" size="sm" className="rounded-full text-white/80 hover:bg-white/10 hover:text-white">Delete</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={meals.length < 20}
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
