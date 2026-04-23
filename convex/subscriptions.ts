import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createSubscription = mutation({
  args: {
    userId: v.id('users'),
    plan: v.string(),
    stripeCustomerId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        plan: args.plan,
        stripeCustomerId: args.stripeCustomerId,
        status: args.status,
      });
      return existing._id;
    }

    return ctx.db.insert('subscriptions', args);
  },
});

export const getSubscriptionByCustomer = query({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, { stripeCustomerId }) => {
    return ctx.db
      .query('subscriptions')
      .withIndex('by_stripe_customer', (q) => q.eq('stripeCustomerId', stripeCustomerId))
      .first();
  },
});

export const updateSubscriptionStatus = mutation({
  args: { stripeCustomerId: v.string(), status: v.string(), plan: v.optional(v.string()) },
  handler: async (ctx, { stripeCustomerId, status, plan }) => {
    const sub = await ctx.db
      .query('subscriptions')
      .withIndex('by_stripe_customer', (q) => q.eq('stripeCustomerId', stripeCustomerId))
      .first();

    if (!sub) return;
    const updates: { status: string; plan?: string } = { status };
    if (plan) updates.plan = plan;
    await ctx.db.patch(sub._id, updates);
  },
});
