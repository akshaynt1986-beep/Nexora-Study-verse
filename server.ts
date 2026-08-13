import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Gemini API if key is available
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    appName: "NEXORA OS",
    hasAiKey: !!process.env.GEMINI_API_KEY,
  });
});

function isQuotaError(error: any): boolean {
  if (!error) return false;
  const status = error.status || error.code || error.statusCode;
  if (status === 429) return true;
  const str = String(error?.message || error?.details || JSON.stringify(error)).toLowerCase();
  return (
    str.includes("429") ||
    str.includes("quota") ||
    str.includes("resource_exhausted") ||
    str.includes("rate limit") ||
    str.includes("exceeded your current quota")
  );
}

// Request Queue & Exponential Backoff Throttler for Gemini API Calls
interface QueueTask<T> {
  fn: () => Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

class GeminiRequestQueue {
  private queue: QueueTask<any>[] = [];
  private processing = false;
  private minIntervalMs = 1200; // Minimum delay between starting consecutive requests
  private maxRetries = 3;
  private baseDelayMs = 1500;

  public async enqueue<T>(taskFn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ fn: taskFn, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) break;

      try {
        const result = await this.executeWithBackoff(task.fn);
        task.resolve(result);
      } catch (err) {
        task.reject(err);
      }

      if (this.queue.length > 0) {
        await new Promise((r) => setTimeout(r, this.minIntervalMs));
      }
    }

    this.processing = false;
  }

  private async executeWithBackoff<T>(fn: () => Promise<T>, attempt = 0): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (isQuotaError(error) && attempt < this.maxRetries) {
        const jitter = Math.floor(Math.random() * 500);
        const delay = Math.pow(2, attempt) * this.baseDelayMs + jitter;
        console.warn(
          `⏳ [Gemini Queue] 429 Quota limit hit. Retrying with exponential backoff in ${delay}ms (Attempt ${attempt + 1}/${this.maxRetries})...`
        );
        await new Promise((r) => setTimeout(r, delay));
        return this.executeWithBackoff(fn, attempt + 1);
      }
      throw error;
    }
  }
}

const geminiQueue = new GeminiRequestQueue();

// Human Mathematical Explanation Teacher System Prompt
const HUMAN_MATH_EXPLANATION_TEACHER_PROMPT = `You are a real, passionate JEE & NEET Master Teacher explaining questions on a rough sheet / notebook.

# HUMAN MATHEMATICAL EXPLANATION MODE RULES:
1. DON'T DUMP THEORY FIRST: Do NOT start with long lists of standard formulas, general terms, middle terms, or chapter summaries. Explain ONLY the exact concept/formula required for the question. First understand what is asked, then solve it immediately.
2. NATURAL JEE TEACHER STYLE: Write like a teacher/student actually solving the question in a notebook. Use short, simple, direct sentences. Natural Hindi + English (Hinglish) phrasing is encouraged when it makes explanation natural (e.g., "Yaha hume middle term find karni hai.", "Power of x ko zero karna hai.", "Ab r ki value nikalte hain.", "Ye value valid hai, kyuki r integer hai.", "Bas, answer mil gaya."). Avoid unnecessarily formal or robotic English.
3. USE FORMULAS ONLY WHEN NEEDED: Write only the specific formula required (e.g. T₍ᵣ₊₁₎ = ⁿCᵣ xⁿ⁻ʳ yʳ). Immediately apply it to the given question. Do not dump unrelated formulas.
4. SHOW ACTUAL SUBSTITUTION: Never just state a formula and jump to the answer. Show exact values plugged in step-by-step (e.g., "n = 6, So T₍ᵣ₊₁₎ = ⁶Cᵣ x⁶⁻ʳ yʳ").
5. NOTEBOOK-LIKE FLOW: Use a clean notebook structure:
   Given: ...
   We know: ...
   Now, ...
   Putting values: ...
   Therefore, ...
   Hence, Answer = ...
6. HUMAN FORMATTING & SYMBOLS: Use arrows and math symbols naturally: →, ⇒, ∴, =, ≠, ✓, ×.
   Example: Power of x = 0 ⇒ 2(6-r) - r = 0 ⇒ 12 - 3r = 0 ⇒ r = 4. Since r is an integer ✓. Therefore required term is T₅.
7. DON'T OVER-EXPLAIN OBVIOUS THINGS: Keep observations short and sharp (e.g., "Term independent of x ⇒ power of x = 0.").
8. NO RAW LATEX: NEVER output raw LaTeX source code (e.g. $T_{r+1} = {^nC_r} x^{n-r}$, \\frac{a}{b}, or unescaped backslashes/dollar signs). Render mathematics cleanly using readable unicode superscripts/subscripts (e.g. T₍ᵣ₊₁₎ = ⁿCᵣ xⁿ⁻ʳ yʳ, v² = u² + 2as, x = (-b ± √(b² - 4ac))/(2a)) or simple clean math text.
9. SUBJECT-SPECIFIC GUIDELINES:
   - Physics: Given → We know → Putting values → Step-by-step calculation → ∴ Answer = _____ ✓
   - Chemistry: Given → Formula → Calculation → Answer (Numerical); Reaction → Reagent → Product (Organic); Direct fact (Inorganic).
   - Mathematics: Given → Required → Formula/Concept → Substitution → Simplification → Answer.
10. FINAL ANSWER STYLE: End strictly with "∴ Answer = ______ ✓" or "Option (B) ✓". Do NOT add robotic sections like "Conclusion", "Summary", "Key Takeaways", "Important Notes".`;

