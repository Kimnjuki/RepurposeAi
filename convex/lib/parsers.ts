// Structured output parsers for each AI tool

export interface ShortClip {
  index: number;
  hook: string;
  timestamp: string;
  caption: string;
  hashtags: string[];
}

export interface ParsedShorts {
  clips: ShortClip[];
  total: number;
}

export interface ParsedThread {
  tweets: string[];
  total: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ParsedBlog {
  title: string;
  metaDescription: string;
  keywords: string[];
  content: string;
  faqs: FAQ[];
}

export interface NewsletterSection {
  heading: string;
  body: string;
  cta?: string;
}

export interface ParsedNewsletter {
  subject: string;
  previewText: string;
  sections: NewsletterSection[];
}

export interface CarouselSlide {
  index: number;
  heading: string;
  content: string;
  imagePrompt?: string;
}

export interface ParsedCarousel {
  title: string;
  slides: CarouselSlide[];
  total: number;
}

export interface CalendarPost {
  day: number;
  platform: string;
  tone: string;
  content: string;
  hashtags: string[];
}

export interface ParsedCalendar {
  posts: CalendarPost[];
  total: number;
}

export type ParsedOutput =
  | ParsedShorts
  | ParsedThread
  | ParsedBlog
  | ParsedNewsletter
  | ParsedCarousel
  | ParsedCalendar;

// ─── Shorts Parser ────────────────────────────────────────────────────────────

export function parseShortsOutput(raw: string): ParsedShorts {
  const clips: ShortClip[] = [];
  const blocks = raw.split(/\n(?=\*\*(?:clip|segment|short|#)\s*\d|\d+[\.\)]\s)/i);

  let index = 0;
  for (const block of blocks) {
    if (!block.trim()) continue;
    const current: Partial<ShortClip> = { index: ++index };

    const hookMatch = block.match(/hook:?\s*(.+)/i);
    if (hookMatch) current.hook = hookMatch[1].trim().replace(/^\*+|\*+$/g, '');

    const tsMatch = block.match(/timestamp:?\s*(.+)/i);
    if (tsMatch) current.timestamp = tsMatch[1].trim();

    const captionMatch = block.match(/caption:?\s*(.+)/i);
    if (captionMatch) current.caption = captionMatch[1].trim();

    const hashtagMatch = block.match(/hashtags?:?\s*(.+)/i);
    if (hashtagMatch) {
      current.hashtags = hashtagMatch[1]
        .split(/[\s,]+/)
        .filter((h) => h.startsWith('#'));
    } else {
      const allHashtags = block.match(/#\w+/g) ?? [];
      current.hashtags = [...new Set(allHashtags)];
    }

    if (current.hook || current.caption) {
      clips.push({
        index: current.index ?? index,
        hook: current.hook ?? '',
        timestamp: current.timestamp ?? '',
        caption: current.caption ?? '',
        hashtags: current.hashtags ?? [],
      });
    }
  }

  // Fallback: if no structured clips found, try line-by-line
  if (clips.length === 0) {
    const lines = raw.split('\n').filter((l) => l.trim());
    let current: Partial<ShortClip> = { index: 1, hashtags: [] };
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^\*\*(?:clip|segment|short)\s*\d/i.test(trimmed) || /^\d+[\.\)]\s/.test(trimmed)) {
        if (current.hook) clips.push(current as ShortClip);
        current = { index: clips.length + 1, hashtags: [] };
        continue;
      }
      const hookMatch = trimmed.match(/hook:?\s*(.+)/i);
      if (hookMatch) { current.hook = hookMatch[1].trim(); continue; }
      const tsMatch = trimmed.match(/timestamp:?\s*(.+)/i);
      if (tsMatch) { current.timestamp = tsMatch[1].trim(); continue; }
      const captionMatch = trimmed.match(/caption:?\s*(.+)/i);
      if (captionMatch) { current.caption = captionMatch[1].trim(); continue; }
      const hashtagMatch = trimmed.match(/hashtags?:?\s*(.+)/i);
      if (hashtagMatch) {
        current.hashtags = hashtagMatch[1].split(/[\s,]+/).filter((h) => h.startsWith('#'));
      }
    }
    if (current.hook) clips.push(current as ShortClip);
  }

  return { clips, total: clips.length };
}

// ─── Thread Parser ────────────────────────────────────────────────────────────

export function parseThreadOutput(raw: string): ParsedThread {
  const tweets: string[] = [];

  // Match numbered tweets: "1.", "1)", "Tweet 1:", etc.
  const numbered = raw.match(/(?:^|\n)(?:tweet\s*)?\d+[\.\):]?\s*(.+?)(?=\n(?:tweet\s*)?\d+[\.\):]|\n*$)/gi);

