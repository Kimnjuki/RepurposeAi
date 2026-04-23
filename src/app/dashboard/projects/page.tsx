'use client';

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Id } from '../../../../convex/_generated/dataModel';

const TOOL_ICONS: Record<string, string> = {
  shorts: '🎬', thread: '🐦', newsletter: '📧', blog: '📝', carousel: '🎠', calendar: '📅',
};

export default function ProjectsPage() {
  const [userId, setUserId] = useState<Id<'users'> | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) setUserId(id as Id<'users'>);
    else window.location.href = '/login';
  }, []);

  const projects = useQuery(api.projects.getUserProjects, userId ? { userId } : 'skip');
  const outputs = useQuery(api.outputs.getUserOutputs, userId ? { userId } : 'skip');

  if (!projects) {
    return <div className="text-muted-foreground animate-pulse">Loading projects…</div>;
  }

  const outputsByProject = (outputs ?? []).reduce<Record<string, string[]>>((acc, o) => {
    const pid = o.projectId as string;
    acc[pid] = [...(acc[pid] ?? []), o.tool];
    return acc;
  }, {});

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">All your generated content in one place</p>
        </div>
        <Badge variant="secondary">{projects.length} projects</Badge>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-5xl mb-4">📂</div>
          <p className="font-medium">No projects yet</p>
          <p className="text-sm mt-2">Generate content from any tool to create your first project.</p>
          <Link href="/dashboard" className="text-primary text-sm hover:underline mt-3 inline-block">
            Go to Dashboard →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const tools = outputsByProject[project._id] ?? [];
            const preview = project.inputContent.slice(0, 120);
            return (
              <Link key={project._id} href={`/dashboard/projects/${project._id}`}>
                <Card className="rounded-xl hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium line-clamp-1">{preview}…</CardTitle>
                      <span className="text-xs text-muted-foreground shrink-0 ml-4">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 flex-wrap">
                      {tools.length > 0 ? (
                        tools.map((tool) => (
                          <Badge key={tool} variant="secondary" className="text-xs">
                            {TOOL_ICONS[tool] ?? '🔧'} {tool}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No outputs yet</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
