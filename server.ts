import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Server-side AI Academic Diagnostics Endpoint
app.post('/api/diagnostics', async (req, res) => {
  try {
    const { studentName, cohortSummary, studentData } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: 'No GEMINI_API_KEY configured in environment.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert academic advisor and educational data scientist.
Analyze the following student academic performance metrics:
Student: ${studentName || 'Student'}
Metrics:
${JSON.stringify(studentData || cohortSummary, null, 2)}

Provide a structured pedagogical evaluation with targeted interventions. Return valid JSON only with keys:
- "executiveSummary": string (2-3 concise, high-impact analytical sentences)
- "primaryStrength": string (key cognitive or subject strength)
- "criticalRiskFactor": string (primary warning sign or bottleneck)
- "recommendedInterventions": array of 3 specific, measurable intervention steps (each with "title", "action", "priority": "High" | "Medium")
- "projectedTrajectory": string (evidence-based prognosis if interventions succeed)`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    let analysis;
    try {
      analysis = JSON.parse(rawText);
    } catch {
      analysis = {
        executiveSummary: rawText,
        primaryStrength: 'Analytical tenacity',
        criticalRiskFactor: 'Assessment variance',
        recommendedInterventions: [
          { title: 'Targeted Review', action: 'Focused remediation sessions on core prerequisites', priority: 'High' }
        ],
        projectedTrajectory: 'Measurable mastery rebound upon remediation completion.'
      };
    }

    return res.json({ success: true, analysis });
  } catch (err: any) {
    console.error('API /api/diagnostics error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to generate academic diagnostic'
    });
  }
});

// Vite middleware mounting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScholarPulse server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
