import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { RUBRIC, QUESTIONS_PER_SESSION } from "./tracks.js";

const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5-5";
// Re-run a safety-classifier decline on Anthropic's recommended fallback model.
const FALLBACK = { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" };

const ScorecardSchema = z.object({
  scores: z.object(Object.fromEntries(RUBRIC.map((r) => [r.key, z.number().int().min(1).max(5)]))),
  overall: z.number().int().min(1).max(5),
  readiness: z.enum(["not_ready", "almost_ready", "interview_ready"]),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  summary: z.string(),
});

const scorecardJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["scores", "overall", "readiness", "strengths", "improvements", "summary"],
  properties: {
    scores: {
      type: "object",
      additionalProperties: false,
      required: RUBRIC.map((r) => r.key),
      properties: Object.fromEntries(RUBRIC.map((r) => [r.key, { type: "integer" }])),
    },
    overall: { type: "integer" },
    readiness: { type: "string", enum: ["not_ready", "almost_ready", "interview_ready"] },
    strengths: { type: "array", items: { type: "string" } },
    improvements: { type: "array", items: { type: "string" } },
    summary: { type: "string" },
  },
};

export class RefusalError extends Error {}

function interviewerSystem(track) {
  return `You are a realistic, professional hiring-manager interviewer running a mock ${track.kind} interview for the role "${track.name}".
The candidate is a coding-bootcamp graduate preparing for real interviews. Focus areas: ${track.focus}.

How to run the interview:
- Ask exactly one question per turn. Keep each turn under 90 words.
- Before a new question, you may give one short sentence reacting to the previous answer, the way a real interviewer would. Do not grade or coach yet; feedback comes in the scorecard.
- Use follow-ups to probe vague answers, then move to a new topic.
- The interview has ${QUESTIONS_PER_SESSION} main questions. When told the interview is over, thank the candidate in one or two sentences and ask nothing further.`;
}

function toMessages(transcript) {
  // Claude's turns are "interviewer", the candidate's are "candidate".
  return transcript.map((t) => ({
    role: t.role === "interviewer" ? "assistant" : "user",
    content: t.content,
  }));
}

function textOf(response) {
  if (response.stop_reason === "refusal") {
    throw new RefusalError("The model declined to respond to this turn.");
  }
  return response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

export class AnthropicProvider {
  name = "anthropic";
  constructor(client = new Anthropic()) {
    this.client = client;
  }

  async nextQuestion({ track, transcript, finished }) {
    const messages = [
      // The API needs a user turn first; the seed question is the opening interviewer turn.
      { role: "user", content: "Hi, I'm ready to begin." },
      ...toMessages(transcript),
    ];
    if (finished) {
      messages.push({ role: "system", content: "The interview is over. Close it out now." });
    }
    const response = await this.client.beta.messages.create({
      model: MODEL,
      max_tokens: 2000,
      output_config: { effort: "low" },
      system: interviewerSystem(track),
      messages,
      ...FALLBACK,
    });
    return textOf(response);
  }

  async score({ track, transcript }) {
    const rubric = RUBRIC.map((r) => `- ${r.key}: ${r.label}`).join("\n");
    const text = transcript
      .map((t) => `${t.role === "interviewer" ? "INTERVIEWER" : "CANDIDATE"}: ${t.content}`)
      .join("\n\n");
    const response = await this.client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: scorecardJsonSchema },
      },
      system: `You are a senior technical recruiter who evaluates mock interviews for a career-services team. Be honest and specific: advisors use your scorecard to decide who needs coaching before real interviews.`,
      messages: [
        {
          role: "user",
          content: `Score this mock interview for "${track.name}" (focus: ${track.focus}).

Rubric (each 1-5, where 3 = would pass a typical junior screen):
${rubric}

Also give an overall 1-5 score, a readiness verdict (not_ready, almost_ready, interview_ready), 2-4 concrete strengths, 2-4 concrete improvements that quote or reference what the candidate said, and a 2-3 sentence summary written for the candidate's career advisor.

<transcript>
${text}
</transcript>`,
        },
      ],
      ...FALLBACK,
    });
    return ScorecardSchema.parse(JSON.parse(textOf(response)));
  }
}

// Deterministic offline provider so the demo and tests run without API credentials.
export class MockProvider {
  name = "mock";
  static FOLLOW_UPS = [
    "Thanks. Can you give a concrete example from a project you built?",
    "How would you test that, and what edge cases would you watch for?",
    "If that approach became slow at scale, what would you change first?",
    "What trade-offs did you consider, and why did you pick that option?",
  ];

  async nextQuestion({ transcript, finished }) {
    if (finished) return "That's the end of our interview. Thanks for your time; your scorecard is on its way.";
    const asked = transcript.filter((t) => t.role === "interviewer").length;
    return MockProvider.FOLLOW_UPS[(asked - 1) % MockProvider.FOLLOW_UPS.length];
  }

  async score({ transcript }) {
    const answers = transcript.filter((t) => t.role === "candidate").map((t) => t.content);
    const avgWords = answers.reduce((n, a) => n + a.split(/\s+/).filter(Boolean).length, 0) / Math.max(answers.length, 1);
    const base = avgWords >= 60 ? 4 : avgWords >= 25 ? 3 : 2;
    const scores = Object.fromEntries(RUBRIC.map((r, i) => [r.key, Math.min(5, Math.max(1, base + (i === 0 ? 1 : 0) - (i === 1 ? 1 : 0)))]));
    return ScorecardSchema.parse({
      scores,
      overall: base,
      readiness: base >= 4 ? "interview_ready" : base === 3 ? "almost_ready" : "not_ready",
      strengths: ["Stayed engaged through every question", "Answers were on topic"],
      improvements: ["Use specific examples with measurable outcomes", "Structure answers: context, approach, result"],
      summary: `Offline demo scorecard based on answer length (avg ${Math.round(avgWords)} words). Set ANTHROPIC_API_KEY for real AI evaluation.`,
    });
  }
}

export function createProvider() {
  const mode = process.env.AI_MODE || (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN ? "anthropic" : "mock");
  return mode === "anthropic" ? new AnthropicProvider() : new MockProvider();
}
