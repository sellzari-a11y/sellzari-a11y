import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Minimal JSON-file store. Good enough for pilots; swap for Postgres later.
export class Store {
  constructor(file) {
    this.file = file;
    this.data = { cohorts: [], candidates: [], sessions: [] };
    if (file && fs.existsSync(file)) {
      this.data = JSON.parse(fs.readFileSync(file, "utf8"));
    }
  }

  save() {
    if (!this.file) return;
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2));
    fs.renameSync(tmp, this.file);
  }

  insert(collection, record) {
    const row = { id: randomUUID(), createdAt: new Date().toISOString(), ...record };
    this.data[collection].push(row);
    this.save();
    return row;
  }

  get(collection, id) {
    return this.data[collection].find((r) => r.id === id);
  }

  list(collection, predicate = () => true) {
    return this.data[collection].filter(predicate);
  }

  update(collection, id, patch) {
    const row = this.get(collection, id);
    if (!row) return undefined;
    Object.assign(row, patch);
    this.save();
    return row;
  }
}

export function seed(store) {
  if (store.data.cohorts.length) return;
  const cohort = store.insert("cohorts", { name: "Fall 2026 Full-Stack Cohort", org: "Demo Bootcamp" });
  for (const name of ["Ava Patel", "Marcus Lee", "Sofia Reyes"]) {
    store.insert("candidates", { cohortId: cohort.id, name, email: "" });
  }
}
