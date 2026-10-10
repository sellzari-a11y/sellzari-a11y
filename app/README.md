# AI Interview Simulator (MVP)

A B2B mock-interview platform for coding bootcamps and staffing agencies. Candidates practice with an AI interviewer and get a scored rubric. Career advisors see readiness across the whole cohort, without sitting in on every mock interview.

## What's in the MVP

- **Candidate view** (`/`): pick a track (Frontend, Backend, Data, Behavioral) and run a 4-question mock interview. A scorecard appears at the end.
- **AI interviewer**: Claude asks one question per turn, follows up on vague answers, and closes out the interview.
- **AI scorecard**: rates communication, technical depth, problem solving, and answer structure on a 1–5 scale. It also gives a readiness verdict and concrete strengths and improvements. The output is JSON constrained to a schema.
- **Advisor dashboard** (`/advisor.html`): cohort KPIs (sessions, average score, interview-ready count, advisor hours saved), skill averages, and a candidate list sorted by who needs coaching first. Advisors can open any scorecard and its full transcript.

## Run it

```bash
cd app
npm install
export ANTHROPIC_API_KEY=sk-ant-...   # omit to run in offline demo mode
npm start                             # http://localhost:3000
npm test
```

Without credentials the app uses a deterministic **mock provider**: canned follow-up questions, and a scorecard based on answer length. That keeps sales demos and tests running offline.

| Env var | Default | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | Enables the real Claude interviewer |
| `AI_MODE` | auto | Force `anthropic` or `mock` |
| `CLAUDE_MODEL` | `claude-opus-5-5` | Model for interviews and scoring |
| `PORT` | `3000` | HTTP port |
| `DATA_FILE` | `data/db.json` | JSON storage file |

## How it's built

- `server.js`: Express REST API plus static frontend
- `lib/ai.js`: Claude provider and offline mock provider
  - Interview turns run at `low` effort for speed; scoring runs at `medium`.
  - Requests opt into server-side refusal fallbacks (`fallbacks: "default"`).
- `lib/metrics.js`: cohort dashboard aggregation. It assumes a manual mock interview costs an advisor 75 minutes (`ADVISOR_MINUTES_PER_MOCK`).
- `lib/tracks.js`: interview tracks and the rubric
- `lib/store.js`: JSON-file store, seeded with a demo cohort

## Next steps toward a sellable pilot

1. Auth and multi-tenancy (an org per bootcamp or agency; advisor and candidate roles)
2. Postgres in place of the JSON store
3. Voice mode and a live coding pad for technical rounds
4. Tracking placement outcomes (offer received, salary) to prove the placement-rate lift
5. CSV roster import and LMS/ATS integrations
