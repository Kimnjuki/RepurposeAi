'use node';

import { v } from 'convex/values';
import { action } from './_generated/server';
import { api, internal } from './_generated/api';
import { CREDIT_COSTS } from './constants';
import { parseOutput } from './lib/parsers';

const PROMPTS: Record<string, string> = {
  shorts: `Analyze the transcript below and identify exactly 5-10 highly engaging 60-second segments.

Format EACH segment exactly like this:
**Clip [number]**
Hook: [attention-grabbing first sentence]
Timestamp: [start:end]
Caption: [full caption for the short]
Hashtags: #tag1 #tag2 #tag3

Transcript:
{{input}}`,

  thread: `Create a viral Twitter/X thread with exactly 10-20 tweets. Number each tweet.

Format:
1. [First tweet - strong hook]
2. [Second tweet]
...
[Last tweet - CTA]

Rules: Each tweet must be under 280 characters. Deliver one insight per tweet.

Content:
{{input}}`,

  newsletter: `Write a high-converting email newsletter. Use this exact structure:

Subject: [compelling subject line]
Preview Text: [preview text under 90 chars]

## [Section 1 Heading]
[Section 1 body - 2-3 paragraphs]
CTA: [call to action]

## [Section 2 Heading]
[Section 2 body]

## [Section 3 Heading]
[Section 3 body]
CTA: [final call to action]

Content:
{{input}}`,

  blog: `Write an SEO-optimized blog post (1200-1500 words). Use this exact structure:

# [Title]
Meta Description: [150-160 char meta description]
Keywords: [keyword1, keyword2, keyword3, keyword4, keyword5]

[Full blog content with ## subheadings, bullet points, and bold key phrases]

## FAQ
**[Question 1]**
[Answer 1]

**[Question 2]**
[Answer 2]

Content:
{{input}}`,

  carousel: `Create a LinkedIn carousel with exactly 5-10 slides. Use this exact format:

# [Carousel Title]

## Slide 1: [Slide Heading]
[Slide content - 2-3 concise bullet points]
Image Prompt: [visual description]

## Slide 2: [Slide Heading]
[Slide content]
Image Prompt: [visual description]

(continue for all slides)

Content:
{{input}}`,

  calendar: `Generate a 30-day social media content calendar. Format EACH day exactly like this:

Day 1
Platform: [Instagram/Twitter/LinkedIn/TikTok]
Tone: [Inspiring/Educational/Entertaining/Promotional]
Caption: [full post caption]
Hashtags: #tag1 #tag2 #tag3

Day 2
...

Content:
{{input}}`,
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

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`DeepSeek error ${response.status}: ${errBody}`);
  }
  const data = await response.json();
  return data.choices[0].message.content as string;
}

const JOB_STEPS: Record<string, string[]> = {
  shorts: ['Analyzing transcript', 'Finding viral moments', 'Writing hooks & captions'],
  thread: ['Extracting key insights', 'Crafting tweets', 'Adding hooks & CTA'],
  newsletter: ['Structuring content', 'Writing sections', 'Optimizing subject line'],
  blog: ['Researching keywords', 'Writing content', 'Adding FAQs & meta'],
  carousel: ['Building slide structure', 'Writing slide content', 'Adding image prompts'],
  calendar: ['Planning content strategy', 'Writing 30 days of posts', 'Adding hashtags'],
};

export const processJob = action({
  args: { jobId: v.id('jobs') },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.runQuery(api.jobs.getJobStatus, { jobId });
    if (!job || job.status !== 'queued') return;

    await ctx.runMutation(internal.jobs.updateJobStatus, {
      jobId,
      status: 'processing',
      steps: JOB_STEPS[job.tool] ?? ['Generating content'],
      currentStep: 0,
    });

    const creditCost = CREDIT_COSTS[job.tool] ?? 1;
    const deducted = await ctx.runMutation(api.users.deductCredits, {
      userId: job.userId,
      amount: creditCost,
    });

    if (!deducted.success) {
      await ctx.runMutation(internal.jobs.updateJobStatus, {
        jobId,
        status: 'failed',
        errorMessage: 'Insufficient credits.',
      });
      return;
    }

    try {
      await ctx.runMutation(internal.jobs.updateJobStatus, {
        jobId,
        status: 'processing',
        currentStep: 1,
      });

      const raw = await callDeepSeek(job.tool, job.input);

      await ctx.runMutation(internal.jobs.updateJobStatus, {
        jobId,
        status: 'processing',
        currentStep: 2,
      });

      const structured = parseOutput(job.tool, raw);

      const content = JSON.stringify({ raw, structured });

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
    } catch (err) {
      const retries = (job.retries ?? 0) + 1;
      const errorMessage =
        err instanceof Error && err.message.includes('429')
          ? 'AI service is at capacity. Retrying shortly…'
          : err instanceof Error && err.message.includes('5000')
          ? 'Input exceeds the 5000 word limit.'
          : 'Generation failed. Please try again.';

      if (retries < 3) {
        await ctx.runMutation(internal.jobs.retryJob, { jobId, retries });
        await ctx.scheduler.runAfter(5000, api.jobActions.processJob, { jobId });
      } else {
        await ctx.runMutation(internal.jobs.updateJobStatus, {
          jobId,
          status: 'failed',
          errorMessage,
        });
        await ctx.runMutation(api.users.addCredits, {
          userId: job.userId,
          amount: creditCost,
        });
      }
    }
  },
});
