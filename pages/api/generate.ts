// // pages/api/generate.ts
// import { Configuration, OpenAI } from 'openai';
// import { NextApiRequest, NextApiResponse } from 'next';

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAI(configuration);

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const { text1, text2 } = req.body;

//     const prompt = `Generate a single word that connects these two concepts: ${text1} and ${text2}`;

//     const completion = await openai.chat.completions.create({
//       model: "text-davinci-003",
//       prompt,
//       max_tokens: 10,
//       temperature: 0.7,
//     });

//     const generatedText = completion.data.choices[0]?.text?.trim() || 'Error';

//     return res.status(200).json({ text: generatedText });
//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }

import OpenAI from "openai";
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "Write a haiku about recursion in programming.",
        },
    ],
    store: true,
});

console.log(completion.choices[0].message);