'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ParsedCalendar, CalendarPost } from '../../../convex/lib/parsers';

const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'bg-pink-100 text-pink-700',
  twitter: 'bg-sky-100 text-sky-700',
  linkedin: 'bg-blue-100 text-blue-700',
  tiktok: 'bg-purple-100 text-purple-700',
  facebook: 'bg-indigo-100 text-indigo-700',
};

function getPlatformColor(platform: string) {
  return PLATFORM_COLORS[platform.toLowerCase()] ?? 'bg-gray-100 text-gray-700';
}

interface CalendarGridProps {
  data: ParsedCalendar;
  onCopyAll: () => void;
}

export function CalendarGrid({ data, onCopyAll }: CalendarGridProps) {
  const [selected, setSelected] = useState<CalendarPost | null>(null);

  function exportCSV() {
    const headers = 'Day,Platform,Tone,Content,Hashtags';
    const rows = data.posts.map((p) =>
      `"${p.day}","${p.platform}","${p.tone}","${p.content}","${p.hashtags.join(' ')}"`
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '30-day-calendar.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">📅 30-Day Calendar</h3>
          <Badge variant="secondary">{data.total} posts</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>⬇ Export CSV</Button>
          <Button variant="outline" size="sm" onClick={onCopyAll}>📋 Copy All</Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {data.posts.map((post) => (
          <button
            key={post.day}
            onClick={() => setSelected(post)}
            className={`rounded-lg p-2 text-left border transition-all hover:scale-105 ${
              selected?.day === post.day ? 'border-primary ring-1 ring-primary' : 'border-border'
            }`}
          >
            <span className="text-xs font-bold text-muted-foreground block">Day {post.day}</span>
            <span className={`text-xs px-1 py-0.5 rounded font-medium mt-1 inline-block ${getPlatformColor(post.platform)}`}>
              {post.platform.slice(0, 2).toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <Card className="rounded-xl border-primary/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Day {selected.day}</CardTitle>
                <Badge className={getPlatformColor(selected.platform)}>{selected.platform}</Badge>
                <Badge variant="outline">{selected.tone}</Badge>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigator.clipboard.writeText(`${selected.content}\n\n${selected.hashtags.join(' ')}`)}
              >
                📋 Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed">{selected.content}</p>
            {selected.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selected.hashtags.map((h) => (
                  <Badge key={h} variant="secondary" className="text-xs">{h}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
