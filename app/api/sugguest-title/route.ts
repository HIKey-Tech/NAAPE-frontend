import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { text } = await req.json();

  const prompt = `
  Generate 5 short, catchy, SEO-friendly titles based on the following content:

  "${text}"
  `;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const result = completion.choices[0]?.message?.content || "";

  // Parse the result - split by newlines and filter out empty strings
  const titles = result
    .split("\n")
    .map((title) => title.trim())
    .filter((title) => title.length > 0)
    .slice(0, 5); // Ensure we only return up to 5 titles

  return new Response(JSON.stringify({ titles }));
}
