import { NextRequest, NextResponse } from 'next/server';
import { getStripe, STRIPE_PLANS } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const { plan, userId } = await req.json();

  if (!plan || !userId) {
    return NextResponse.json({ error: 'plan and userId are required' }, { status: 400 });
  }

  const priceId = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS];
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/dashboard/upgrade`,
    metadata: { userId, plan },
  });

  return NextResponse.json({ url: session.url });
}
