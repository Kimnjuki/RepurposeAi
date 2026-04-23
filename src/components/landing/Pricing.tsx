import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: 0,
    credits: 10,
    description: 'Perfect for trying out RepurposeAI',
    features: ['10 credits on signup', 'Shorts Generator', 'Twitter Thread', 'Newsletter Tool', 'Standard speed'],
    cta: 'Get Started Free',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 29,
    credits: 100,
    description: 'For creators who publish consistently',
    features: ['100 credits/month', 'All 6 AI tools', 'Blog Post Generator', 'LinkedIn Carousel', 'Content Calendar', 'Priority speed'],
    cta: 'Start Pro',
    href: '/register?plan=pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    credits: 500,
    description: 'For teams and agencies at scale',
    features: ['500 credits/month', 'All Pro features', 'Team members', 'API access', 'Custom prompts', 'Priority support'],
    cta: 'Start Enterprise',
    href: '/register?plan=enterprise',
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg">Pay for what you use. No hidden fees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`rounded-2xl relative ${plan.highlighted ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <Link href={plan.href}>
                  <Button
                    className="w-full mb-6"
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
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
      </div>
    </section>
  );
}
