'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  toolName?: string;
  reason?: 'credits' | 'plan';
}

export function PaywallModal({ open, onClose, toolName, reason = 'plan' }: PaywallModalProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="text-5xl text-center mb-4">
            {reason === 'credits' ? '⚡' : '🔒'}
          </div>
          <DialogTitle className="text-center text-xl">
            {reason === 'credits' ? 'Out of Credits' : `Unlock ${toolName ?? 'This Tool'}`}
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            {reason === 'credits'
              ? 'You\'ve used all your credits. Upgrade to Pro to get 100 credits/month.'
              : `The ${toolName} tool is available on the Pro plan and above.`}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <p className="font-semibold">Pro — $29/month</p>
            <ul className="text-muted-foreground space-y-1">
              <li>✓ 100 credits/month</li>
              <li>✓ All 6 AI tools unlocked</li>
              <li>✓ Priority generation speed</li>
            </ul>
          </div>

          <Button
            className="w-full"
            onClick={() => { router.push('/dashboard/upgrade'); onClose(); }}
          >
            Upgrade to Pro
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
