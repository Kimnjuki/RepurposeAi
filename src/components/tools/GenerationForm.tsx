'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TOOLS, LIMITS, CREDIT_COSTS } from '@/lib/constants';
import type { ToolId } from '@/types';

interface GenerationFormProps {
  toolId: ToolId;
  onSubmit: (input: string) => Promise<void>;
  loading: boolean;
}

export function GenerationForm({ toolId, onSubmit, loading }: GenerationFormProps) {
  const [input, setInput] = useState('');
  const tool = TOOLS.find((t) => t.id === toolId);
  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  const isOverLimit = wordCount > LIMITS.maxWords;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isOverLimit) return;
    await onSubmit(input.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">
          {toolId === 'shorts'
            ? 'Paste your video transcript'
            : toolId === 'calendar'
            ? 'Describe your brand / content topics'
            : 'Paste your content'}
        </Label>
        <Textarea
          id="content"
          placeholder={
            toolId === 'shorts'
              ? 'Paste your full video transcript here (up to 15 min)…'
              : 'Paste your blog post, podcast notes, video transcript, or any long-form content…'
          }
          className="min-h-[200px] resize-y"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className={isOverLimit ? 'text-destructive' : ''}>
            {wordCount.toLocaleString()} / {LIMITS.maxWords.toLocaleString()} words
          </span>
          {tool && (
            <span className="flex items-center gap-1">
              ⚡ Costs <strong>{CREDIT_COSTS[toolId]}</strong> credit{CREDIT_COSTS[toolId] > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading || !input.trim() || isOverLimit}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Generating…
          </span>
        ) : (
          `Generate ${tool?.name ?? 'Content'}`
        )}
      </Button>
    </form>
  );
}
