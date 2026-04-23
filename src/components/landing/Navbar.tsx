'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl">🔁</span>
        <span className="font-bold text-xl">RepurposeAI</span>
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
        <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
        <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        <Link href="#" className="hover:text-foreground transition-colors">Blog</Link>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/login">
          <Button variant="ghost" size="sm">Log in</Button>
        </Link>
        <Link href="/register">
          <Button size="sm">Get Started Free</Button>
        </Link>
      </div>
    </nav>
  );
}
