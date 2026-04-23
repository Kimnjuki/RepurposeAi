'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ParsedCarousel } from '../../../convex/lib/parsers';

interface CarouselPlayerProps {
  data: ParsedCarousel;
  onCopyAll: () => void;
}

export function CarouselPlayer({ data, onCopyAll }: CarouselPlayerProps) {
  const [current, setCurrent] = useState(0);
  const slide = data.slides[current];

  function copySlide() {
    if (!slide) return;
    navigator.clipboard.writeText(`${slide.heading}\n\n${slide.content}`);
  }

  function exportAll() {
    const text = data.slides
      .map((s, i) => `--- Slide ${i + 1} ---\n${s.heading}\n\n${s.content}${s.imagePrompt ? `\n\nImage: ${s.imagePrompt}` : ''}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carousel.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">🎠 LinkedIn Carousel</h3>
          <Badge variant="secondary">{data.total} slides</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportAll}>⬇ Export</Button>
          <Button variant="outline" size="sm" onClick={onCopyAll}>📋 Copy All</Button>
        </div>
      </div>

      {/* Slide viewer */}
      <Card className="rounded-2xl overflow-hidden mb-4">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 min-h-[200px] flex flex-col items-center justify-center p-8 text-center">
          <Badge className="mb-4">Slide {current + 1} of {data.total}</Badge>
          <h2 className="text-2xl font-bold mb-3">{slide?.heading}</h2>
          <p className="text-muted-foreground leading-relaxed max-w-md whitespace-pre-wrap">{slide?.content}</p>
          {slide?.imagePrompt && (
            <p className="mt-4 text-xs text-muted-foreground italic">🖼 {slide.imagePrompt}</p>
          )}
        </div>
        <CardContent className="py-3 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
          >← Prev</Button>
          <Button variant="ghost" size="sm" onClick={copySlide}>📋 Copy slide</Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrent((c) => Math.min(data.total - 1, c + 1))}
            disabled={current === data.total - 1}
          >Next →</Button>
        </CardContent>
      </Card>

      {/* Slide thumbnails */}
      <div className="grid grid-cols-5 gap-2">
        {data.slides.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-lg border p-2 text-left text-xs transition-colors ${
              current === i ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            }`}
          >
            <span className="text-muted-foreground font-medium block mb-1">{i + 1}</span>
            <span className="line-clamp-2">{s.heading}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
