'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Goals {
  target_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fat: number;
}

type ThemeMode = 'light' | 'dark';

export default function SettingsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goals>({
    target_calories: 2000,
    target_protein: 150,
    target_carbs: 250,
    target_fat: 65,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch('/api/goals/current', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setGoals(data);
        }
      } catch (err) {
        console.error('Error fetching goals:', err);
      }
    };

    fetchGoals();

    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      const savedTheme = localStorage.getItem('theme-preference');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      } else {
        setTheme(root.classList.contains('dark') ? 'dark' : 'light');
      }
    }
  }, []);

  const applyTheme = (nextTheme: ThemeMode) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(nextTheme);
    localStorage.setItem('theme-preference', nextTheme);
    setTheme(nextTheme);
  };

  const handleChange = (field: keyof Goals, value: string) => {
    setGoals(prev => ({
      ...prev,
      [field]: parseInt(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSaved(false);

    try {
      const response = await fetch('/api/goals/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goals),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || data?.details || 'Failed to save goals');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('nutrition-goals', JSON.stringify(goals));
        window.dispatchEvent(new CustomEvent('goals-updated', { detail: goals }));
      }

      router.refresh();
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-slate-900 dark:text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-white/60">Manage your daily nutrition goals and appearance</p>
      </div>

      {saved && (
        <div className="mb-4 rounded border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-700 dark:text-emerald-100">
          ✓ Goals saved successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-700 dark:text-red-100">
          {error}
        </div>
      )}

      <div className="max-w-2xl">
        <Card className="mb-6 border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:shadow-lg dark:shadow-black/20">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-white/60">Choose your preferred app theme.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => applyTheme('light')}
              className={theme === 'light' ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90' : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'}
            >
              Light Theme
            </Button>
            <Button
              type="button"
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => applyTheme('dark')}
              className={theme === 'dark' ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90' : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'}
            >
              Dark Theme
            </Button>
          </div>
        </Card>

        <Card className="border border-slate-200 bg-white p-8 text-slate-900 shadow-sm dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:shadow-lg dark:shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-white/80">
                Daily Calorie Goal (kcal)
              </label>
              <input
                type="number"
                value={goals.target_calories}
                onChange={(e) => handleChange('target_calories', e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-white/80">
                  Protein Goal (g)
                </label>
                <input
                  type="number"
                  value={goals.target_protein}
                  onChange={(e) => handleChange('target_protein', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-white/80">
                  Carbs Goal (g)
                </label>
                <input
                  type="number"
                  value={goals.target_carbs}
                  onChange={(e) => handleChange('target_carbs', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-white/80">
                  Fat Goal (g)
                </label>
                <input
                  type="number"
                  value={goals.target_fat}
                  onChange={(e) => handleChange('target_fat', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="h-auto w-full py-3">
              {loading ? 'Saving...' : 'Save Goals'}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-8 border-t border-slate-200 pt-8 dark:border-white/10">
            <h2 className="mb-4 text-lg font-semibold">Daily Goals Guide</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-white/65">
              <p>
                <strong>Calories:</strong> Total energy intake. Adjust based on activity level and fitness goals.
              </p>
              <p>
                <strong>Protein:</strong> Essential for muscle growth. Typically 0.8-1g per pound of body weight.
              </p>
              <p>
                <strong>Carbs:</strong> Primary energy source. About 45-65% of total calories.
              </p>
              <p>
                <strong>Fat:</strong> Important for hormones and absorption. About 20-35% of total calories.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
