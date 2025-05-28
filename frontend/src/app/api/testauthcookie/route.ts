import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch((process.env.BACKEND_URL as string) + "/authcookie", {
      method: 'GET',
      credentials: 'include', // This tells fetch to include credentials
      headers: {
        'Content-Type': 'application/json',
        // You can forward cookies manually if needed:
        Cookie: req.headers.cookie || '',
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
}

