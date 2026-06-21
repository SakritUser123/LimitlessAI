import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const { userId } = session;
    
    console.log('Auth session:', { userId, hasSession: !!session });
    
    if (!userId) {
      console.log('No userId found in auth session');
      return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', { itemsCount: body.items?.length, totalCalories: body.totalCalories });
    
    const {
      items,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      mealType = 'lunch',
      notes = '',
      imageUrl,
    } = body;

    if (!items || !totalCalories) {
      console.log('Missing required fields:', { hasItems: !!items, totalCalories });
      return NextResponse.json(
        { error: 'Missing required fields (items and totalCalories)' },
        { status: 400 }
      );
    }

    console.log('Attempting to save meal to Supabase for user:', userId);
    
    // Save to Supabase
    const { data, error } = await supabaseServer
      .from('meals')
      .insert([
        {
          user_id: userId,
          items: items,
          calories: totalCalories,
          protein: totalProtein,
          carbs: totalCarbs,
          fat: totalFat,
          fiber: totalFiber,
          meal_type: mealType,
          description: items.map((i: any) => i.name).join(', '),
          notes: notes,
          image_url: imageUrl,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error details:', error);
      throw new Error(`Supabase: ${error.message} (${error.code})`);
    }

    console.log('Meal saved successfully:', data?.[0]?.id);
    
    return NextResponse.json(
      {
        success: true,
        meal: data?.[0],
        message: 'Meal saved successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error saving meal:', errorMessage);
    return NextResponse.json(
      {
        error: 'Failed to save meal',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
