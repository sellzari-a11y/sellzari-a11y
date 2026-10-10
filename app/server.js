import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Store, seed } from "./lib/store.js";
import { createProvider, RefusalError } from "./lib/ai.js";
import { TRACKS, RUBRIC, QUESTIONS_PER_SESSION, getTrack } from "./lib/tracks.js";
import { cohortDashboard } from "./lib/metrics.js";

const here = path.dirname(fileURLToPath(import.meta.url));

export function createApp({ store, provider }) {
  const app = express();
  app.use(express.json({ limit: "100kb" }));
  app.use(express.static(path.join(here, "public")));

  const wrap = (fn) => (req, res) =>
    fn(req, res).catch((err) => {
      if (err instanceof RefusalError) return res.status(422).json({ error: err.message });
      console.error(err);
      res.status(500).json({ error: "Something went wrong talking to the AI interviewer. Please retry." });
    });

  app.get("/api/config", (req, res) =>
    res.json({ tracks: TRACKS, rubric: RUBRIC, questionsPerSession: QUESTIONS_PER_SESSION, aiMode: provider.name }),
  );

  app.get("/api/cohorts", (req, res) => res.json(store.list("cohorts")));
  app.post("/api/cohorts", (req, res) => {
    const name = String(req.body?.name || "").trim();
    if (!name) return res.status(400).json({ error: "name is required" });
    res.status(201).json(store.insert("cohorts", { name, org: String(req.body.org || "") }));
  });

  app.get("/api/cohorts/:id/candidates", (req, res) =>
    res.json(store.list("candidates", (c) => c.cohortId === req.params.id)),
  );
  app.post("/api/cohorts/:id/candidates", (req, res) => {
    if (!store.get("cohorts", req.params.id)) return res.status(404).json({ error: "cohort not found" });
    const name = String(req.body?.name || "").trim();
    if (!name) return res.status(400).json({ error: "name is required" });
    res.status(201).json(store.insert("candidates", { cohortId: req.params.id, name, email: String(req.body.email || "") }));
  });

  app.get("/api/cohorts/:id/dashboard", (req, res) => {
    if (!store.get("cohorts", req.params.id)) return res.status(404).json({ error: "cohort not found" });
    res.json(cohortDashboard(store, req.params.id));
  });

  app.post("/api/sessions", (req, res) => {
    const candidate = store.get("candidates", req.body?.candidateId);
    const track = getTrack(req.body?.trackId);
    if (!candidate) return res.status(404).json({ error: "candidate not found" });
    if (!track) return res.status(400).json({ error: "unknown track" });
    const session = store.insert("sessions", {
      candidateId: candidate.id,
      trackId: track.id,
      status: "in_progress",
      transcript: [{ role: "interviewer", content: track.seedQuestion }],
    });
    res.status(201).json(session);
  });

  app.get("/api/sessions/:id", (req, res) => {
    const session = store.get("sessions", req.params.id);
    if (!session) return res.status(404).json({ error: "session not found" });
    res.json(session);
  });

  app.post("/api/sessions/:id/answer", wrap(async (req, res) => {
    const session = store.get("sessions", req.params.id);
    if (!session) return res.status(404).json({ error: "session not found" });
    if (session.status !== "in_progress") return res.status(409).json({ error: "session already finished" });
    const content = String(req.body?.content || "").trim();
    if (!content) return res.status(400).json({ error: "answer is empty" });
    if (content.length > 6000) return res.status(400).json({ error: "answer is too long" });

    const track = getTrack(session.trackId);
    const transcript = [...session.transcript, { role: "candidate", content }];
    const answered = transcript.filter((t) => t.role === "candidate").length;
    const finished = answered >= QUESTIONS_PER_SESSION;

    const reply = await provider.nextQuestion({ track, transcript, finished });
    transcript.push({ role: "interviewer", content: reply });

    const patch = { transcript };
    if (finished) {
      patch.scorecard = await provider.score({ track, transcript });
      patch.status = "completed";
      patch.completedAt = new Date().toISOString();
    }
    res.json(store.update("sessions", session.id, patch));
  }));

  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const store = new Store(process.env.DATA_FILE || path.join(here, "data", "db.json"));
  seed(store);
  const provider = createProvider();
  const port = Number(process.env.PORT || 3000);
  createApp({ store, provider }).listen(port, () => {
    console.log(`Interview simulator on http://localhost:${port} (AI mode: ${provider.name})`);
  });
}
