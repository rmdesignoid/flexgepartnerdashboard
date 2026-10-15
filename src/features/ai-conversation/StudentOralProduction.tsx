"use client";

import { useEffect, useState } from "react";
import { StudentPerformance } from "./StudentPerformance";
import { OralReport } from "./OralReport";
import { INITIAL_STATE, readState, saveState, STORAGE_KEY, type ConversationState } from "./types";
import type { PerformanceEntry } from "./performance";
import "./ai-conversation.css";
import "./oral-production-revision.css";

export function StudentOralProduction() {
  const [state, setState] = useState<ConversationState>(INITIAL_STATE);
  const [student, setStudent] = useState("");
  const [report, setReport] = useState<PerformanceEntry | null>(null);
  useEffect(() => {
    // Match the prototype's storage and cross-tab update behavior.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(readState());
    setStudent(new URLSearchParams(window.location.search).get("student") ?? "Anna Johnson");
    const refresh = (event: StorageEvent) => { if (!event.key || event.key === STORAGE_KEY) setState(readState()); };
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);
  if (!student) return <p role="status">Loading oral production history…</p>;
  const currentReport = report ? state.attempts.find((attempt) => attempt.id === report.attempt.id) : null;
  return <main className="student-oral-page ai-teacher">
    <div hidden={!!report}><StudentPerformance active={!report} state={state} student={student} onReport={setReport} onReturn={() => { window.location.href = "/"; }} /></div>
    {report && currentReport ? <OralReport key={currentReport.id} practice={report.practice} submission={currentReport} onReturn={() => setReport(null)} onUpdate={(attempt) => {
      const next = { ...state, attempts: state.attempts.map((item) => item.id === attempt.id ? attempt : item) };
      saveState(next); setState(next);
    }} /> : null}
  </main>;
}
