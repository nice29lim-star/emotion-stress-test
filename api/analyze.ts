import { handleAnalyzeLogic, getFallbackReport } from '../src/server/geminiService.js';

export default async function handler(req: any, res: any) {
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
    console.error('Error in Vercel AI Analyze function:', error);
    const fallback = getFallbackReport(assessmentData);
    return res.status(200).json(fallback);
  }
}
