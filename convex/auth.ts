'use node';

import { v } from 'convex/values';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import bcrypt from 'bcryptjs';

type AuthResult = { success: boolean; userId: string; error: string | null };

export const register = action({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }): Promise<AuthResult> => {
    const existing = await ctx.runQuery(internal.users.getUserByEmail, { email });
    if (existing) {
      return { success: false, error: 'Email already registered', userId: '' };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const userId: string = await ctx.runMutation(internal.users.createUser, {
      email,
      passwordHash,
      plan: 'free',
      credits: 10,
    });

    return { success: true, userId, error: null };
  },
});

export const login = action({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }): Promise<AuthResult> => {
    const user = await ctx.runQuery(internal.users.getUserByEmail, { email });
    if (!user) {
      return { success: false, error: 'Invalid email or password', userId: '' };
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return { success: false, error: 'Invalid email or password', userId: '' };
    }

    await ctx.runMutation(internal.users.logAnalytics, {
      userId: user._id,
      event: 'user_login',
    });

    return { success: true, userId: user._id as string, error: null };
  },
});
