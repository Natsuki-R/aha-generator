import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";
const openai = new OpenAI({ baseURL: endpoint, apiKey: token });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const text1 = 'white coal', text2 = 'outline';
    const prompt = `Create a poetic line that beautifully incorporates the words: "${text1}" and "${text2}". Capture their essence in a vivid and emotional way.`;

    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: prompt,
        },
      ],
      store: true,
    });

    res.status(200).json({ message: completion.choices[0].message });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      details: error.message 
    });
  }
}
