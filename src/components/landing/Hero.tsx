import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-4 max-w-4xl mx-auto">
      <Badge variant="secondary" className="mb-6">
        ✨ Powered by DeepSeek AI
      </Badge>

      <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
        Turn One Piece of Content Into{' '}
        <span className="text-primary">10x More</span>
      </h1>

      <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
        Paste your video transcript, blog post, or podcast notes. RepurposeAI instantly
        generates shorts, threads, newsletters, carousels, and 30-day content calendars.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/register">
          <Button size="lg" className="text-base px-8">
            Start for Free — 10 Credits
          </Button>
        </Link>
        <Link href="#features">
          <Button size="lg" variant="outline" className="text-base px-8">
            See How It Works
          </Button>
        </Link>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        No credit card required · 10 free credits on signup
      </p>

      <div className="mt-16 w-full rounded-2xl border bg-muted/30 p-8 text-left">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold">6</p>
            <p className="text-muted-foreground text-sm mt-1">AI Content Tools</p>
          </div>
          <div>
            <p className="text-4xl font-bold">10x</p>
            <p className="text-muted-foreground text-sm mt-1">Content Output</p>
          </div>
          <div>
            <p className="text-4xl font-bold">60s</p>
            <p className="text-muted-foreground text-sm mt-1">Generation Time</p>
          </div>
        </div>
      </div>
    </section>
  );
}
