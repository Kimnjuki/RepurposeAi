'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TOOLS } from '@/lib/constants';
import type { Plan } from '@/types';

interface ToolGridProps {
  plan: Plan;
}

export function ToolGrid({ plan }: ToolGridProps) {
  const canAccess = (locked: boolean) => !locked || plan !== 'free';

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">AI Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((tool) => {
          const accessible = canAccess(tool.locked);
          const href = accessible ? `/dashboard/tools/${tool.id}` : '/dashboard/upgrade';

          return (
            <Link key={tool.id} href={href}>
              <Card className="rounded-2xl shadow hover:scale-105 transition-transform duration-200 cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{tool.icon}</span>
                    <div className="flex items-center gap-1">
                      {tool.locked && plan === 'free' && (
                        <Badge variant="secondary" className="text-xs">Pro</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {tool.credits} cr
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-base mt-2">{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                  {!accessible && (
                    <p className="text-xs text-primary mt-2 font-medium">
                      🔒 Upgrade to unlock
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
