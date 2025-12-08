import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { text } = await req.json();

  const prompt = `
  Generate 5 short, catchy, SEO-friendly titles based on the following content:

  "${text}"
  `;

  const completion = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  const result = completion.output_text;

  return new Response(JSON.stringify({ titles: result.split("\n") }));
}
