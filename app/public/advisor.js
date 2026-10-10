import { api, esc, READINESS, renderScorecard } from "./common.js";

const $ = (id) => document.getElementById(id);
let config;

async function refresh() {
  const d = await api(`/api/cohorts/${$("cohort").value}/dashboard`);
  const t = d.totals;
  const stat = (v, label) => `<div class="stat"><b>${v ?? "–"}</b><span>${label}</span></div>`;
  $("stats").innerHTML =
    stat(t.candidates, "Candidates") +
    stat(t.completedSessions, "Mock interviews completed") +
    stat(t.avgOverall, "Average score (of 5)") +
    stat(`${d.readiness.interview_ready}/${t.candidates}`, "Interview ready") +
    stat(t.advisorHoursSaved, "Advisor hours saved");
  $("rubric").innerHTML = config.rubric
    .map((r) => {
      const v = d.rubricAverages[r.key];
      return `<span>${esc(r.label)}</span><div class="bar"><div style="width:${(v ?? 0) * 20}%"></div></div><b>${v ?? "–"}</b>`;
    })
    .join("");
  $("rows").innerHTML = d.candidates
    .map(
      (c) => `<tr>
        <td>${esc(c.name)}</td>
        <td class="ready-${c.readiness}">${READINESS[c.readiness]}</td>
        <td>${c.latestOverall ?? "–"}</td>
        <td>${c.sessions}</td>
        <td>${c.latestSessionId ? `<a href="#" data-session="${c.latestSessionId}">View latest</a>` : ""}</td>
      </tr>`,
    )
    .join("");
}

$("rows").addEventListener("click", async (e) => {
  const id = e.target.dataset?.session;
  if (!id) return;
  e.preventDefault();
  const s = await api(`/api/sessions/${id}`);
  const transcript = s.transcript
    .map((t) => `<div class="msg ${t.role}">${esc(t.content)}</div>`)
    .join("");
  $("detail").innerHTML = renderScorecard(s.scorecard, config.rubric) +
    `<details style="margin-top:14px"><summary>Full transcript</summary><div class="chat" style="margin-top:10px">${transcript}</div></details>`;
  $("detail").hidden = false;
  $("detail").scrollIntoView({ behavior: "smooth" });
});

$("add").addEventListener("click", async () => {
  const name = $("newName").value.trim();
  if (!name) return;
  await api(`/api/cohorts/${$("cohort").value}/candidates`, { method: "POST", body: { name } });
  $("newName").value = "";
  refresh();
});

$("cohort").addEventListener("change", refresh);

config = await api("/api/config");
const cohorts = await api("/api/cohorts");
$("cohort").innerHTML = cohorts.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("");
await refresh();
