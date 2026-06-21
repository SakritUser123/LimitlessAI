import { NextRequest, NextResponse } from 'next/server';
import { estimateFoodByName } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const quantity = Number(body?.quantity ?? 1);

    if (!name) {
      return NextResponse.json({ error: 'Food name is required' }, { status: 400 });
    }

    const item = estimateFoodByName(name, quantity);

    return NextResponse.json({ item }, { status: 200 });
  } catch (error) {
    console.error('Error estimating food item:', error);
    return NextResponse.json(
      { error: 'Failed to estimate food item' },
      { status: 500 }
    );
  }
}
