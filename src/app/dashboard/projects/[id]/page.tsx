'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { OutputViewer } from '@/components/tools/OutputViewer';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { ToolId } from '@/types';

const TOOL_ICONS: Record<string, string> = {
  shorts: '🎬', thread: '🐦', newsletter: '📧', blog: '📝', carousel: '🎠', calendar: '📅',
};

const TOOL_NAMES: Record<string, string> = {
  shorts: 'Shorts Generator', thread: 'Twitter Thread', newsletter: 'Newsletter',
  blog: 'Blog Post', carousel: 'LinkedIn Carousel', calendar: 'Content Calendar',
};

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as Id<'projects'>;
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const project = useQuery(api.projects.getProject, { projectId });
  const outputs = useQuery(api.outputs.getOutputsByProject, { projectId });

  useEffect(() => {
    if (outputs && outputs.length > 0 && !activeTab) {
      setActiveTab(outputs[0].tool);
    }
  }, [outputs, activeTab]);

  if (!project || !outputs) {
    return <div className="text-muted-foreground animate-pulse">Loading project…</div>;
  }

  const activeOutput = outputs.find((o) => o.tool === activeTab);

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <Link href="/dashboard/projects" className="text-sm text-muted-foreground hover:text-foreground">
          ← All Projects
        </Link>
        <h1 className="text-2xl font-bold mt-2">Project</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Created {new Date(project.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Input preview */}
      <div className="bg-muted/40 rounded-lg p-4 mb-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Original Input</p>
        <p className="line-clamp-3">{project.inputContent}</p>
      </div>

      {outputs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No outputs generated for this project yet.</p>
        </div>
      ) : (
        <>
          {/* Tool tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {outputs.map((output) => (
              <button
                key={output.tool}
                onClick={() => setActiveTab(output.tool)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === output.tool
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                {TOOL_ICONS[output.tool]} {TOOL_NAMES[output.tool] ?? output.tool}
                <Badge variant={activeTab === output.tool ? 'secondary' : 'outline'} className="text-xs">
                  {output.status}
                </Badge>
              </button>
            ))}
          </div>

          {/* Active output */}
          {activeOutput && (
            <OutputViewer
              rawContent={activeOutput.content}
              toolId={activeOutput.tool as ToolId}
              toolName={TOOL_NAMES[activeOutput.tool] ?? activeOutput.tool}
            />
          )}
        </>
      )}
    </div>
  );
}
