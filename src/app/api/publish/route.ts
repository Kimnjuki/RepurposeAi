import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { outputId, platform, scheduledAt } = await req.json();

  if (!outputId || !platform) {
    return NextResponse.json({ error: 'outputId and platform are required' }, { status: 400 });
  }

  return NextResponse.json({
    status: 'scheduled',
    outputId,
    platform,
    scheduledAt: scheduledAt ?? Date.now(),
  });
}
