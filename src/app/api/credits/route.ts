import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userId, amount } = await req.json();

  if (!userId || typeof amount !== 'number') {
    return NextResponse.json({ error: 'userId and amount are required' }, { status: 400 });
  }

  return NextResponse.json({ success: true, userId, deducted: amount });
}
