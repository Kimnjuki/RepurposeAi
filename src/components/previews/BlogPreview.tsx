'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { ParsedBlog } from '../../../convex/lib/parsers';

interface BlogPreviewProps {
  data: ParsedBlog;
  onCopyAll: () => void;
}

export function BlogPreview({ data, onCopyAll }: BlogPreviewProps) {
  function downloadMarkdown() {
    const blob = new Blob([data.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadHTML() {
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>${data.title}</title>
  <meta name="description" content="${data.metaDescription}">
</head>
<body>
  <h1>${data.title}</h1>
  ${data.content.replace(/\n/g, '<br>')}
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">📝 Blog Post</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadMarkdown}>⬇ Markdown</Button>
          <Button variant="outline" size="sm" onClick={downloadHTML}>⬇ HTML</Button>
          <Button variant="outline" size="sm" onClick={onCopyAll}>📋 Copy</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SEO Sidebar */}
        <div className="space-y-3">
          <Card className="rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">SEO Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Title</p>
                <p className="text-sm font-medium">{data.title}</p>
              </div>
              {data.metaDescription && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Meta Description</p>
                  <p className="text-xs text-muted-foreground">{data.metaDescription}</p>
                  <span className={`text-xs ${data.metaDescription.length > 160 ? 'text-destructive' : 'text-green-500'}`}>
                    {data.metaDescription.length}/160
                  </span>
                </div>
              )}
              {data.keywords.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-1">
                    {data.keywords.map((k) => (
                      <Badge key={k} variant="outline" className="text-xs">{k}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {data.faqs.length > 0 && (
            <Card className="rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">FAQs ({data.faqs.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.faqs.map((faq, i) => (
                  <div key={i}>
                    <p className="text-xs font-medium">{faq.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">{faq.answer}</p>
                    {i < data.faqs.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Blog Content */}
        <div className="lg:col-span-2">
          <Card className="rounded-xl">
            <CardContent className="pt-4">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-muted/30 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                  {data.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
