import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      journal: "Iraqi Medical Journal for Biomedicine (IMJB)",
      publisher: "Department of Medical Laboratories, Al-Habbobi Teaching Hospital",
      timestamp: new Date().toISOString()
    });
  });

  // AI Medical Research Assistant endpoint
  app.post("/api/ai/analyze-article", async (req, res) => {
    try {
      const { title, abstract, keywords, scope, promptType } = req.body;

      if (!title || !abstract) {
        return res.status(400).json({ error: "Article title and abstract are required" });
      }

      const ai = getGenAIClient();
      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not configured yet
        return res.json({
          laySummary: `This biomedical research article titled "${title}" investigates key clinical laboratory parameters in ${scope || 'biomedical sciences'}. The authors conducted rigorous diagnostic analyses to identify critical molecular biomarkers and clinical resistance patterns to improve patient management in tertiary hospital settings.`,
          clinicalTakeaways: [
            "Demonstrates significant correlation between molecular laboratory markers and clinical progression.",
            "Highlights the necessity for targeted diagnostic screening protocols in hospital infection control.",
            "Provides actionable evidence to optimize therapeutic interventions and antimicrobial stewardship."
          ],
          recommendedKeywords: keywords || ["Biomedical Research", "Clinical Laboratory", "Molecular Diagnostics", "IMJB Journal"],
          suggestedFutureWork: "Further multi-center prospective studies with larger cohort sizes are recommended to validate these findings across broader patient demographics."
        });
      }

      let systemPrompt = "You are an expert medical editor and biomedical scientist for the Iraqi Medical Journal for Biomedicine (IMJB). Analyze the following scientific article abstract and provide high-quality structural synthesis.";
      let userPrompt = `Article Title: ${title}\nScope: ${scope || 'Biomedical Science'}\nKeywords: ${Array.isArray(keywords) ? keywords.join(', ') : keywords}\nAbstract: ${abstract}\n\nTask: Provide a JSON response with:\n1. "laySummary": A 3-sentence clear explanation written for non-specialists and healthcare administrators.\n2. "clinicalTakeaways": An array of 3 bullet points highlighting immediate clinical or diagnostic implications.\n3. "recommendedKeywords": An array of 5 precise MeSH or Medical Subject Headings.\n4. "suggestedFutureWork": A short sentence suggesting future research questions based on these findings. Format strictly as valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "";
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch (e) {
        parsed = {
          laySummary: responseText,
          clinicalTakeaways: ["Key clinical finding extracted from paper."],
          recommendedKeywords: keywords || ["Biomedicine"],
          suggestedFutureWork: "Recommend further multi-center trials."
        };
      }

      return res.json(parsed);
    } catch (err: any) {
      console.error("Gemini AI API Error:", err);
      return res.status(500).json({
        error: "Failed to process AI analysis",
        details: err.message
      });
    }
  });

  // Submissions API endpoints
  let serverSubmissions: any[] = [];

  app.get("/api/submissions", (req, res) => {
    res.json({ success: true, count: serverSubmissions.length, submissions: serverSubmissions });
  });

  app.post("/api/submissions", (req, res) => {
    const submission = req.body;
    const trackingCode = submission.trackingCode || `TRK-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRecord = {
      ...submission,
      trackingCode,
      submissionDate: submission.submissionDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: submission.status || 'Submitted'
    };

    serverSubmissions.unshift(newRecord);

    res.status(201).json({
      success: true,
      trackingCode,
      record: newRecord,
      message: "Manuscript successfully submitted to the Iraqi Medical Journal for Biomedicine editorial queue."
    });
  });

  // Vite middleware for development vs static fallback in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[IMJB Server] Iraqi Medical Journal for Biomedicine platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
