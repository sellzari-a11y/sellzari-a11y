import { RUBRIC } from "./tracks.js";

// Advisor time a manual mock interview costs: prep, 45-min session, written feedback.
export const ADVISOR_MINUTES_PER_MOCK = 75;

const avg = (xs) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null);

export function cohortDashboard(store, cohortId) {
  const candidates = store.list("candidates", (c) => c.cohortId === cohortId);
  const ids = new Set(candidates.map((c) => c.id));
  const sessions = store.list("sessions", (s) => ids.has(s.candidateId));
  const scored = sessions.filter((s) => s.scorecard);

  const rows = candidates.map((c) => {
    const mine = scored.filter((s) => s.candidateId === c.id).sort((a, b) => a.completedAt.localeCompare(b.completedAt));
    const latest = mine.at(-1);
    return {
      id: c.id,
      name: c.name,
      sessions: mine.length,
      latestOverall: latest?.scorecard.overall ?? null,
      firstOverall: mine[0]?.scorecard.overall ?? null,
      readiness: latest?.scorecard.readiness ?? "no_data",
      latestSessionId: latest?.id ?? null,
    };
  });

  const readiness = { interview_ready: 0, almost_ready: 0, not_ready: 0, no_data: 0 };
  for (const r of rows) readiness[r.readiness]++;

  const improved = rows.filter((r) => r.sessions >= 2 && r.latestOverall > r.firstOverall).length;

  return {
    totals: {
      candidates: candidates.length,
      completedSessions: scored.length,
      avgOverall: avg(scored.map((s) => s.scorecard.overall)),
      advisorHoursSaved: Math.round((scored.length * ADVISOR_MINUTES_PER_MOCK) / 6) / 10,
      improvedCandidates: improved,
    },
    rubricAverages: Object.fromEntries(RUBRIC.map((r) => [r.key, avg(scored.map((s) => s.scorecard.scores[r.key]))])),
    readiness,
    // Who needs an advisor's attention first: not ready, then no data, then lowest score.
    candidates: rows.sort((a, b) => priority(a) - priority(b) || (a.latestOverall ?? 0) - (b.latestOverall ?? 0)),
  };
}

function priority(r) {
  return { not_ready: 0, no_data: 1, almost_ready: 2, interview_ready: 3 }[r.readiness];
}
