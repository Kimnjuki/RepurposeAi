'use node';

import { v } from 'convex/values';
import { action } from './_generated/server';
import { api, internal } from './_generated/api';
import { CREDIT_COSTS } from './constants';

const PROMPTS: Record<string, string> = {
  shorts: `Analyze the transcript below. Identify 5-10 highly engaging 60-second segments. For each segment provide: timestamp, hook, caption, hashtags.\n\nTranscript:\n{{input}}`,
  thread: `Create a viral Twitter thread (10-20 tweets). Start with a strong hook. Each tweet must deliver value. End with a CTA.\n\nContent:\n{{input}}`,
  newsletter: `Write a high-converting email newsletter. Include subject line, 3-5 sections, and clear CTAs.\n\nContent:\n{{input}}`,
  blog: `Write an SEO optimized blog (1200-1500 words). Include headings, meta description, keywords, and FAQs.\n\nContent:\n{{input}}`,
  carousel: `Create a LinkedIn carousel. 5-10 slides. Each slide should have a title and concise content.\n\nContent:\n{{input}}`,
  calendar: `Generate a 30-day social media calendar. Include platform, tone, caption idea, and hashtags.\n\nContent:\n{{input}}`,
};

async function callDeepSeek(tool: string, input: string): Promise<string> {
  const prompt = (PROMPTS[tool] ?? PROMPTS.thread).replace('{{input}}', input);

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) throw new Error(`DeepSeek error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content as string;
}

export const processJob = action({
  args: { jobId: v.id('jobs') },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.runQuery(api.jobs.getJobStatus, { jobId });
    if (!job || job.status !== 'queued') return;

    await ctx.runMutation(internal.jobs.updateJobStatus, { jobId, status: 'processing' });

    const creditCost = CREDIT_COSTS[job.tool] ?? 1;
    const deducted = await ctx.runMutation(api.users.deductCredits, {
      userId: job.userId,
      amount: creditCost,
    });

    if (!deducted.success) {
      await ctx.runMutation(internal.jobs.updateJobStatus, { jobId, status: 'failed' });
      return;
    }

    try {
      const content = await callDeepSeek(job.tool, job.input);

      const projectId = await ctx.runMutation(api.projects.createProject, {
        userId: job.userId,
        inputType: 'text',
        inputContent: job.input,
      });

      const outputId = await ctx.runMutation(api.outputs.createOutput, {
        userId: job.userId,
        projectId,
        tool: job.tool,
        content,
        status: 'completed',
      });

      await ctx.runMutation(internal.jobs.completeJob, { jobId, outputId });
    } catch {
      const retries = (job.retries ?? 0) + 1;
      if (retries < 3) {
        await ctx.runMutation(internal.jobs.retryJob, { jobId, retries });
        await ctx.scheduler.runAfter(5000, api.jobActions.processJob, { jobId });
      } else {
        await ctx.runMutation(internal.jobs.updateJobStatus, { jobId, status: 'failed' });
        await ctx.runMutation(api.users.addCredits, {
          userId: job.userId,
          amount: creditCost,
        });
      }
    }
  },
});
