import type { ToolId } from '@/types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const PROMPTS: Record<ToolId, string> = {
  shorts: `Analyze the transcript below. Identify 5-10 highly engaging 60-second segments. For each segment provide: timestamp, hook, caption, hashtags.

Transcript:
{{input}}`,

  thread: `Create a viral Twitter thread (10-20 tweets). Start with a strong hook. Each tweet must deliver value. End with a CTA.

Content:
{{input}}`,

  newsletter: `Write a high-converting email newsletter. Include subject line, 3-5 sections, and clear CTAs.

Content:
{{input}}`,

  blog: `Write an SEO optimized blog (1200-1500 words). Include headings, meta description, keywords, and FAQs.

Content:
{{input}}`,

  carousel: `Create a LinkedIn carousel. 5-10 slides. Each slide should have a title and concise content.

Content:
{{input}}`,

  calendar: `Generate a 30-day social media calendar. Include platform, tone, caption idea, and hashtags.

Content:
{{input}}`,
};

export async function callDeepSeek(tool: ToolId, input: string): Promise<string> {
  const prompt = PROMPTS[tool].replace('{{input}}', input);

  const response = await fetch(DEEPSEEK_API_URL, {
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
    const err = await response.text();
    throw new Error(`DeepSeek API error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}
