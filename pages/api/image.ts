import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { readFileSync } from "node:fs";
import path from 'path';

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";
const openai = new OpenAI({ baseURL: endpoint, apiKey: token });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
          { role: "system", content: "You are a helpful assistant that describes images in details." },
          { role: "user", content: [
              { type: "text", text: "What's in this image?"},
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              { type: "image_url", image_url: {url: getImageDataUrl("sample.jpg", "jpg"), details: "low"}}
            ]
          }
        ],
        model: modelName
      });

    res.status(200).json({ message: completion.choices[0].message });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}

function getImageDataUrl(imageFile: string, imageFormat: string) {
  try {
    const imagePath = path.join(process.cwd(), 'public', 'images', imageFile);
    const imageBuffer = readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');
    return `data:image/${imageFormat};base64,${imageBase64}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Could not read '${imageFile}'.`);
    console.error(error.message);
    process.exit(1);
  }
}