import { NextRequest, NextResponse } from 'next/server';
import { callDeepSeek } from '@/lib/deepseek';

export async function POST(req: NextRequest) {
  const { input, userId } = await req.json();

  if (!input || typeof input !== 'string') {
    return NextResponse.json({ error: 'Input is required' }, { status: 400 });
  }

  if (input.split(/\s+/).length > 5000) {
    return NextResponse.json({ error: 'Input exceeds 5000 word limit' }, { status: 400 });
  }

  try {
    const content = await callDeepSeek('shorts', input);
    return NextResponse.json({ status: 'completed', content, userId });
  } catch (err) {
    console.error('Generate shorts error:', err);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
