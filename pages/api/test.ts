import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    res.status(200).json({ message: "Hello from Next.js API!" });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
