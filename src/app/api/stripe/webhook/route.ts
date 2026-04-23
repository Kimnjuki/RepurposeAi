import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { PLAN_CREDITS } from '@/lib/plan-credits';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  const stripe = getStripe();
  let event: Awaited<ReturnType<typeof stripe.webhooks.constructEventAsync>>;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const { userId, plan } = (session.metadata as Record<string, string>) ?? {};
      const customerId = session.customer as string;

      if (userId && plan) {
        const credits = PLAN_CREDITS[plan] ?? 10;
        await convex.mutation(api.users.updatePlan, {
          userId: userId as never,
          plan,
          credits,
        });
        await convex.mutation(api.subscriptions.createSubscription, {
          userId: userId as never,
          plan,
          stripeCustomerId: customerId,
          status: 'active',
        });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;
      await convex.mutation(api.subscriptions.updateSubscriptionStatus, {
        stripeCustomerId: customerId,
        status: 'canceled',
        plan: 'free',
      });
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;
      await convex.mutation(api.subscriptions.updateSubscriptionStatus, {
        stripeCustomerId: customerId,
        status: 'past_due',
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
