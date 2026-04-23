import type { Tool } from '@/types';

export const TOOLS: Tool[] = [
  {
    id: 'shorts',
    name: 'Shorts Generator',
    description: 'Turn long videos into viral 60-second clips with hooks & captions',
    icon: '🎬',
    credits: 2,
    locked: false,
  },
  {
    id: 'thread',
    name: 'Twitter Thread',
    description: 'Convert any content into a viral 10-20 tweet thread',
    icon: '🐦',
    credits: 1,
    locked: false,
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Write high-converting email newsletters with subject lines & CTAs',
    icon: '📧',
    credits: 2,
    locked: false,
  },
  {
    id: 'blog',
    name: 'Blog Post',
    description: 'Generate SEO-optimized blog posts 1200-1500 words with FAQs',
    icon: '📝',
    credits: 3,
    locked: true,
  },
  {
    id: 'carousel',
    name: 'LinkedIn Carousel',
    description: 'Create engaging LinkedIn carousel slides with titles & content',
    icon: '🎠',
    credits: 2,
    locked: true,
  },
  {
    id: 'calendar',
    name: 'Content Calendar',
    description: 'Generate a 30-day social media calendar with captions & hashtags',
    icon: '📅',
    credits: 3,
    locked: true,
  },
];

export const PLANS = {
  free: { name: 'Free', credits: 3, price: 0 },
  pro: { name: 'Pro', credits: 50, price: 9.99 },
  lifetime: { name: 'Lifetime', credits: 9999, price: 49 },
};

export const CREDIT_COSTS: Record<string, number> = {
  shorts: 2,
  thread: 1,
  newsletter: 2,
  blog: 3,
  carousel: 2,
  calendar: 3,
};

export const LIMITS = {
  maxVideoMinutes: 15,
  maxWords: 5000,
};
