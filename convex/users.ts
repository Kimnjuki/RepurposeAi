import { v } from 'convex/values';
import { internalMutation, internalQuery, mutation, query } from './_generated/server';

export const getUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return ctx.db.get(userId);
  },
});

export const getUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();
  },
});

export const createUser = internalMutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    plan: v.string(),
    credits: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert('users', {
      ...args,
      createdAt: Date.now(),
    });
    await ctx.db.insert('analytics', {
      userId,
      event: 'user_registered',
      timestamp: Date.now(),
    });
    return userId;
  },
});

export const logAnalytics = internalMutation({
  args: { userId: v.id('users'), event: v.string() },
  handler: async (ctx, { userId, event }) => {
    await ctx.db.insert('analytics', { userId, event, timestamp: Date.now() });
  },
});

export const deductCredits = mutation({
  args: { userId: v.id('users'), amount: v.number() },
  handler: async (ctx, { userId, amount }) => {
    const user = await ctx.db.get(userId);
    if (!user || user.credits < amount) {
      return { success: false, error: 'Insufficient credits' };
    }
    await ctx.db.patch(userId, { credits: user.credits - amount });
    return { success: true, error: null };
  },
});

export const addCredits = mutation({
  args: { userId: v.id('users'), amount: v.number(), plan: v.optional(v.string()) },
  handler: async (ctx, { userId, amount, plan }) => {
    const user = await ctx.db.get(userId);
    if (!user) return;
    const updates: { credits: number; plan?: string } = { credits: user.credits + amount };
    if (plan) updates.plan = plan;
    await ctx.db.patch(userId, updates);
  },
});

export const updatePlan = mutation({
  args: { userId: v.id('users'), plan: v.string(), credits: v.number() },
  handler: async (ctx, { userId, plan, credits }) => {
    await ctx.db.patch(userId, { plan, credits });
  },
});
