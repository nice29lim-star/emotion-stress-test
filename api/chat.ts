import type { Request, Response } from 'express';
import { handleChatLogic } from '../src/server/geminiService.js';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, assessmentData } = req.body || {};

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  try {
    const reply = await handleChatLogic(messages, assessmentData);
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Error in Vercel Chat Handler:', error);
    return res.status(200).json({
      reply: '따뜻한 마음으로 당신의 이야기를 듣고 있어요. 마음이 한결 가벼워질 때까지 편하게 말씀해 주세요.',
    });
  }
}
