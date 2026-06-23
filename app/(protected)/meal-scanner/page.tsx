'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface FoodItem {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  confidence: number;
}

interface MealData {
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  notes?: string;
}

const calculateTotals = (items: FoodItem[]) => {
  return items.reduce(
    (totals, item) => ({
      totalCalories: totals.totalCalories + (item.calories || 0),
      totalProtein: totals.totalProtein + (item.protein || 0),
      totalCarbs: totals.totalCarbs + (item.carbs || 0),
      totalFat: totals.totalFat + (item.fat || 0),
      totalFiber: totals.totalFiber + (item.fiber || 0),
    }),
    {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
    }
  );
};

const getMealNotes = (items: FoodItem[]) => {
  if (!items.length) return '';

  const summary = items
    .map((item) => `${item.name} (${item.quantity} ${item.unit})`)
    .join(', ');

  return `Analyzed meal containing: ${summary}. Based on image recognition and nutritional database.`;
};

export default function MealScannerPage() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [savingMeal, setSavingMeal] = useState(false);
  const [mealData, setMealData] = useState<MealData | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [detectedFoods, setDetectedFoods] = useState<string[]>([]);
  const [editingFoods, setEditingFoods] = useState(false);

  const [mealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
      setMealData(null);
    }
  };

  const analyzeMeal = async () => {
    if (!image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');
    setEditingFoods(true);

    try {
      const formData = new FormData();
      formData.append('file', image);

      const response = await fetch('/api/meal/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to analyze meal');
      }

      setDetectedFoods(data.items.map((item: any) => item.name));
      setMealData({
        ...data,
        notes: getMealNotes(data.items || []),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setEditingFoods(false);
    } finally {
      setLoading(false);
    }
  };

  const confirmMealData = () => {
    if (mealData) {
      const totals = calculateTotals(mealData.items);
      setMealData({
        ...mealData,
        notes: getMealNotes(mealData.items),
        ...totals,
      });
    }
    setEditingFoods(false);
  };

  const updateDetectedFood = (index: number, value: string) => {
    setDetectedFoods((currentFoods) => {
      const nextFoods = [...currentFoods];
      nextFoods[index] = value;

      setMealData((currentMealData) => {
        if (!currentMealData) return currentMealData;

        const nextItems = [...currentMealData.items];
        nextItems[index] = {
          ...nextItems[index],
          name: value,
        };

        return {
          ...currentMealData,
          items: nextItems,
          notes: getMealNotes(nextItems),
          ...calculateTotals(nextItems),
        };
      });

      return nextFoods;
    });

    const quantity = mealData?.items[index]?.quantity ?? 1;
    void recalculateItemNutrition(index, value, quantity);
  };

  const removeDetectedFood = (index: number) => {
    setDetectedFoods((currentFoods) => currentFoods.filter((_, i) => i !== index));

    setMealData((currentMealData) => {
      if (!currentMealData) return currentMealData;

      const nextItems = currentMealData.items.filter((_, i) => i !== index);
      return {
        ...currentMealData,
        items: nextItems,
        notes: getMealNotes(nextItems),
        ...calculateTotals(nextItems),
      };
    });
  };

  const updateDetectedQuantity = (index: number, value: string) => {
    const quantity = Number(value);

    setMealData((currentMealData) => {
      if (!currentMealData) return currentMealData;

      const nextItems = [...currentMealData.items];
      const currentItem = nextItems[index];
      const oldQuantity = currentItem?.quantity || 1;
      const safeQuantity = Number.isNaN(quantity) || quantity < 0 ? 0 : quantity;
      const ratio = oldQuantity > 0 ? safeQuantity / oldQuantity : 0;

      nextItems[index] = {
        ...currentItem,
        quantity: safeQuantity,
        calories: Math.round((currentItem?.calories || 0) * ratio),
        protein: Math.round((currentItem?.protein || 0) * ratio * 10) / 10,
        carbs: Math.round((currentItem?.carbs || 0) * ratio * 10) / 10,
        fat: Math.round((currentItem?.fat || 0) * ratio * 10) / 10,
        fiber: Math.round((currentItem?.fiber || 0) * ratio * 10) / 10,
      };

      return {
        ...currentMealData,
        items: nextItems,
        notes: getMealNotes(nextItems),
        ...calculateTotals(nextItems),
      };
    });

    setTimeout(() => {
      setMealData((latestMealData) => {
        const latestItem = latestMealData?.items[index];
        if (!latestItem) return latestMealData;
        void recalculateItemNutrition(index, latestItem.name, latestItem.quantity ?? 1);
        return latestMealData;
      });
    }, 0);
  };

  const recalculateItemNutrition = async (index: number, nameInput: string, quantityInput?: number) => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;

    const quantity =
      typeof quantityInput === 'number' && Number.isFinite(quantityInput)
        ? quantityInput
        : mealData?.items[index]?.quantity ?? 1;

    try {
      const response = await fetch('/api/meal/estimate-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          quantity,
        }),
      });

      if (!response.ok) return;

      const data = await response.json();
      const estimatedItem = data?.item;
      if (!estimatedItem) return;

      setMealData((currentMealData) => {
        if (!currentMealData) return currentMealData;

        const nextItems = [...currentMealData.items];
        if (!nextItems[index]) return currentMealData;

        nextItems[index] = {
          ...nextItems[index],
          calories: estimatedItem.calories,
          protein: estimatedItem.protein,
          carbs: estimatedItem.carbs,
          fat: estimatedItem.fat,
          fiber: estimatedItem.fiber,
          unit: estimatedItem.unit || nextItems[index].unit,
          confidence: estimatedItem.confidence ?? nextItems[index].confidence,
        };

        return {
          ...currentMealData,
          items: nextItems,
          notes: getMealNotes(nextItems),
          ...calculateTotals(nextItems),
        };
      });
    } catch (lookupError) {
      console.error('Error estimating food nutrition:', lookupError);
    }
  };

  const saveMeal = async () => {
    if (!mealData) return;

    setSavingMeal(true);
    setError('');
    setSuccess('');

    try {
      if (!mealData.items.length) {
        throw new Error('Please keep at least one food item before saving');
      }

      const totals = calculateTotals(mealData.items);

      const response = await fetch('/api/meals/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: mealData.items,
          totalCalories: totals.totalCalories,
          totalProtein: totals.totalProtein,
          totalCarbs: totals.totalCarbs,
          totalFat: totals.totalFat,
          totalFiber: totals.totalFiber,
          mealType: mealType,
          notes: getMealNotes(mealData.items),
          imageUrl: preview,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.details || result.error || 'Failed to save meal';
        throw new Error(errorMsg);
      }

      setSuccess('Meal saved successfully!');
      
      // Reset form after successful save
      setTimeout(() => {
        setImage(null);
        setPreview('');
        setMealData(null);
        setDetectedFoods([]);
        setSuccess('');
        // Redirect to dashboard with refresh flag
        router.push('/dashboard?refreshed=true');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSavingMeal(false);
    }
  };

  const liveMealNotes = mealData ? getMealNotes(mealData.items) : '';

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 text-slate-900 dark:text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-100 via-white to-blue-100 p-8 text-slate-900 shadow-xl shadow-slate-200/60 dark:from-slate-900 dark:via-blue-900 dark:to-violet-900 dark:text-white dark:shadow-2xl dark:shadow-slate-900/20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 backdrop-blur dark:border-white/20 dark:bg-white/10 dark:text-white/80">
                ✨ AI-powered meal analysis
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Meal Scanner</h1>
              <p className="mt-3 text-lg text-slate-600 dark:text-white/75">
                Upload a meal photo, review the detected foods, and fine-tune the nutrition before saving.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:min-w-[280px]">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 backdrop-blur dark:border-white/15 dark:bg-white/10">
                <p className="text-sm text-slate-500 dark:text-white/70">Workflow</p>
                <p className="mt-1 text-2xl font-bold">Scan → Verify</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 backdrop-blur dark:border-white/15 dark:bg-white/10">
                <p className="text-sm text-slate-500 dark:text-white/70">Accuracy</p>
                <p className="mt-1 text-2xl font-bold">Editable</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-100 shadow-sm">
            {error}
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-100 shadow-sm">
            {success}
          </div>
        )}

        {/* Upload Section */}
        {!mealData && (
          <Card className="overflow-hidden border border-slate-200 bg-white p-0 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-zinc-950/90 dark:shadow-black/30">
            <div className="grid md:grid-cols-[1.2fr_0.8fr]">
              <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-violet-50 p-8 dark:from-blue-950/40 dark:via-cyan-950/30 dark:to-violet-950/40">
                <div className="w-full max-w-xl rounded-[1.75rem] border border-dashed border-blue-300 bg-white p-8 text-center shadow-lg dark:border-blue-500/30 dark:bg-black/60">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer">
                {!preview ? (
                  <div className="py-10">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-2xl text-white shadow-lg shadow-blue-500/30">
                      📷
                    </div>
                    <p className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Click to upload or drag and drop</p>
                    <p className="text-sm text-slate-500 dark:text-white/60">PNG, JPG or JPEG • best with clear lighting</p>
                  </div>
                ) : (
                  <div>
                    <img
                      src={preview}
                      alt="Preview"
                      className="mx-auto mb-4 max-h-64 rounded-2xl shadow-lg"
                    />
                    <p className="font-semibold text-emerald-600">Image selected ✓</p>
                  </div>
                )}
              </label>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4 p-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-lg dark:border-white/10 dark:bg-black dark:text-white">
                  <p className="text-sm text-slate-600 dark:text-white/70">Tips for better accuracy</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-white/85">
                    <li>• Keep the meal centered</li>
                    <li>• Use bright, natural light</li>
                    <li>• Avoid blurry or far-away shots</li>
                    <li>• Verify/edit detected foods before saving</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/65">
                  The scanner works best on complete meals with visible ingredients.
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Analyze Button */}
        {preview && !mealData && (
          <Button
            onClick={analyzeMeal}
            disabled={loading}
            className="h-auto w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 py-4 text-lg shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-violet-700"
          >
            {loading ? 'Analyzing...' : 'Analyze Meal'}
          </Button>
        )}

        {/* Verify Foods */}
        {mealData && editingFoods && (
          <div className="mt-8 space-y-6">
            <div className="rounded-[1.75rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6 shadow-lg">
              <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Verify Detected Foods</h2>
              <p className="mb-5 text-slate-600 dark:text-white/65">Edit or remove items to make the nutrition more accurate.</p>
              <div className="space-y-2 mb-4">
                {detectedFoods.map((food, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-white/5">
                    <input
                      type="text"
                      value={food}
                      onChange={(e) => updateDetectedFood(idx, e.target.value)}
                      className="flex-1 rounded-xl border-0 bg-transparent px-3 py-2 text-slate-900 outline-none ring-0 dark:text-white"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={mealData.items[idx]?.quantity ?? 0}
                      onChange={(e) => updateDetectedQuantity(idx, e.target.value)}
                      className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none dark:border-white/10 dark:bg-black/30 dark:text-white"
                    />
                    <span className="min-w-16 text-sm text-slate-500 dark:text-white/60">{mealData.items[idx]?.unit}</span>
                    <Button
                      onClick={() => removeDetectedFood(idx)}
                      variant="destructive"
                      className="rounded-xl px-3 py-2"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => confirmMealData()}
                  className="flex-1 h-auto rounded-xl bg-white py-3 text-slate-900 shadow-lg hover:bg-white/90"
                >
                  ✓ Confirm & Get Nutrition
                </Button>
                <Button
                  onClick={() => {
                    setEditingFoods(false);
                    setImage(null);
                    setPreview('');
                    setMealData(null);
                    setDetectedFoods([]);
                  }}
                  variant="secondary"
                  className="flex-1 h-auto rounded-xl py-3"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {mealData && !editingFoods && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Card className="border-0 bg-gradient-to-br from-blue-500 to-cyan-500 p-4 text-white shadow-lg shadow-blue-500/20">
                <p className="mb-1 text-sm font-semibold text-white/80">Calories</p>
                <p className="text-2xl font-bold">{mealData.totalCalories}</p>
              </Card>
              <Card className="border-0 bg-gradient-to-br from-rose-500 to-pink-500 p-4 text-white shadow-lg shadow-rose-500/20">
                <p className="mb-1 text-sm font-semibold text-white/80">Protein</p>
                <p className="text-2xl font-bold">{mealData.totalProtein}g</p>
              </Card>
              <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-500 p-4 text-white shadow-lg shadow-amber-500/20">
                <p className="mb-1 text-sm font-semibold text-white/80">Carbs</p>
                <p className="text-2xl font-bold">{mealData.totalCarbs}g</p>
              </Card>
              <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-500 p-4 text-white shadow-lg shadow-emerald-500/20">
                <p className="mb-1 text-sm font-semibold text-white/80">Fat</p>
                <p className="text-2xl font-bold">{mealData.totalFat}g</p>
              </Card>
            </div>

            {liveMealNotes && (
              <Card className="border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
                <p className="text-slate-700 dark:text-white/75">{liveMealNotes}</p>
              </Card>
            )}

            <Card className="border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Food Items</h2>
              <div className="space-y-3">
                {mealData.items.map((item, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-slate-500 dark:text-white/60">{item.quantity} {item.unit}</p>
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white">{item.calories} kcal</p>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                      <div className="rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-black/40"><span className="text-slate-500 dark:text-white/60">Protein: </span><span className="font-semibold text-slate-900 dark:text-white">{item.protein}g</span></div>
                      <div className="rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-black/40"><span className="text-slate-500 dark:text-white/60">Carbs: </span><span className="font-semibold text-slate-900 dark:text-white">{item.carbs}g</span></div>
                      <div className="rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-black/40"><span className="text-slate-500 dark:text-white/60">Fat: </span><span className="font-semibold text-slate-900 dark:text-white">{item.fat}g</span></div>
                      <div className="rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-black/40"><span className="text-slate-500 dark:text-white/60">Fiber: </span><span className="font-semibold text-slate-900 dark:text-white">{item.fiber}g</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex gap-2">
              <Button
                onClick={saveMeal}
                disabled={savingMeal}
                className="flex-1 h-auto rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-base shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700"
                variant="default"
              >
                {savingMeal ? 'Saving...' : '💾 Save Meal'}
              </Button>
              <Button
                onClick={() => {
                  setImage(null);
                  setPreview('');
                  setMealData(null);
                }}
                variant="secondary"
                className="flex-1 h-auto rounded-xl py-3 text-base"
              >
                Scan Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
