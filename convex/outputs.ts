import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createOutput = mutation({
  args: {
    userId: v.id('users'),
    projectId: v.id('projects'),
    tool: v.string(),
    content: v.string(),
    status: v.string(),
  },
  handler: async (ctx, { userId, projectId, tool, content, status }) => {
    return ctx.db.insert('outputs', {
      userId,
      projectId,
      tool,
      content,
      status,
      createdAt: Date.now(),
    });
  },
});

export const getUserOutputs = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query('outputs')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .take(50);
  },
});

export const getOutputsByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    return ctx.db
      .query('outputs')
      .filter((q) => q.eq(q.field('projectId'), projectId))
      .collect();
  },
});