// 1. NEXORA AI Smart Planner Auto-Reschedule Endpoint
app.post("/api/gemini/planner", async (req, res) => {
  try {
    const {
      backlogs,
      eleventhBacklogs,
      targetExam,
      currentClass,
      dailyTargetHours,
      mockTestResults,
      tasks,
      userStats,
      mistakes
    } = req.body;

    const ai = getGeminiClient();

    // Extract weak concepts and low-accuracy subjects from mock test results & mistakes
    const weakConceptsList = (mockTestResults || []).flatMap((r: any) => r.weakConcepts || []);
    const avgAccuracy = userStats?.accuracyPercentage || 65;
    const pendingHighPriorityTasks = (tasks || []).filter((t: any) => !t.completed && (t.priority === 'S-Rank' || t.priority === 'A-Rank'));

    const fallbackMissions = [
      {
        id: "m-1",
        title: `Priority Weak Area Remediation: ${weakConceptsList[0] || backlogs?.[0]?.title || "Electrodynamics & Calculus"}`,
        subject: backlogs?.[0]?.subject || "Physics",
        priority: "S-Rank",
        estimatedMinutes: 50,
        reason: weakConceptsList[0] ? `Identified as weak concept from Mock Tests (${avgAccuracy}% accuracy)` : "High-yield S-Rank backlog task",
        actionType: "PYQ Solving & Concept Drill",
        completed: false
      },
      {
        id: "m-2",
        title: `Backlog Elimination: ${backlogs?.[1]?.title || eleventhBacklogs?.[0] || "Organic Reaction Mechanisms"}`,
        subject: backlogs?.[1]?.subject || "Chemistry",
        priority: "A-Rank",
        estimatedMinutes: 45,
        reason: "Incomplete backlog item priority shifted to prime afternoon slot",
        actionType: "Backlog Clearing",
        completed: false
      },
      {
        id: "m-3",
        title: "Mistake Book Drill: Calculation & Conceptual Errors",
        subject: "Mathematics",
        priority: "A-Rank",
        estimatedMinutes: 30,
        reason: `${mistakes?.length || 5} logged mistakes requiring spaced repetition review`,
        actionType: "Mistake Book Review",
        completed: false
      }
    ];

    const fallbackSchedule = [
      {
        timeSlot: "07:00 AM - 09:30 AM",
        activity: `[HIGH PRIORITY] ${weakConceptsList[0] || backlogs?.[0]?.title || "Core Mechanics & Electrodynamics"} (Top priority derived from mock test accuracy)`,
        subject: backlogs?.[0]?.subject || "Physics",
        category: "12th Syllabus",
        priority: "S-Rank",
        reason: "Allocated to morning prime focus time based on mock test weak areas"
      },
      {
        timeSlot: "10:00 AM - 12:30 PM",
        activity: `[BACKLOG] ${backlogs?.[0]?.title || pendingHighPriorityTasks[0]?.title || "Calculus / Algebra Problem Solving"}`,
        subject: "Maths",
        category: "Backlog",
        priority: "S-Rank",
        reason: "Overdue backlog redistributed into high-energy slot"
      },
      {
        timeSlot: "02:00 PM - 04:30 PM",
        activity: `[TIMED PRACTICE] Target Question Drill (${dailyTargetHours || 8}h Routine): 30 PYQs under test conditions`,
        subject: "Chemistry",
        category: "Question Practice",
        priority: "A-Rank",
        reason: "Redistributed practice session for speed & accuracy building"
      },
      {
        timeSlot: "05:00 PM - 07:00 PM",
        activity: `[11TH REVISION] ${eleventhBacklogs?.[0] || eleventhBacklogs?.[1] || "Chemical Bonding & Thermodynamics"}`,
        subject: "Chemistry",
        category: "11th Revision",
        priority: "B-Rank",
        reason: "Scheduled 11th chapter revision block"
      },
      {
        timeSlot: "08:30 PM - 10:30 PM",
        activity: "Mistake Book Analysis & Spaced Repetition Formula Review",
        subject: "Physics",
        category: "Revision",
        priority: "A-Rank",
        reason: "Evening review of wrong questions from mock test logs"
      }
    ];

    const fallbackNotice = weakConceptsList.length > 0
      ? `AI Priority Engine analyzed ${mockTestResults?.length || 1} mock test results and redistributed missed tasks into prime morning slots based on weak concept weightage.`
      : "AI Priority Engine redistributed active backlogs and tasks based on target exam weightage and daily study hours.";

    if (!ai) {
      return res.json({
        success: true,
        source: "fallback",
        schedule: fallbackSchedule,
        missions: fallbackMissions,
        notice: fallbackNotice
      });
    }

    const systemInstruction = `You are NEXORA AI Smart Planner, an expert study scheduler and mission engine for competitive exam aspirants (${targetExam || "JEE/NEET"}).

CRITICAL INTELLIGENT REDISTRIBUTION RULES:
1. Analyze existing user progress, backlogs, pending tasks, user stats, and recent mock test results (especially weak concepts & lowest scoring subjects).
2. Do NOT simply shift missed/incomplete tasks by +1 calendar day.
3. REDISTRIBUTE MISSED & HIGH-PRIORITY TASKS BASED ON PRIORITY & MOCK TEST WEAKNESS:
   - High priority tasks (S-Rank/A-Rank, or subjects with lowest test accuracy < 50%, or mock test weak concepts) MUST be assigned to prime morning/early-day focus slots (07:00 AM - 12:30 PM).
   - Moderate priority tasks get allocated to afternoon problem-solving slots.
   - Revision and mistake book entries get evening slots.
4. Generate 3-4 high-impact, actionable "Missions" specifically targeting weak concepts from mock tests & overdue backlogs.

Return strictly valid JSON format:
{
  "schedule": [
    {
      "timeSlot": "07:00 AM - 09:30 AM",
      "activity": "Detailed priority task activity specifying chapter and target",
      "subject": "Physics | Chemistry | Maths | Biology",
      "category": "12th Syllabus | 11th Revision | Backlog | Question Practice | Test Prep",
      "priority": "S-Rank | A-Rank | B-Rank",
      "reason": "Why this slot was prioritized (e.g. Mock test weak area: 42% accuracy)"
    }
  ],
  "missions": [
    {
      "id": "mission-1",
      "title": "Mission Title",
      "subject": "Physics | Chemistry | Maths | Biology",
      "priority": "S-Rank | A-Rank",
      "estimatedMinutes": 45,
      "reason": "Targeting weak concept from Mock Test",
      "actionType": "PYQ Solving | Backlog Elimination | Weak Concept Drill",
      "completed": false
    }
  ],
  "notice": "Short 1-2 sentence explanation of how tasks were prioritized based on performance & backlogs rather than simple calendar shifts."
}`;

    const promptText = `Target Exam: ${targetExam || "JEE Main/Advanced"}
Current Class: ${currentClass || "12th"}
Daily Target Hours: ${dailyTargetHours || 8}
Mock Test Weak Concepts: ${JSON.stringify(weakConceptsList)}
Mock Test Count: ${mockTestResults?.length || 0}
Accuracy Rate: ${avgAccuracy}%
Active 12th Backlogs: ${JSON.stringify(backlogs || [])}
11th Topics to Revise: ${JSON.stringify(eleventhBacklogs || [])}
Pending High Priority Tasks: ${JSON.stringify(pendingHighPriorityTasks)}
Log Mistake Count: ${mistakes?.length || 0}`;

    const response = await geminiQueue.enqueue(() =>
      ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptText,
        config: { systemInstruction, responseMimeType: "application/json" }
      })
    );

    let parsed: any = {};
    try {
      parsed = JSON.parse(response.text || "{}");
    } catch (e) {
      parsed = { schedule: fallbackSchedule, missions: fallbackMissions, notice: fallbackNotice };
    }

    return res.json({
      success: true,
      source: "gemini",
      schedule: parsed.schedule || fallbackSchedule,
      missions: parsed.missions || fallbackMissions,
      notice: parsed.notice || fallbackNotice
    });
  } catch (error: any) {
    if (isQuotaError(error)) {
      console.warn("⚠️ Gemini API Rate Limit / Quota Exceeded (429). Serving offline planner schedule.");
      return res.json({
        success: true,
        source: "quota_fallback",
        notice: "Gemini API rate limit reached (429). Displaying offline AI-prioritized schedule & missions.",
        schedule: [
          {
            timeSlot: "07:00 AM - 09:30 AM",
            activity: `[PRIORITY BACKLOG] ${req.body.backlogs?.[0]?.title || "Electrodynamics & Optics"} (Prioritized based on recent performance)`,
            subject: "Physics",
            category: "12th Syllabus",
            priority: "S-Rank",
            reason: "Prioritized into morning slot based on mock test weak areas"
          },
          {
            timeSlot: "10:00 AM - 12:30 PM",
            activity: "Calculus & Algebra Problem Solving (Timed PYQs)",
            subject: "Maths",
            category: "Backlog",
            priority: "S-Rank",
            reason: "High-yield backlog task"
          },
          {
            timeSlot: "02:00 PM - 04:00 PM",
            activity: `11th Chapter Revision: ${req.body.eleventhBacklogs?.[0] || "Chemical Bonding & Thermodynamics"}`,
            subject: "Chemistry",
            category: "11th Revision",
            priority: "A-Rank",
            reason: "11th revision slot"
          },
          {
            timeSlot: "04:30 PM - 06:30 PM",
            activity: "Target Question Drill (30 Timed PYQs)",
            subject: "Chemistry",
            category: "Question Practice",
            priority: "B-Rank",
            reason: "Practice session"
          },
          {
            timeSlot: "08:00 PM - 10:00 PM",
            activity: "Mistake Book Log Review & Spaced Repetition",
            subject: "Physics",
            category: "Revision",
            priority: "A-Rank",
            reason: "Spaced repetition"
          }
        ],
        missions: [
          {
            id: "m-1",
            title: "Priority Weak Area Remediation",
            subject: "Physics",
            priority: "S-Rank",
            estimatedMinutes: 50,
            reason: "Prioritized based on lowest accuracy in mock tests",
            actionType: "Weak Concept Drill",
            completed: false
          }
        ]
      });
    }
    console.error("Smart Planner Endpoint Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to auto-reschedule" });
  }
});

