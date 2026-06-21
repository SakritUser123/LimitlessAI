import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { DEFAULT_GOALS, extractGoalsFromMetadata } from '@/lib/goals';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { userId } = session;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const clerkGoals = extractGoalsFromMetadata(clerkUser.privateMetadata, clerkUser.publicMetadata);

    const hasClerkGoals = Object.values(clerkGoals).some(
      (value, index) => value !== Object.values(DEFAULT_GOALS)[index]
    );

    if (hasClerkGoals) {
      return NextResponse.json(clerkGoals, { status: 200 });
    }

    const { data: user } = await supabaseServer
      .from('users')
      .select('daily_goal_calories, daily_goal_protein, daily_goal_carbs, daily_goal_fat')
      .eq('clerk_id', userId)
      .maybeSingle();

    if (!user) {
      return NextResponse.json(DEFAULT_GOALS, { status: 200 });
    }

    return NextResponse.json(
      {
        target_calories: user.daily_goal_calories ?? DEFAULT_GOALS.target_calories,
        target_protein: user.daily_goal_protein ?? DEFAULT_GOALS.target_protein,
        target_carbs: user.daily_goal_carbs ?? DEFAULT_GOALS.target_carbs,
        target_fat: user.daily_goal_fat ?? DEFAULT_GOALS.target_fat,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch goals',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
