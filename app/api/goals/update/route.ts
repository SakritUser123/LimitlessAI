import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { DEFAULT_GOALS } from '@/lib/goals';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const { userId, sessionClaims } = session;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const target_calories = Number(body?.target_calories);
    const target_protein = Number(body?.target_protein);
    const target_carbs = Number(body?.target_carbs);
    const target_fat = Number(body?.target_fat);

    const hasInvalidNumber = [target_calories, target_protein, target_carbs, target_fat].some(
      (value) => Number.isNaN(value) || value < 0
    );

    if (hasInvalidNumber) {
      return NextResponse.json(
        { error: 'Invalid goal values' },
        { status: 400 }
      );
    }

    const nextGoals = {
      target_calories,
      target_protein,
      target_carbs,
      target_fat,
    };

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...(clerkUser.privateMetadata || {}),
        nutritionGoals: nextGoals,
        ...nextGoals,
      },
    });

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          success: true,
          message: 'Goals saved successfully',
          storage: 'clerk',
        },
        { status: 200 }
      );
    }

    const { data: existingUser, error: lookupError } = await supabaseServer
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    let error: { message?: string } | null = null;

    if (existingUser) {
      const result = await supabaseServer
        .from('users')
        .update({
          daily_goal_calories: target_calories,
          daily_goal_protein: target_protein,
          daily_goal_carbs: target_carbs,
          daily_goal_fat: target_fat,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_id', userId);

      error = result.error;
    } else {
      const claimEmail =
        (typeof sessionClaims?.email === 'string' && sessionClaims.email) ||
        (typeof sessionClaims?.email_address === 'string' && sessionClaims.email_address) ||
        null;

      const firstName =
        typeof sessionClaims?.given_name === 'string' ? sessionClaims.given_name : '';
      const lastName =
        typeof sessionClaims?.family_name === 'string' ? sessionClaims.family_name : '';

      const claimName = [firstName, lastName].filter(Boolean).join(' ').trim();

      const result = await supabaseServer
        .from('users')
        .insert({
          clerk_id: userId,
          email: claimEmail || `${userId}@clerk.local`,
          name: claimName || 'User',
          daily_goal_calories: nextGoals.target_calories ?? DEFAULT_GOALS.target_calories,
          daily_goal_protein: nextGoals.target_protein ?? DEFAULT_GOALS.target_protein,
          daily_goal_carbs: nextGoals.target_carbs ?? DEFAULT_GOALS.target_carbs,
          daily_goal_fat: nextGoals.target_fat ?? DEFAULT_GOALS.target_fat,
          updated_at: new Date().toISOString(),
        });

      error = result.error;
    }

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Goals saved successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving goals:', error);
    return NextResponse.json(
      {
        error: 'Failed to save goals',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
