// Interview tracks a bootcamp or staffing agency can assign to candidates.
export const TRACKS = [
  {
    id: "frontend",
    name: "Frontend Engineer (React)",
    kind: "technical",
    focus: "JavaScript fundamentals, React state and effects, browser rendering, accessibility, and debugging UI bugs",
    seedQuestion:
      "Let's start with fundamentals. Walk me through what happens between a user clicking a button in a React app and the screen updating.",
  },
  {
    id: "backend",
    name: "Backend Engineer (Node/APIs)",
    kind: "technical",
    focus: "REST API design, databases and indexing, async I/O, error handling, and scaling a service",
    seedQuestion:
      "Suppose you're designing an API for a to-do app used by a million users. How would you structure the endpoints and the database tables?",
  },
  {
    id: "data",
    name: "Data Analyst (SQL/Python)",
    kind: "technical",
    focus: "SQL joins and aggregations, data cleaning, basic statistics, and communicating insights",
    seedQuestion:
      "A stakeholder says weekly signups dropped 20%. Using SQL, how would you investigate whether that's real and what caused it?",
  },
  {
    id: "behavioral",
    name: "Behavioral (STAR)",
    kind: "behavioral",
    focus: "teamwork, conflict, ownership, learning from failure, and career motivation, answered in STAR format",
    seedQuestion:
      "Tell me about a time you were stuck on a technical problem on a team project. What did you do?",
  },
];

export const RUBRIC = [
  { key: "communication", label: "Communication" },
  { key: "technical_depth", label: "Technical depth" },
  { key: "problem_solving", label: "Problem solving" },
  { key: "structure", label: "Answer structure" },
];

export const QUESTIONS_PER_SESSION = 4;

export function getTrack(id) {
  return TRACKS.find((t) => t.id === id);
}
