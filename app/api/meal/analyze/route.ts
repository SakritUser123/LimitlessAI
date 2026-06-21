import { NextRequest, NextResponse } from 'next/server';
import { analyzeFoodImage } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large (max 10MB)' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Analyze with OpenAI
    const analysis = await analyzeFoodImage(dataUrl);

    // Return analysis directly
    return NextResponse.json(
      {
        items: analysis.foods || [],
        totalCalories: analysis.totalCalories || 0,
        totalProtein: analysis.totalProtein || 0,
        totalCarbs: analysis.totalCarbs || 0,
        totalFat: analysis.totalFat || 0,
        totalFiber: analysis.totalFiber || 0,
        notes: analysis.notes || '',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error analyzing meal:', error);
    return NextResponse.json(
      { error: 'Failed to analyze meal. ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
