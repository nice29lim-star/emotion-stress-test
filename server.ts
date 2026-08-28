import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleChatLogic, handleAnalyzeLogic } from './src/server/geminiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = 3000;

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Coach Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const { messages, assessmentData } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  try {
    const reply = await handleChatLogic(messages, assessmentData);
    return res.json({ reply });
  } catch (error) {
    console.error('Error in AI Coach Chat:', error);
    return res.json({
      reply: '따뜻한 마음으로 당신의 이야기를 듣고 있어요. 마음이 한결 가벼워질 때까지 편하게 말씀해 주세요.',
    });
  }
});

// AI Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
  const assessmentData = req.body;

  if (!assessmentData) {
    return res.status(400).json({ error: 'Assessment data is required.' });
  }

  try {
    const report = await handleAnalyzeLogic(assessmentData);
    return res.json(report);
  } catch (error: any) {
    console.error('Error generating analysis report with Gemini:', error);
    const { getFallbackReport } = await import('./src/server/geminiService.js');
    const fallback = getFallbackReport(assessmentData);
    return res.json(fallback);
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MindTracker server listening on http://0.0.0.0:${PORT}`);
  });
}

// Only start the server if run directly
if (process.env.NODE_ENV !== 'test') {
  start();
}

