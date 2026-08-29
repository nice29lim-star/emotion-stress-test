import { handleAnalyzeLogic, getFallbackReport } from '../src/server/geminiService.js';

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

  const assessmentData = req.body;

  if (!assessmentData) {
    return res.status(400).json({ error: 'Assessment data is required.' });
  }

  try {
    const report = await handleAnalyzeLogic(assessmentData);
    return res.status(200).json(report);
  } catch (error: any) {
    console.error('Error generating analysis report on Vercel:', error);
    const fallback = getFallbackReport(assessmentData);
    return res.status(200).json(fallback);
  }
}
