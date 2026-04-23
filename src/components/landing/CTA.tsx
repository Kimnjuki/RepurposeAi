import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="py-24 px-4 bg-primary text-primary-foreground">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to 10x Your Content Output?
        </h2>
        <p className="text-lg opacity-90 mb-10">
          Join thousands of creators who use RepurposeAI to grow their audience faster.
          Start with 10 free credits — no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-base px-10">
              Get Started Free
            </Button>
          </Link>
          <Link href="#pricing">
            <Button
              size="lg"
              variant="outline"
              className="text-base px-10 border-primary-foreground/30 hover:bg-primary-foreground/10"
            >
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
