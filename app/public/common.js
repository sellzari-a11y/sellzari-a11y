export async function api(path, opts = {}) {
  const res = await fetch(path, {
    ...opts,
    headers: { "Content-Type": "application/json" },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const READINESS = { interview_ready: "Interview ready", almost_ready: "Almost ready", not_ready: "Needs coaching", no_data: "No sessions yet" };

export function renderScorecard(card, rubric) {
  const bars = rubric
    .map((r) => `<span>${esc(r.label)}</span><div class="bar"><div style="width:${card.scores[r.key] * 20}%"></div></div><b>${card.scores[r.key]}</b>`)
    .join("");
  return `
    <h2 style="margin-top:0">Scorecard: ${card.overall}/5 <span class="ready-${card.readiness}" style="font-size:16px">· ${READINESS[card.readiness]}</span></h2>
    <p>${esc(card.summary)}</p>
    <div class="rubric">${bars}</div>
    <div class="row" style="align-items:start;margin-top:14px">
      <div style="flex:1 1 260px"><strong>Strengths</strong><ul>${card.strengths.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
      <div style="flex:1 1 260px"><strong>Work on next</strong><ul>${card.improvements.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
    </div>`;
}
