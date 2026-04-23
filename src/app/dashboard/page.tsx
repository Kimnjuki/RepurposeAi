'use client';

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { CreditCounter } from '@/components/dashboard/CreditCounter';
import { ToolGrid } from '@/components/dashboard/ToolGrid';
import type { Id } from '../../../convex/_generated/dataModel';
import type { Plan } from '@/types';

export default function DashboardPage() {
  const [userId, setUserId] = useState<Id<'users'> | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) setUserId(id as Id<'users'>);
    else window.location.href = '/login';
  }, []);

  const user = useQuery(api.users.getUser, userId ? { userId } : 'skip');

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground animate-pulse">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user.email}</p>
      </div>

      <CreditCounter credits={user.credits} plan={user.plan} />
      <ToolGrid plan={user.plan as Plan} />
    </div>
  );
}
