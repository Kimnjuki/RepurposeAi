'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ParsedShorts } from '../../../convex/lib/parsers';

interface ShortsGridProps {
  data: ParsedShorts;
  onCopyAll: () => void;
}

export function ShortsGrid({ data, onCopyAll }: ShortsGridProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  function copyClip(index: number, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  function exportCSV() {
    const headers = 'Clip,Timestamp,Hook,Caption,Hashtags';
    const rows = data.clips.map((c) =>
      `"${c.index}","${c.timestamp}","${c.hook}","${c.caption}","${c.hashtags.join(' ')}"`
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shorts.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">🎬 {data.total} Short Clips</h3>
          <Badge variant="secondary">{data.total} clips found</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCopyAll}>📋 Copy All</Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>⬇ Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.clips.map((clip, i) => (
          <Card key={i} className="rounded-xl">
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <div>
                <Badge variant="outline" className="mb-1">Clip {clip.index}</Badge>
                {clip.timestamp && (
                  <span className="ml-2 text-xs text-muted-foreground">⏱ {clip.timestamp}</span>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyClip(i, `Hook: ${clip.hook}\nCaption: ${clip.caption}\n${clip.hashtags.join(' ')}`)}
              >
                {copiedIdx === i ? '✓' : '📋'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {clip.hook && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hook</p>
                  <p className="text-sm font-medium">{clip.hook}</p>
                </div>
              )}
              {clip.caption && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Caption</p>
                  <p className="text-sm text-muted-foreground">{clip.caption}</p>
                </div>
              )}
              {clip.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {clip.hashtags.map((h) => (
                    <Badge key={h} variant="secondary" className="text-xs">{h}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
