import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../server.js";
import { Store, seed } from "../lib/store.js";
import { MockProvider } from "../lib/ai.js";
import { QUESTIONS_PER_SESSION } from "../lib/tracks.js";
import { ADVISOR_MINUTES_PER_MOCK } from "../lib/metrics.js";

async function withServer(fn) {
  const store = new Store(null);
  seed(store);
  const server = createApp({ store, provider: new MockProvider() }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, body) => {
    const res = await fetch(base + path, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {});
    return { status: res.status, body: await res.json() };
  };
  try {
    await fn(call, store);
  } finally {
    server.close();
  }
}

async function runInterview(call, candidateId, answer) {
  let { body: s } = await call("/api/sessions", { candidateId, trackId: "backend" });
  for (let i = 0; i < QUESTIONS_PER_SESSION; i++) {
    ({ body: s } = await call(`/api/sessions/${s.id}/answer`, { content: answer }));
  }
  return s;
}

test("full interview produces a scorecard and closes the session", async () => {
  await withServer(async (call, store) => {
    const [candidate] = store.list("candidates");
    const s = await runInterview(call, candidate.id, "I would use Postgres with an index on user_id. ".repeat(10));
    assert.equal(s.status, "completed");
    assert.equal(s.transcript.length, QUESTIONS_PER_SESSION * 2 + 1);
    assert.equal(s.scorecard.readiness, "interview_ready");

    const again = await call(`/api/sessions/${s.id}/answer`, { content: "one more" });
    assert.equal(again.status, 409);
  });
});

test("dashboard aggregates readiness, hours saved, and orders by need", async () => {
  await withServer(async (call, store) => {
    const [cohort] = store.list("cohorts");
    const [strong, weak] = store.list("candidates");
    await runInterview(call, strong.id, "Detailed answer with examples and trade-offs. ".repeat(12));
    await runInterview(call, weak.id, "Not sure.");

    const { body: d } = await call(`/api/cohorts/${cohort.id}/dashboard`);
    assert.equal(d.totals.completedSessions, 2);
    assert.equal(d.totals.advisorHoursSaved, Math.round((2 * ADVISOR_MINUTES_PER_MOCK) / 6) / 10);
    assert.equal(d.readiness.interview_ready, 1);
    assert.equal(d.readiness.not_ready, 1);
    assert.equal(d.readiness.no_data, 1);
    assert.equal(d.candidates[0].name, weak.name);
  });
});

test("rejects bad input", async () => {
  await withServer(async (call, store) => {
    const [candidate] = store.list("candidates");
    assert.equal((await call("/api/sessions", { candidateId: candidate.id, trackId: "nope" })).status, 400);
    assert.equal((await call("/api/sessions", { candidateId: "missing", trackId: "backend" })).status, 404);
    const { body: s } = await call("/api/sessions", { candidateId: candidate.id, trackId: "backend" });
    assert.equal((await call(`/api/sessions/${s.id}/answer`, { content: "  " })).status, 400);
  });
});
