import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  items: Array<{name: string; calories: number; protein: number; carbs: number; fat: number}>;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  meal_date: string;
  meal_type: string;
  created_at: string;
}

export interface DailyGoal {
  id: string;
  user_id: string;
  target_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fat: number;
  created_at: string;
  updated_at: string;
}

// Database functions
export async function saveMeal(userId: string, mealData: any) {
  const { data, error } = await supabase
    .from('meals')
    .insert([
      {
        user_id: userId,
        items: mealData.items,
        total_calories: mealData.totalCalories,
        total_protein: mealData.totalProtein,
        total_carbs: mealData.totalCarbs,
        total_fat: mealData.totalFat,
        meal_date: new Date().toISOString().split('T')[0],
        meal_type: mealData.mealType || 'lunch',
      },
    ])
    .select();

  return { data, error };
}

export async function getUserMeals(userId: string, days: number = 7) {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('meal_date', dateFrom.toISOString().split('T')[0])
    .order('meal_date', { ascending: false });

  return { data, error };
}

export async function getTodaysMeals(userId: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .eq('meal_date', today)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function setDailyGoal(userId: string, goal: any) {
  const { data: existing } = await supabase
    .from('daily_goals')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('daily_goals')
      .update({
        target_calories: goal.calories,
        target_protein: goal.protein,
        target_carbs: goal.carbs,
        target_fat: goal.fat,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select();

    return { data, error };
  } else {
    const { data, error } = await supabase
      .from('daily_goals')
      .insert([
        {
          user_id: userId,
          target_calories: goal.calories,
          target_protein: goal.protein,
          target_carbs: goal.carbs,
          target_fat: goal.fat,
        },
      ])
      .select();

    return { data, error };
  }
}

export async function getDailyGoal(userId: string) {
  const { data, error } = await supabase
    .from('daily_goals')
    .select('*')
    .eq('user_id', userId)
    .single();

  return { data, error };
}
