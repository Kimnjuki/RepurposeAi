'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const plans = [
  {
    name: 'Pro',
    price: 9.99,
    billing: '/month',
    credits: 50,
    priceId: 'pro',
    features: ['50 credits/month', 'All 6 AI tools', 'Blog Post Generator', 'LinkedIn Carousel', 'Content Calendar', 'CSV & HTML exports', 'Priority speed'],
    highlighted: false,
    badge: 'Most Popular',
  },
  {
    name: 'Lifetime',
    price: 49,
    billing: ' one-time',
    credits: 9999,
    priceId: 'lifetime',
    features: ['Unlimited credits forever', 'All 6 AI tools', 'All export formats', 'Priority support', 'All future features', '🔥 Limited spots remaining'],
    highlighted: true,
    badge: '🔥 Best Value',
  },
];

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  async function handleCheckout(plan: string) {
    if (!userId) return;
    setLoading(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(null);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upgrade Your Plan</h1>
        <p className="text-muted-foreground mt-1">Unlock all tools and get more credits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {plans.map((plan) => (
          <Card key={plan.name} className={`rounded-2xl relative ${plan.highlighted ? 'border-primary shadow-lg' : ''}`}>
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">{plan.badge}</Badge>
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.billing}</span>
              </div>
              <p className="text-sm text-muted-foreground">{plan.credits === 9999 ? 'Unlimited' : plan.credits} credits</p>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full mb-4"
                variant={plan.highlighted ? 'default' : 'outline'}
                onClick={() => handleCheckout(plan.priceId)}
                disabled={loading !== null}
              >
                {loading === plan.priceId ? 'Redirecting…' : `Get ${plan.name}`}
              </Button>
              <Separator className="mb-4" />
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        Secure payment via Stripe. Cancel anytime for Pro. Lifetime is a one-time purchase.
      </p>
    </div>
  );
}
