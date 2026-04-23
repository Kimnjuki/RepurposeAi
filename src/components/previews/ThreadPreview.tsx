'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ParsedThread } from '../../../convex/lib/parsers';

interface ThreadPreviewProps {
  data: ParsedThread;
  onCopyAll: () => void;
}

export function ThreadPreview({ data, onCopyAll }: ThreadPreviewProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  function copyTweet(index: number, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  function copyAsThread() {
    const text = data.tweets.map((t, i) => `${i + 1}/${data.total}\n${t}`).join('\n\n');
    navigator.clipboard.writeText(text);
  }

  function charColor(len: number) {
    if (len > 280) return 'text-destructive';
    if (len > 240) return 'text-orange-500';
    return 'text-muted-foreground';
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">🐦 Twitter Thread</h3>
          <Badge variant="secondary">{data.total} tweets</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyAsThread}>🧵 Copy Thread</Button>
          <Button variant="outline" size="sm" onClick={onCopyAll}>📋 Copy All</Button>
        </div>
      </div>

      <div className="space-y-3 border-l-2 border-muted pl-4">
        {data.tweets.map((tweet, i) => (
          <Card key={i} className="rounded-xl">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-xs font-bold text-muted-foreground w-6 pt-0.5">
                    {i + 1}.
                  </span>
                  <p className="text-sm leading-relaxed flex-1">{tweet}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0"
                  onClick={() => copyTweet(i, tweet)}
                >
                  {copiedIdx === i ? '✓' : '📋'}
                </Button>
              </div>
              <div className="flex justify-end mt-2">
                <span className={`text-xs ${charColor(tweet.length)}`}>
                  {tweet.length}/280
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
