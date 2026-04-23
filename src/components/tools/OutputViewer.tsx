'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShortsGrid } from '@/components/previews/ShortsGrid';
import { ThreadPreview } from '@/components/previews/ThreadPreview';
import { BlogPreview } from '@/components/previews/BlogPreview';
import { NewsletterPreview } from '@/components/previews/NewsletterPreview';
import { CarouselPlayer } from '@/components/previews/CarouselPlayer';
import { CalendarGrid } from '@/components/previews/CalendarGrid';
import type { ToolId } from '@/types';
import type { ParsedOutput } from '../../../convex/lib/parsers';

interface OutputViewerProps {
  rawContent: string;
  toolId: ToolId;
  toolName: string;
}

function parseContent(rawContent: string): { raw: string; structured: ParsedOutput | null } {
  try {
    const parsed = JSON.parse(rawContent);
    return { raw: parsed.raw ?? rawContent, structured: parsed.structured ?? null };
  } catch {
    return { raw: rawContent, structured: null };
  }
}

export function OutputViewer({ rawContent, toolId, toolName }: OutputViewerProps) {
  const { raw, structured } = parseContent(rawContent);

  function copyAll() {
    navigator.clipboard.writeText(raw);
  }

  function downloadRaw() {
    const blob = new Blob([raw], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${toolName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">✅ Generated Output</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyAll}>📋 Copy Raw</Button>
          <Button variant="outline" size="sm" onClick={downloadRaw}>⬇ Download</Button>
        </div>
      </CardHeader>
      <CardContent>
        {structured ? (
          <StructuredPreview toolId={toolId} structured={structured} onCopyAll={copyAll} />
        ) : (
          <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap text-sm font-mono leading-relaxed max-h-[600px] overflow-y-auto">
            {raw}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StructuredPreview({
  toolId,
  structured,
  onCopyAll,
}: {
  toolId: ToolId;
  structured: ParsedOutput;
  onCopyAll: () => void;
}) {
  switch (toolId) {
    case 'shorts':
      return <ShortsGrid data={structured as never} onCopyAll={onCopyAll} />;
    case 'thread':
      return <ThreadPreview data={structured as never} onCopyAll={onCopyAll} />;
    case 'blog':
      return <BlogPreview data={structured as never} onCopyAll={onCopyAll} />;
    case 'newsletter':
      return <NewsletterPreview data={structured as never} onCopyAll={onCopyAll} />;
    case 'carousel':
      return <CarouselPlayer data={structured as never} onCopyAll={onCopyAll} />;
    case 'calendar':
      return <CalendarGrid data={structured as never} onCopyAll={onCopyAll} />;
    default:
      return null;
  }
}
