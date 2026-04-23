import { NextRequest, NextResponse } from 'next/server';
import { callDeepSeek } from '@/lib/deepseek';

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  if (!input || typeof input !== 'string') {
    return NextResponse.json({ error: 'Input is required' }, { status: 400 });
  }

  try {
    const content = await callDeepSeek('thread', input);
    return NextResponse.json({ status: 'completed', content });
  } catch (err) {
    console.error('Generate thread error:', err);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