  if (numbered && numbered.length >= 3) {
    for (const match of numbered) {
      const text = match.replace(/^(?:tweet\s*)?\d+[\.\):]?\s*/i, '').trim();
      if (text && text.length > 5) tweets.push(text);
    }
  } else {
    // Fallback: split by blank lines or emoji bullets
    const blocks = raw.split(/\n{2,}/).filter((b) => b.trim().length > 10);
    tweets.push(...blocks.map((b) => b.trim()));
  }

  return { tweets, total: tweets.length };
}

// ─── Blog Parser ─────────────────────────────────────────────────────────────

export function parseBlogOutput(raw: string): ParsedBlog {
  const titleMatch = raw.match(/^#\s+(.+)|title:\s*(.+)/im);
  const title = (titleMatch?.[1] ?? titleMatch?.[2] ?? 'Blog Post').trim();

  const metaMatch = raw.match(/meta(?:\s+description)?:?\s*(.+)/i);
  const metaDescription = metaMatch?.[1]?.trim() ?? '';

  const keywordsMatch = raw.match(/keywords?:?\s*(.+)/i);
  const keywords = keywordsMatch
    ? keywordsMatch[1].split(/[,;]+/).map((k) => k.trim()).filter(Boolean)
    : [];

  // Extract FAQs
  const faqs: FAQ[] = [];
  const faqSection = raw.match(/##?\s*(?:faq|frequently asked questions)([\s\S]+?)(?=##|$)/i);
  if (faqSection) {
    const faqText = faqSection[1];
    const qMatches = faqText.matchAll(/\*\*Q?:?\*?\*?\s*(.+?)\*\*\s*\n+\*?A?:?\*?\s*(.+?)(?=\n\*\*|\n*$)/gi);
    for (const m of qMatches) {
      faqs.push({ question: m[1].trim(), answer: m[2].trim() });
    }
    if (faqs.length === 0) {
      const lines = faqText.split('\n').filter((l) => l.trim());
      for (let i = 0; i < lines.length - 1; i++) {
        if (lines[i].match(/^\*\*|^Q:|^\d+\./)) {
          faqs.push({
            question: lines[i].replace(/^\*\*|\*\*$|^Q:\s*/g, '').trim(),
            answer: lines[i + 1].replace(/^A:\s*/i, '').trim(),
          });
          i++;
        }
      }
    }
  }

  return { title, metaDescription, keywords, content: raw, faqs };
}

// ─── Newsletter Parser ────────────────────────────────────────────────────────

export function parseNewsletterOutput(raw: string): ParsedNewsletter {
  const subjectMatch = raw.match(/subject(?:\s+line)?:?\s*(.+)/i);
  const subject = subjectMatch?.[1]?.trim().replace(/^\*+|\*+$/g, '') ?? 'Newsletter';

  const previewMatch = raw.match(/preview(?:\s+text)?:?\s*(.+)/i);
  const previewText = previewMatch?.[1]?.trim() ?? '';

  const sections: NewsletterSection[] = [];
  const sectionBlocks = raw.split(/\n(?=##?\s)/);

  for (const block of sectionBlocks) {
    const headingMatch = block.match(/^##?\s*(.+)/);
    if (!headingMatch) continue;
    const heading = headingMatch[1].trim();
    const body = block.replace(/^##?\s*.+\n/, '').trim();
    const ctaMatch = body.match(/(?:cta|call to action|click here|learn more|sign up)[:\s]*(.+)/i);
    sections.push({
      heading,
      body: body.replace(/(?:cta|call to action):?\s*.+/gi, '').trim(),
      cta: ctaMatch?.[1]?.trim(),
    });
  }

  if (sections.length === 0) {
    const blocks = raw.split(/\n{2,}/).filter((b) => b.trim().length > 20);
    blocks.slice(1).forEach((b, i) => {
      sections.push({ heading: `Section ${i + 1}`, body: b.trim() });
    });
  }

  return { subject, previewText, sections };
}

// ─── Carousel Parser ──────────────────────────────────────────────────────────

export function parseCarouselOutput(raw: string): ParsedCarousel {
  const titleMatch = raw.match(/^#\s+(.+)|title:?\s*(.+)/im);
  const title = (titleMatch?.[1] ?? titleMatch?.[2] ?? 'LinkedIn Carousel').trim();

  const slides: CarouselSlide[] = [];
  const slideBlocks = raw.split(/\n(?=##?\s*(?:slide|card)\s*\d|(?:slide|card)\s*\d)/i);

  let index = 0;
  for (const block of slideBlocks) {
    if (!block.trim() || block.match(/^#\s/)) continue;
    const headingMatch = block.match(/###?\s*(?:slide|card)?\s*\d*:?\s*(.+)|(?:slide|card)\s*\d+:?\s*(.+)/i);
    const heading = (headingMatch?.[1] ?? headingMatch?.[2] ?? `Slide ${++index}`).trim();
    const content = block
      .replace(/^###?\s*(?:slide|card)?\s*\d*:?.+\n/i, '')
      .replace(/image\s*prompt:?.+/gi, '')
      .trim();
    const imagePromptMatch = block.match(/image\s*(?:prompt|idea)?:?\s*(.+)/i);
    slides.push({ index: ++index, heading, content, imagePrompt: imagePromptMatch?.[1]?.trim() });
  }

  if (slides.length === 0) {
    const blocks = raw.split(/\n{2,}/).filter((b) => b.trim().length > 10);
    blocks.forEach((b, i) => {
      const lines = b.split('\n').filter((l) => l.trim());
      slides.push({
        index: i + 1,
        heading: lines[0]?.replace(/^\*+|\*+$/g, '').trim() ?? `Slide ${i + 1}`,
        content: lines.slice(1).join('\n').trim(),
      });
    });
  }

  return { title, slides, total: slides.length };
}

// ─── Calendar Parser ──────────────────────────────────────────────────────────

export function parseCalendarOutput(raw: string): ParsedCalendar {
  const posts: CalendarPost[] = [];

  // Match "Day X" patterns
  const dayBlocks = raw.split(/\n(?=day\s*\d+|week\s*\d+)/i);

  for (const block of dayBlocks) {
    const dayMatch = block.match(/day\s*(\d+)/i);
    if (!dayMatch) continue;
    const day = parseInt(dayMatch[1]);

    const platformMatch = block.match(/platform:?\s*(.+)/i);
    const toneMatch = block.match(/tone:?\s*(.+)/i);
    const captionMatch = block.match(/(?:caption|content|post):?\s*(.+)/i);
    const hashtagMatch = block.match(/hashtags?:?\s*(.+)/i);

    posts.push({
      day,
      platform: platformMatch?.[1]?.trim() ?? 'Instagram',
      tone: toneMatch?.[1]?.trim() ?? 'Engaging',
      content: captionMatch?.[1]?.trim() ?? block.split('\n')[1]?.trim() ?? '',
      hashtags: hashtagMatch
        ? hashtagMatch[1].split(/[\s,]+/).filter((h) => h.startsWith('#'))
        : [],
    });
  }

  // Fallback: table format
  if (posts.length === 0) {
    const rows = raw.match(/\|\s*\d+\s*\|.+/g) ?? [];
    rows.forEach((row, i) => {
      const cols = row.split('|').map((c) => c.trim()).filter(Boolean);
      if (cols.length >= 3) {
        posts.push({
          day: parseInt(cols[0]) || i + 1,
          platform: cols[1] ?? 'Instagram',
          tone: cols[2] ?? 'Engaging',
          content: cols[3] ?? '',
          hashtags: (cols[4] ?? '').split(/[\s,]+/).filter((h) => h.startsWith('#')),
        });
      }
    });
  }

  return { posts, total: posts.length };
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

export function parseOutput(tool: string, raw: string): ParsedOutput {
  switch (tool) {
    case 'shorts': return parseShortsOutput(raw);
    case 'thread': return parseThreadOutput(raw);
    case 'blog': return parseBlogOutput(raw);
    case 'newsletter': return parseNewsletterOutput(raw);
    case 'carousel': return parseCarouselOutput(raw);
    case 'calendar': return parseCalendarOutput(raw);
    default: return parseThreadOutput(raw);
  }
}