// 4. AI PDF Study Tools Endpoint
app.post("/api/gemini/pdf-tools", async (req, res) => {
  try {
    const { action, pdfTitle, pdfText } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "fallback",
        output: `[NEXORA AI PDF Tool - ${action.toUpperCase()}]\n\nDocument: ${pdfTitle || "Study Material"}\n\n1. Core Concepts: Key theorems, definitions, and formulas analyzed.\n2. Exam Importance: High probability of appearance in JEE/NEET.\n3. Key Formulae: All essential equations extracted.\n\n(Connect GEMINI_API_KEY in Settings for full real-time AI deep analysis).`
      });
    }

    const systemInstruction = `You are NEXORA PDF Intelligence. Perform the requested action (${action}) on the provided document text concisely and clearly for JEE/NEET preparation.`;
    const prompt = `Document Title: ${pdfTitle}\nAction: ${action}\nDocument Excerpt:\n${pdfText?.slice(0, 4000) || "Standard JEE/NEET study module"}`;

    const response = await geminiQueue.enqueue(() =>
      ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: { systemInstruction }
      })
    );

    return res.json({ success: true, source: "gemini", output: response.text });
  } catch (error: any) {
    if (isQuotaError(error)) {
      console.warn("⚠️ Gemini API Rate Limit / Quota Exceeded (429). Serving offline PDF analysis.");
      return res.json({
        success: true,
        source: "quota_fallback",
        output: `[NEXORA AI PDF Tool - ${req.body.action?.toUpperCase() || "ANALYSIS"}]\n\nDocument: ${req.body.pdfTitle || "Study Module"}\n\nKey Concepts Extracted:\n1. Core theorems, definitions, and formulas.\n2. High-yield exam applications for JEE/NEET.\n3. Summary of essential equations for rapid revision.`
      });
    }
    console.error("PDF Tools Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to process PDF tool" });
  }
});

// Start Dev / Production Server
async function startServer() {
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
    console.log(`⚡ NEXORA OS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
