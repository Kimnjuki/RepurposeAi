'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface CreditCounterProps {
  credits: number;
  plan: string;
}

export function CreditCounter({ credits, plan }: CreditCounterProps) {
  const isLow = credits <= 3;

  return (
    <Card className="mb-6">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⚡</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">{credits}</span>
              <span className="text-muted-foreground text-sm">credits remaining</span>
              {isLow && (
                <Badge variant="destructive" className="text-xs">Low</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground capitalize">{plan} plan</p>
          </div>
        </div>
        {(isLow || plan === 'free') && (
          <Link href="/dashboard/upgrade">
            <Button size="sm">Upgrade Plan</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
