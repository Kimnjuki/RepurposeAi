'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { ParsedNewsletter } from '../../../convex/lib/parsers';

interface NewsletterPreviewProps {
  data: ParsedNewsletter;
  onCopyAll: () => void;
}

export function NewsletterPreview({ data, onCopyAll }: NewsletterPreviewProps) {
  function downloadHTML() {
    const sectionsHTML = data.sections
      .map(
        (s) => `
      <h2 style="color:#1a1a1a;margin-top:32px">${s.heading}</h2>
      <p style="color:#4a4a4a;line-height:1.7">${s.body}</p>
      ${s.cta ? `<a href="#" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:12px">${s.cta}</a>` : ''}`
      )
      .join('');

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${data.subject}</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <p style="color:#888;font-size:12px">${data.previewText}</p>
  <h1 style="color:#1a1a1a">${data.subject}</h1>
  ${sectionsHTML}
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  function copySubject() {
    navigator.clipboard.writeText(data.subject);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">📧 Newsletter</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadHTML}>⬇ HTML</Button>
          <Button variant="outline" size="sm" onClick={onCopyAll}>📋 Copy</Button>
        </div>
      </div>

      {/* Email Header */}
      <Card className="rounded-xl mb-4 border-primary/30">
        <CardContent className="pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium">SUBJECT LINE</span>
              <p className="font-semibold text-base mt-0.5">{data.subject}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={copySubject}>📋</Button>
          </div>
          {data.previewText && (
            <>
              <Separator />
              <div>
                <span className="text-xs text-muted-foreground font-medium">PREVIEW TEXT</span>
                <p className="text-sm text-muted-foreground mt-0.5">{data.previewText}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-3">
        {data.sections.map((section, i) => (
          <Card key={i} className="rounded-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Section {i + 1}</Badge>
                <CardTitle className="text-sm">{section.heading}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
              {section.cta && (
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-medium">
                  → {section.cta}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
