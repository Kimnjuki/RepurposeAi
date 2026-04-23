import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createProject = mutation({
  args: {
    userId: v.id('users'),
    inputType: v.string(),
    inputContent: v.string(),
  },
  handler: async (ctx, { userId, inputType, inputContent }) => {
    return ctx.db.insert('projects', {
      userId,
      inputType,
      inputContent,
      createdAt: Date.now(),
    });
  },
});

export const getUserProjects = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query('projects')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .take(50);
  },
});
