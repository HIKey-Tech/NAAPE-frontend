import OpenAI from "openai";

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Title suggestions are not configured." }), { status: 503 });
  }
  const client = new OpenAI({ apiKey });

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
