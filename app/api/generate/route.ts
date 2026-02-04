import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Zod schema for request validation
const generateSchema = z.object({
  contentType: z.enum(['blog', 'social', 'email', 'product']),
  prompt: z.string().min(1, 'Prompt is required').max(1000),
  tone: z.string().min(1),
  length: z.enum(['short', 'medium', 'long']),
});

// Content generation prompts
const contentPrompts = {
  blog: (prompt: string, tone: string, length: string) => `
    Write a ${length} ${tone} blog post about: ${prompt}
    Make it engaging, informative, and well-structured.
  `,
  social: (prompt: string, tone: string, length: string) => `
    Create ${length} ${tone} social media content about: ${prompt}
    Include hashtags and make it engaging.
  `,
  email: (prompt: string, tone: string, length: string) => `
    Write a ${length} ${tone} email about: ${prompt}
    Include a subject line and professional closing.
  `,
  product: (prompt: string, tone: string, length: string) => `
    Write a ${length} ${tone} product description for: ${prompt}
    Highlight benefits and USPs.
  `,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod Validation
    const validation = generateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { contentType, prompt, tone, length } = validation.data;

    // 2. Check for API Key (Streaming Mock or Real)
    if (!process.env.OPENAI_API_KEY) {
      const mockContent = generateMockContent(contentType, prompt, tone, length);
      return strToStreamResponse(mockContent);
    }

    // 3. Real OpenAI Streaming
    const systemPrompt = contentPrompts[contentType](prompt, tone, length);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an expert content writer.' },
        { role: 'user', content: systemPrompt },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: length === 'long' ? 1000 : length === 'medium' ? 500 : 250,
    });

    // Create a readable stream from the OpenAI response
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

// Helper to convert string to a streaming response (for mock mode)
function strToStreamResponse(str: string) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const words = str.split(' ');
      for (const word of words) {
        controller.enqueue(encoder.encode(word + ' '));
        await new Promise((r) => setTimeout(r, 20)); // Simulate streaming speed
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

function generateMockContent(contentType: string, prompt: string, tone: string, length: string): string {
  const p = prompt.trim();
  const intro = p.charAt(0).toUpperCase() + p.slice(1);
  const isLong = length === 'long';
  const isShort = length === 'short';

  const templates = {
    blog: `# The Comprehensive Guide to ${intro}

In today's rapidly changing landscape, ${p} has emerged as an essential topic for professionals and enthusiasts alike. Whether you're looking to optimize your workflow or simply stay ahead of the curve, understanding the core principles of ${p} is the first step toward significant growth.
${isShort ? '' : `
## Why ${intro} Matters Now

The transition toward more efficient systems has made ${p} a top priority. Industry leaders are increasingly turning to these strategies to solve complex problems, citing improved efficiency and better overall outcomes as primary drivers.

### Key Strategies for Success

1. **Foundational Knowledge**: Before diving deep, ensure you have a solid grasp of the basics.
2. **Consistent Practice**: Like any skill, mastering ${p} requires dedication and regular application.
3. **Continuous Learning**: The field is always evolving, so staying curious is vital.`}

## Future Outlook

As we look ahead, the impact of ${p} is only expected to increase. ${isLong ? `By staying proactive and embracing these changes, you can position yourself at the forefront of innovation. The potential for measurable results is vast, provided one remains committed to the principles outlined here.` : `It represents a significant shift in how we approach our daily challenges.`}

Conclusion: Embracing ${p} isn't just a choice; it's a strategic move for the modern era.`,
    social: `✨ Unleashing the Power of ${intro}! ✨

${tone === 'humorous' ? `I used to think ${p} was a myth, but here we are! 😂` : `We've been seeing a massive shift in how ${p} is being utilized.`}
${isShort ? '' : `
It's not just about the theory; it's about the real-world impact. Whether you're a beginner or a pro, there's always something new to discover about ${p}.

🔥 Key Takeaways:
- Efficiency is key ⚡
- Stay ahead of the trend 📈
- Build for the future 🚀`}

What are your thoughts on ${p}? Let's discuss below! 👇

#${p.replace(/\s+/g, '')} #Innovation #FutureTech #AIContent #GrowthMindset`,
    email: `Subject: Maximizing Your Results with ${intro}

Hi there,

I hope you're having a productive week. I'm reaching out because I've been doing some deep research into ${p} and I believe there are some incredible insights that could directly benefit your current projects.
${isShort ? '' : `
Over the past few months, the data surrounding ${p} has shown a consistent trend toward higher efficiency and better resource management. I've put together a few thoughts on how we might integrate these findings:

- **Phase 1**: Initial audit of existing ${p} workflows.
- **Phase 2**: Implementation of new, optimized protocols.
- **Phase 3**: Measuring results and iterating for perfection.`}
${isLong ? `
I'd love to jump on a brief call next Tuesday to walk you through the specifics. I've prepared a detailed report that highlights the potential ROI and long-term advantages of this approach.` : `
Let me know if you're interested in seeing the full breakdown.`}

Best regards,

[Your Name]
AI Content Strategist`,
    product: `## Introducing the All-New ${intro} Solution

Experience the next generation of performance with our ${p} toolkit. Designed from the ground up for professionals who demand excellence, this solution combines cutting-edge technology with intuitive design.

**Key Features:**
- **Dynamic Performance**: Tailored handles for ${p} scenarios.
- **Intuitive Interface**: Spend less time configuring and more time doing.
- **Robust Integration**: Works seamlessly with your existing stack.
${isShort ? '' : `
### Why Choose Our ${p} Solution?

Unlike traditional methods, our approach to ${p} focuses on the specific needs of modern teams. We've eliminated the friction points that usually slow you down, allowing for a 2x increase in output without sacrificing quality.
${isLong ? `
Our commitment to ${p} excellence is backed by years of research and development. We've spoken to hundreds of industry experts to ensure that every feature we ship solves a real problem. From the initial setup to daily operations, you'll feel the difference of a tool built by experts, for experts.` : ''}`}

Elevate your game today.`,
  };

  const content = templates[contentType as keyof typeof templates] || `High-quality insights regarding ${p}.`;
  return content.trim();
}
