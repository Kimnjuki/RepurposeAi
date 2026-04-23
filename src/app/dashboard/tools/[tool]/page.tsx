'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { GenerationForm } from '@/components/tools/GenerationForm';
import { OutputViewer } from '@/components/tools/OutputViewer';
import { PaywallModal } from '@/components/tools/PaywallModal';
import { Badge } from '@/components/ui/badge';
import { TOOLS, CREDIT_COSTS } from '@/lib/constants';
import type { ToolId } from '@/types';
import type { Id } from '../../../../../convex/_generated/dataModel';

export default function ToolPage() {
  const params = useParams();
  const toolId = params.tool as ToolId;
  const tool = TOOLS.find((t) => t.id === toolId);

  const [userId, setUserId] = useState<Id<'users'> | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<Id<'jobs'> | null>(null);
  const [paywallReason, setPaywallReason] = useState<'credits' | 'plan' | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) setUserId(id as Id<'users'>);
    else window.location.href = '/login';
  }, []);

  const user = useQuery(api.users.getUser, userId ? { userId } : 'skip');
  const jobStatus = useQuery(api.jobs.getJobStatus, jobId ? { jobId } : 'skip');
  const enqueueJob = useMutation(api.jobs.enqueueJob);

  useEffect(() => {
    if (!jobStatus) return;
    if (jobStatus.status === 'completed' && jobStatus.outputContent) {
      setOutput(jobStatus.outputContent);
      setJobId(null);
      setLoading(false);
    } else if (jobStatus.status === 'failed') {
      setJobId(null);
      setLoading(false);
    }
  }, [jobStatus]);

  if (!tool) return <div className="text-muted-foreground">Tool not found.</div>;

  async function handleGenerate(input: string) {
    if (!user || !userId) return;

    if (tool!.locked && user.plan === 'free') {
      setPaywallReason('plan');
      return;
    }
    if (user.credits < CREDIT_COSTS[toolId]) {
      setPaywallReason('credits');
      return;
    }

    setLoading(true);
    setOutput(null);

    try {
      const id = await enqueueJob({ userId, tool: toolId, input });
      setJobId(id);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{tool.icon}</span>
            <h1 className="text-3xl font-bold">{tool.name}</h1>
          </div>
          <p className="text-muted-foreground">{tool.description}</p>
        </div>
        <Badge variant="outline" className="shrink-0 mt-2">
          ⚡ {tool.credits} credit{tool.credits > 1 ? 's' : ''}
        </Badge>
      </div>

      <GenerationForm toolId={toolId} onSubmit={handleGenerate} loading={loading} />

      {loading && !output && (
        <div className="mt-6 flex flex-col items-center justify-center py-12 text-muted-foreground">
          <div className="text-4xl animate-spin mb-4">⏳</div>
          <p className="font-medium">Generating your content…</p>
          <p className="text-sm mt-1">This usually takes 15-60 seconds</p>
        </div>
      )}

      {output && <OutputViewer content={output} toolName={tool.name} />}

      <PaywallModal
        open={paywallReason !== null}
        onClose={() => setPaywallReason(null)}
        toolName={tool.name}
        reason={paywallReason ?? 'plan'}
      />
    </div>
  );
}
