import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { getTodayDate } from '@/lib/utils';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = getTodayDate();
    const startDate = new Date(today);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 1);

    const { data: meals, error } = await supabaseServer
      .from('meals')
      .select()
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lt('created_at', endDate.toISOString());

    if (error) {
      throw error;
    }

    const summary = {
      date: today,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
      mealCount: meals?.length || 0,
    };

    if (meals) {
      meals.forEach((meal) => {
        summary.totalCalories += meal.calories || 0;
        summary.totalProtein += meal.protein || 0;
        summary.totalCarbs += meal.carbs || 0;
        summary.totalFat += meal.fat || 0;
        summary.totalFiber += meal.fiber || 0;
      });
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching daily nutrition:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nutrition data' },
      { status: 500 }
    );
  }
}
