import { v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';
import { api } from './_generated/api';

export const enqueueJob = mutation({
  args: {
    userId: v.id('users'),
    tool: v.string(),
    input: v.string(),
  },
  handler: async (ctx, { userId, tool, input }) => {
    const jobId = await ctx.db.insert('jobs', {
      userId,
      tool,
      status: 'queued',
      input,
      retries: 0,
    });

    await ctx.db.insert('analytics', {
      userId,
      event: `job_queued_${tool}`,
      timestamp: Date.now(),
    });

    await ctx.scheduler.runAfter(0, api.jobActions.processJob, { jobId });
    return jobId;
  },
});

export const getJobStatus = query({
  args: { jobId: v.id('jobs') },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.db.get(jobId);
    if (!job) return null;

    let outputContent: string | null = null;
    if (job.outputId) {
      const output = await ctx.db.get(job.outputId);
      outputContent = output?.content ?? null;
    }

    return { ...job, outputContent };
  },
});

export const getUserJobs = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query('jobs')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .take(20);
  },
});

export const updateJobStatus = internalMutation({
  args: {
    jobId: v.id('jobs'),
    status: v.string(),
    steps: v.optional(v.array(v.string())),
    currentStep: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, { jobId, status, steps, currentStep, errorMessage }) => {
    const updates: Record<string, unknown> = { status };
    if (steps !== undefined) updates.steps = steps;
    if (currentStep !== undefined) updates.currentStep = currentStep;
    if (errorMessage !== undefined) updates.errorMessage = errorMessage;
    await ctx.db.patch(jobId, updates);
  },
});

export const completeJob = internalMutation({
  args: { jobId: v.id('jobs'), outputId: v.id('outputs') },
  handler: async (ctx, { jobId, outputId }) => {
    await ctx.db.patch(jobId, { status: 'completed', outputId });
  },
});

export const retryJob = internalMutation({
  args: { jobId: v.id('jobs'), retries: v.number() },
  handler: async (ctx, { jobId, retries }) => {
    await ctx.db.patch(jobId, { status: 'queued', retries });
  },
});
