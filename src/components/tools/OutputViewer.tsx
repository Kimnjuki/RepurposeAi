'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OutputViewerProps {
  content: string;
  toolName: string;
}

export function OutputViewer({ content, toolName }: OutputViewerProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${toolName.toLowerCase().replace(/\s+/g, '-')}-output.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Generated Output</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? '✓ Copied!' : '📋 Copy'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            ⬇ Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap text-sm font-mono leading-relaxed max-h-[600px] overflow-y-auto">
          {content}
        </div>
      </CardContent>
    </Card>
  );
}
