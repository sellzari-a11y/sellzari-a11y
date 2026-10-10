import { api, esc, renderScorecard } from "./common.js";

const $ = (id) => document.getElementById(id);
let config, session;

async function loadCandidates() {
  const list = await api(`/api/cohorts/${$("cohort").value}/candidates`);
  $("candidate").innerHTML = list.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("");
}

function renderChat() {
  $("chat").innerHTML = session.transcript.map((t) => `<div class="msg ${t.role}">${esc(t.content)}</div>`).join("");
  const answered = session.transcript.filter((t) => t.role === "candidate").length;
  $("progress").textContent = session.status === "completed" ? "Complete" : `Question ${answered + 1} of ${config.questionsPerSession}`;
  $("answerForm").hidden = session.status === "completed";
  if (session.scorecard) {
    $("scorecard").innerHTML = renderScorecard(session.scorecard, config.rubric);
    $("scorecard").hidden = false;
  }
}

$("cohort").addEventListener("change", loadCandidates);

$("start").addEventListener("click", async () => {
  $("start").disabled = true;
  try {
    session = await api("/api/sessions", { method: "POST", body: { candidateId: $("candidate").value, trackId: $("track").value } });
    $("trackName").textContent = config.tracks.find((t) => t.id === session.trackId).name;
    $("setup").hidden = true;
    $("interview").hidden = false;
    renderChat();
    $("answer").focus();
  } catch (e) {
    $("mode").innerHTML = `<span class="error">${esc(e.message)}</span>`;
    $("start").disabled = false;
  }
});

$("answerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = $("answer").value.trim();
  if (!content) return;
  $("send").disabled = true;
  const last = session.transcript.filter((t) => t.role === "candidate").length + 1 >= config.questionsPerSession;
  $("status").textContent = last ? "Wrapping up and scoring your interview…" : "Interviewer is thinking…";
  try {
    session = await api(`/api/sessions/${session.id}/answer`, { method: "POST", body: { content } });
    $("answer").value = "";
    $("status").textContent = "";
    renderChat();
  } catch (err) {
    $("status").innerHTML = `<span class="error">${esc(err.message)}</span>`;
  } finally {
    $("send").disabled = false;
  }
});

config = await api("/api/config");
$("track").innerHTML = config.tracks.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("");
$("mode").textContent = config.aiMode === "mock" ? "Running in offline demo mode (no API key set): the interviewer uses canned follow-ups." : "";
const cohorts = await api("/api/cohorts");
$("cohort").innerHTML = cohorts.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("");
await loadCandidates();
