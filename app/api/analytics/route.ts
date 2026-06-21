import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { getDateRange } from '@/lib/utils';
import { DEFAULT_GOALS, extractGoalsFromMetadata } from '@/lib/goals';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { userId } = session;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');

    const { start, end } = getDateRange(days);
    const startDateTime = new Date(start);
    startDateTime.setHours(0, 0, 0, 0);
    const endDateTime = new Date(end);
    endDateTime.setHours(23, 59, 59, 999);

    const client = await clerkClient();

    const [mealsResult, userResult, clerkUser] = await Promise.all([
      supabaseServer
        .from('meals')
        .select()
        .eq('user_id', userId)
        .gte('created_at', startDateTime.toISOString())
        .lte('created_at', endDateTime.toISOString())
        .order('created_at', { ascending: true }),
      supabaseServer
        .from('users')
        .select('daily_goal_calories, daily_goal_protein, daily_goal_carbs, daily_goal_fat')
        .eq('clerk_id', userId)
        .maybeSingle(),
      client.users.getUser(userId),
    ]);

    let { data: meals, error } = mealsResult;
    const { data: user } = userResult;

    if (error) {
      throw error;
    }

    let dataSource = `last ${days} days`;

    if (!meals || meals.length === 0) {
      const fallbackResult = await supabaseServer
        .from('meals')
        .select()
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (fallbackResult.error) {
        throw fallbackResult.error;
      }

      meals = fallbackResult.data || [];
      dataSource = 'all-time';
    }

    const clerkGoals = extractGoalsFromMetadata(clerkUser.privateMetadata, clerkUser.publicMetadata);

    const goals = {
      calories: clerkGoals.target_calories ?? user?.daily_goal_calories ?? DEFAULT_GOALS.target_calories,
      protein: clerkGoals.target_protein ?? user?.daily_goal_protein ?? DEFAULT_GOALS.target_protein,
      carbs: clerkGoals.target_carbs ?? user?.daily_goal_carbs ?? DEFAULT_GOALS.target_carbs,
      fat: clerkGoals.target_fat ?? user?.daily_goal_fat ?? DEFAULT_GOALS.target_fat,
    };

    // Group by date
    const groupedByDate: Record<string, any> = {};
    const hourlyDistribution: Record<string, number> = {};
    const mealTypeCounts: Record<string, number> = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
      unknown: 0,
    };

    meals?.forEach((meal) => {
      const date = meal.created_at.split('T')[0];
      const hour = new Date(meal.created_at).getHours();
      const bucket = `${hour.toString().padStart(2, '0')}:00`;
      hourlyDistribution[bucket] = (hourlyDistribution[bucket] || 0) + 1;

      const mealType = (meal.meal_type || 'unknown').toLowerCase();
      mealTypeCounts[mealType] = (mealTypeCounts[mealType] || 0) + 1;

      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          totalFiber: 0,
          mealCount: 0,
          calorieProgress: 0,
          meals: [],
        };
      }
      groupedByDate[date].totalCalories += meal.calories || 0;
      groupedByDate[date].totalProtein += meal.protein || 0;
      groupedByDate[date].totalCarbs += meal.carbs || 0;
      groupedByDate[date].totalFat += meal.fat || 0;
      groupedByDate[date].totalFiber += meal.fiber || 0;
      groupedByDate[date].mealCount += 1;
      groupedByDate[date].meals.push(meal);
    });

    const allDays: Array<{
      date: string;
      totalCalories: number;
      totalProtein: number;
      totalCarbs: number;
      totalFat: number;
      totalFiber: number;
      mealCount: number;
      calorieProgress: number;
      meals: any[];
    }> = [];

    const dayCursor = new Date(startDateTime);
    while (dayCursor <= endDateTime) {
      const date = dayCursor.toISOString().split('T')[0];
      const existing = groupedByDate[date];

      allDays.push({
        date,
        totalCalories: existing?.totalCalories || 0,
        totalProtein: existing?.totalProtein || 0,
        totalCarbs: existing?.totalCarbs || 0,
        totalFat: existing?.totalFat || 0,
        totalFiber: existing?.totalFiber || 0,
        mealCount: existing?.mealCount || 0,
        calorieProgress: goals.calories > 0 ? Math.min(((existing?.totalCalories || 0) / goals.calories) * 100, 200) : 0,
        meals: existing?.meals || [],
      });

      dayCursor.setDate(dayCursor.getDate() + 1);
    }

    const analytics = allDays;

    const totalCalories = meals?.reduce((sum, meal) => sum + (meal.calories || 0), 0) || 0;
    const totalProtein = meals?.reduce((sum, meal) => sum + (meal.protein || 0), 0) || 0;
    const totalCarbs = meals?.reduce((sum, meal) => sum + (meal.carbs || 0), 0) || 0;
    const totalFat = meals?.reduce((sum, meal) => sum + (meal.fat || 0), 0) || 0;
    const totalFiber = meals?.reduce((sum, meal) => sum + (meal.fiber || 0), 0) || 0;

    const daysWithMeals = analytics.length;
    const activeDayAverage = daysWithMeals > 0 ? totalCalories / daysWithMeals : 0;
    const periodAverage = days > 0 ? totalCalories / days : 0;

    const sortedByCalories = [...analytics].sort((a, b) => b.totalCalories - a.totalCalories);
    const highestDay = sortedByCalories[0] || null;
    const lowestDay = [...analytics].sort((a, b) => a.totalCalories - b.totalCalories)[0] || null;

    const macroCalories = {
      protein: totalProtein * 4,
      carbs: totalCarbs * 4,
      fat: totalFat * 9,
    };
    const macroCaloriesTotal = macroCalories.protein + macroCalories.carbs + macroCalories.fat || 1;

    const mealCount = meals?.length || 0;
    const averageMealsPerDay = days > 0 ? mealCount / days : 0;
    const goalProgress = {
      calories: goals.calories > 0 ? Math.min((totalCalories / (goals.calories * Math.max(days, 1))) * 100, 999) : 0,
      protein: goals.protein > 0 ? Math.min((totalProtein / (goals.protein * Math.max(days, 1))) * 100, 999) : 0,
      carbs: goals.carbs > 0 ? Math.min((totalCarbs / (goals.carbs * Math.max(days, 1))) * 100, 999) : 0,
      fat: goals.fat > 0 ? Math.min((totalFat / (goals.fat * Math.max(days, 1))) * 100, 999) : 0,
    };

    const mealStreak = (() => {
      const byDate = new Set(meals?.map((meal) => meal.created_at.split('T')[0]) || []);
      let streak = 0;
      const cursor = new Date(endDateTime);
      cursor.setDate(cursor.getDate() - 1);

      while (streak < days) {
        const date = cursor.toISOString().split('T')[0];
        if (byDate.has(date)) {
          streak += 1;
          cursor.setDate(cursor.getDate() - 1);
        } else {
          break;
        }
      }
      return streak;
    })();

    return NextResponse.json({
      period: { start, end, days },
      dataSource,
      goals,
      summary: {
        totalMeals: mealCount,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        totalFiber,
        daysWithMeals,
        averageMealsPerDay: Number(averageMealsPerDay.toFixed(1)),
        avgCaloriesPerDay: Math.round(activeDayAverage),
        avgCaloriesPerPeriodDay: Math.round(periodAverage),
        avgProteinPerDay: daysWithMeals > 0 ? Math.round(totalProtein / daysWithMeals) : 0,
        avgCarbsPerDay: daysWithMeals > 0 ? Math.round(totalCarbs / daysWithMeals) : 0,
        avgFatPerDay: daysWithMeals > 0 ? Math.round(totalFat / daysWithMeals) : 0,
        avgFiberPerDay: daysWithMeals > 0 ? Math.round(totalFiber / daysWithMeals) : 0,
        mealStreak,
      },
      macroSplit: {
        protein: Math.round((macroCalories.protein / macroCaloriesTotal) * 100),
        carbs: Math.round((macroCalories.carbs / macroCaloriesTotal) * 100),
        fat: Math.round((macroCalories.fat / macroCaloriesTotal) * 100),
      },
      goalProgress,
      highestDay,
      lowestDay,
      mealTypeCounts,
      hourlyDistribution,
      data: analytics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
