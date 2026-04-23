import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    plan: v.string(),
    credits: v.number(),
    createdAt: v.number(),
  }).index('by_email', ['email']),

  projects: defineTable({
    userId: v.id('users'),
    inputType: v.string(),
    inputContent: v.string(),
    createdAt: v.number(),
  }).index('by_user', ['userId']),

  outputs: defineTable({
    userId: v.id('users'),
    projectId: v.id('projects'),
    tool: v.string(),
    content: v.string(),
    status: v.string(),
    createdAt: v.number(),
  }).index('by_user', ['userId']),

  jobs: defineTable({
    userId: v.id('users'),
    tool: v.string(),
    status: v.string(),
    input: v.string(),
    outputId: v.optional(v.id('outputs')),
    retries: v.number(),
  }).index('by_user', ['userId']).index('by_status', ['status']),

  subscriptions: defineTable({
    userId: v.id('users'),
    plan: v.string(),
    stripeCustomerId: v.string(),
    status: v.string(),
  }).index('by_user', ['userId']).index('by_stripe_customer', ['stripeCustomerId']),

  analytics: defineTable({
    userId: v.id('users'),
    event: v.string(),
    timestamp: v.number(),
  }).index('by_user', ['userId']),

  referrals: defineTable({
    referrerId: v.id('users'),
    referredId: v.id('users'),
    rewardGiven: v.boolean(),
  }),
});
