"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Check, CheckCheck, CircleAlert, Clock3, Headphones, ListVideo, Mic, PenLine, Search, ShieldCheck } from "lucide-react";
import { Avatar, Badge, Breadcrumb, Button, Card, EmptyState, FormField, IconButton, Pagination, Popover, Progress, SearchInput, Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs } from "@/src/design-system";
import { ASSESSMENTS, initialReviews } from "./data";
import { AssessmentAudio, ReviewQuestion } from "./ReviewQuestion";
import { assessmentSummary, isValidated, parseReviews, pendingLocations, points, saveCorrection, scoreOf, SKILL_NAMES, STORAGE_KEY, validateQuestion, type Assessment, type QuestionReview, type ReviewState, type SkillId } from "./model";
import "./abilities-tests.css";

const icons = { listening: Headphones, reading: BookOpen, writing: PenLine, speaking: Mic };
const date = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
type Location = { assessment: string | null; skill: SkillId; part: string };
function readLocation(): Location {
  const params = new URLSearchParams(window.location.search);
  const assessment = ASSESSMENTS.find(a => a.id === params.get("assessment"));
  const skill = assessment?.skills.find(s => s.id === params.get("skill")) ?? assessment?.skills[0];
  return { assessment: assessment?.id ?? null, skill: skill?.id ?? "listening", part: skill?.parts.find(p => p.id === params.get("part"))?.id ?? "1" };
}
const EMPTY_REVIEWS: Record<string, QuestionReview> = {};

export function AbilitiesTestsView({ darkMode = false }: { darkMode?: boolean }) {
  const [state, setState] = useState<ReviewState>(initialReviews);
  const [ready, setReady] = useState(false);
  const [location, setLocation] = useState<Location>({ assessment: null, skill: "listening", part: "1" });
  const [expansion, setExpansion] = useState<{ key: string; question: string | null } | null>(null);
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState("");
  const scroll = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Browser storage is read after hydration so the server and first client render agree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { setState({ ...initialReviews(), ...parseReviews(localStorage.getItem(STORAGE_KEY), ASSESSMENTS) }); }
    catch { setStorageError("Browser storage is unavailable. Changes will last only for this session."); }
    setLocation(readLocation());
    setReady(true);
    const sync = () => setLocation(readLocation());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, reviews: state })); }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Surface an actual failure from the browser storage API.
    catch { setStorageError("Changes could not be saved in this browser. Keep this page open to retain your session."); }
  }, [ready, state]);
  const assessment = ASSESSMENTS.find(a => a.id === location.assessment);
  const reviews = assessment ? state[assessment.id] ?? EMPTY_REVIEWS : EMPTY_REVIEWS;
  const skill = assessment?.skills.find(s => s.id === location.skill);
  const part = skill?.parts.find(p => p.id === location.part) ?? skill?.parts[0];
  const partKey = `${location.assessment}-${location.skill}-${location.part}`;
  const expanded = expansion?.key === partKey ? expansion.question : part?.questions.find(q => q.criteria?.length)?.id ?? null;
  useEffect(() => {
    scroll.current?.scrollTo({ top: 0 });
  }, [partKey]);
  function navigate(next: Location) {
    const params = new URLSearchParams({ module: "abilities" });
    if (next.assessment) { params.set("assessment", next.assessment); params.set("skill", next.skill); params.set("part", next.part); }
    window.history.pushState({}, "", `/?${params}`);
    setLocation(next); setNotice("");
  }
  function updateReviews(next: ReturnType<typeof validateQuestion>) {
    if (!assessment) return;
    setState(current => ({ ...current, [assessment.id]: next }));
  }
  function nextPending() {
    if (!assessment) return;
    const pending = pendingLocations(assessment, reviews)[0];
    if (!pending) return;
    if (pending.skill !== location.skill || pending.part !== location.part) navigate({ assessment: assessment.id, skill: pending.skill, part: pending.part });
    setExpansion({ key: `${assessment.id}-${pending.skill}-${pending.part}`, question: pending.question });
    // Wait for the destination part to commit before focusing its first pending item.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const question = document.getElementById(pending.question);
      question?.scrollIntoView({ behavior: "smooth", block: "start" });
      question?.focus({ preventScroll: true });
    }));
  }
  return <div className="abilities-module ds-root" data-theme={darkMode ? "dark" : "light"} ref={scroll}>
    <header className="abilities-topbar">{assessment && <IconButton label="Back to 4 Abilities Tests" variant="ghost" onClick={() => navigate({ assessment: null, skill: "listening", part: "1" })} icon={<ArrowLeft size={19} />} />}<ListVideo size={23} /><div><h1>{assessment ? "Assessments" : "4 Abilities Tests"}</h1><p>{assessment ? "Review answers and validate assessment results" : "Monitor results and review your students’ four language skills"}</p></div><Badge tone="info" className="abilities-prototype-badge">Interactive prototype</Badge></header>
    {storageError && <p role="alert" className="abilities-storage-error">{storageError}</p>}
    <div className="abilities-notice" role="status" aria-live="polite">{notice}</div>
    {!ready ? <div className="abilities-loading"><Progress label="Loading saved assessment reviews" /><p>Loading assessments…</p></div> : !assessment || !skill || !part ? <AssessmentList state={state} onOpen={id => navigate({ assessment: id, skill: "listening", part: "1" })} /> : <>
      <section className="abilities-student-header"><Breadcrumb items={[{ label: "4 Abilities Tests", href: "/?module=abilities" }, { label: assessment.title }]} /><div className="abilities-student-row"><Avatar name={assessment.student} size="regular" /><div><h2>{assessment.student}</h2><p>{assessment.title}</p></div><div className="abilities-student-facts"><CalendarDays size={21} /><div><span>Date</span><strong>{date(assessment.date)}</strong></div><Clock3 size={21} /><div><span>Duration</span><strong>{assessment.minutes} minutes</strong></div></div></div></section>
      <div className="abilities-result-layout"><aside className="abilities-result-sidebar" aria-label="Assessment summary and skills"><Summary assessment={assessment} state={state} onPending={nextPending} />
        <h3 className="abilities-nav-title">Tests (4)</h3><nav className="abilities-skills" aria-label="Test skills">{assessment.skills.map(item => { const status = scoreOf(item.parts.flatMap(p => p.questions), reviews); const selected = item.id === skill.id; const Icon = icons[item.id]; return <Button key={item.id} variant={selected ? "outline" : "ghost-muted"} className="abilities-skill-button" aria-current={selected ? "page" : undefined} onClick={() => navigate({ assessment: assessment.id, skill: item.id, part: "1" })}><span className="abilities-skill-label">{assessment.completed ? status.pending ? <CircleAlert size={17} className="abilities-warning" /> : <CheckCheck size={18} /> : <Icon size={18} />}{SKILL_NAMES[item.id]}</span><strong className={status.pending && assessment.completed ? "abilities-warning" : ""}>{!assessment.completed ? "—" : status.pending ? `${status.pending} pending` : points(status.percent)}</strong></Button>; })}</nav>
      </aside><section className="abilities-result-content" aria-label={`${SKILL_NAMES[skill.id]} results`}>
        <div className="abilities-result-sticky"><h2>{SKILL_NAMES[skill.id]}</h2><div className="abilities-skill-summary"><div><span className="abilities-caption">Grade</span>{!assessment.completed ? <strong className="abilities-grade">—</strong> : scoreOf(skill.parts.flatMap(p => p.questions), reviews).pending ? <strong className="abilities-warning"><CircleAlert size={17} />{scoreOf(skill.parts.flatMap(p => p.questions), reviews).pending} pending</strong> : <strong className="abilities-grade">{points(scoreOf(skill.parts.flatMap(p => p.questions), reviews).percent)}</strong>}</div><div className="abilities-part-scores"><span className="abilities-caption">Score by part</span>{skill.parts.map(item => { const stats = scoreOf(item.questions, reviews); return <span key={item.id}>Part {item.id}<strong>{stats.pending || !assessment.completed ? "—" : points(stats.score)} / {points(stats.max)} pts</strong></span>; })}<span>Total<strong>{scoreOf(skill.parts.flatMap(p => p.questions), reviews).pending || !assessment.completed ? "—" : points(scoreOf(skill.parts.flatMap(p => p.questions), reviews).score)} / {points(scoreOf(skill.parts.flatMap(p => p.questions), reviews).max)} pts</strong></span></div><div><span className="abilities-caption">Start date</span><strong>{date(skill.startedAt)}</strong><span className="abilities-caption">Duration</span><strong>{skill.minutes}m</strong></div></div>
        <Tabs label={`${SKILL_NAMES[skill.id]} parts`} value={part.id} onChange={id => navigate({ ...location, part: id })} items={skill.parts.map(item => ({ value: item.id, label: `Part ${item.id}`, startIcon: !assessment.completed ? <Clock3 size={15} /> : item.questions.some(q => !isValidated(q, reviews)) ? <CircleAlert size={15} className="abilities-warning" /> : <Check size={15} /> }))} />
        </div>
        {!assessment.completed ? <Card><EmptyState title="This test is still in progress" description="Results and teacher review become available when the student completes the assessment." action={<Button variant="outline" onClick={() => navigate({ assessment: null, skill: "listening", part: "1" })}>Back to assessments</Button>} /></Card> : <div className="abilities-part-content" key={`${assessment.id}-${skill.id}-${part.id}`}><div className="abilities-instructions"><div><h3>Instructions</h3><p>{part.instructions}</p></div><span>{part.title} · <strong>{points(scoreOf(part.questions, reviews).score)}/{points(scoreOf(part.questions, reviews).max)} points{scoreOf(part.questions, reviews).pending ? " (provisional)" : ""}</strong></span></div>
          {part.passage && <Card><div className="abilities-passage">{part.passage.split("\n\n").map((paragraph, i) => i === 0 ? <h3 key={i}>{paragraph}</h3> : <p key={i}>{paragraph}</p>)}</div></Card>}
          {part.audio && <AssessmentAudio src={part.audio} label="Listening recording" />}
          <div className="abilities-questions-heading"><h3>Questions</h3>{part.questions.some(q => !q.criteria?.length) && <div className="abilities-legend"><span><i className="is-correct" />Student’s correct answer</span><span><i className="is-wrong" />Student’s wrong answer</span><span><i className="is-key" />Correct option</span></div>}</div>
          {part.questions.map((question, index) => <ReviewQuestion key={question.id} question={question} number={index + 1} review={reviews[question.id]} expanded={expanded === question.id} onToggle={() => setExpansion({ key: partKey, question: expanded === question.id ? null : question.id })} onSave={(criterionId, score, justification) => { updateReviews(saveCorrection(reviews, question, criterionId, score, justification)); setNotice("Correction saved in this browser. Validate the question to complete its review."); }} onValidate={() => { updateReviews(validateQuestion(reviews, question)); setNotice(`Question ${index + 1} validated. Progress and scores have been updated.`); }} />)}
        </div>}
      </section></div>
    </>}
  </div>;
}

function Summary({ assessment, state, onPending }: { assessment: Assessment; state: ReviewState; onPending: () => void }) {
  const summary = assessmentSummary(assessment, state[assessment.id]);
  return <Card><div className="abilities-final-summary"><div className="abilities-summary-label"><span>{assessment.student.split(" ")[0]}’s final grade</span><Popover label="Final grade calculation" trigger={<IconButton label="How is the final grade calculated?" variant="ghost" size="mini" icon={<CircleAlert size={16} />} />}><p>Each skill is normalized to 0–100. The final grade is the arithmetic mean of Listening, Reading, Writing and Speaking, with equal weight. It becomes available when all questions are validated.</p></Popover></div><div className="abilities-final-grade">{summary.finalGrade === null ? <CircleAlert size={24} className="abilities-warning" /> : <strong>{points(summary.finalGrade)}</strong>}<span>/100</span></div><div><strong>{!assessment.completed ? "Test in progress" : summary.pending ? "Validation required" : "Review completed"}</strong><p>{!assessment.completed ? "The student is still taking this test." : summary.pending ? `${summary.pending} ${summary.pending === 1 ? "question still needs" : "questions still need"} your review before the final grade is calculated.` : "All pending items are reviewed, validated and saved."}</p></div><Progress label="Validated questions" value={summary.validated} max={summary.total} /><span className="abilities-caption">{summary.validated} of {summary.total} questions validated</span><Button disabled={!assessment.completed || !summary.pending} variant={summary.pending ? "primary" : "secondary"} onClick={onPending} startIcon={!summary.pending ? <Check size={15} /> : undefined}>{!assessment.completed ? "Awaiting completion" : summary.pending ? "Go to pending items" : "Review completed"}</Button></div></Card>;
}

function AssessmentList({ state, onOpen }: { state: ReviewState; onOpen: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [level, setLevel] = useState("");
  const [page, setPage] = useState(1);
  const [descending, setDescending] = useState(true);
  const rows = ASSESSMENTS.map(assessment => ({ assessment, summary: assessmentSummary(assessment, state[assessment.id]) }));
  const filtered = rows.filter(({ assessment, summary }) => (!search || `${assessment.student} ${assessment.email} ${assessment.title}`.toLowerCase().includes(search.trim().toLowerCase())) && (!status || summary.status === status) && (!level || assessment.level === level)).sort((a, b) => (descending ? -1 : 1) * a.assessment.date.localeCompare(b.assessment.date));
  const pageCount = Math.max(1, Math.ceil(filtered.length / 5));
  const currentPage = Math.min(page, pageCount);
  return <div className="abilities-list"><div className="abilities-list-intro"><div><span className="abilities-eyebrow">ASSESSMENTS</span><h2>Four skills. One clear picture.</h2><p>Explore each student’s performance and give every answer the attention it deserves.</p></div><ShieldCheck size={38} /></div><div className="abilities-stat-grid">{[{ label: "Assessments", value: rows.length, icon: ListVideo }, { label: "Needs review", value: rows.filter(r => r.summary.status === "Needs review").length, icon: CircleAlert }, { label: "Reviewed", value: rows.filter(r => r.summary.status === "Reviewed").length, icon: CheckCheck }, { label: "In progress", value: rows.filter(r => r.summary.status === "In progress").length, icon: Clock3 }].map(({ label, value, icon: Icon }) => <Card key={label}><div className="abilities-stat"><span><Icon size={18} />{label}</span><strong>{value}</strong></div></Card>)}</div>
    <Card header={<div className="abilities-list-title"><div><h3>Assessment results</h3><p>Listening, Reading, Writing and Speaking</p></div><Badge>{ASSESSMENTS.length} assessments</Badge></div>}><div className="abilities-stack"><div className="abilities-filters"><FormField label="Search assessments"><SearchInput placeholder="Search student or assessment" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} /></FormField><FormField label="Status"><Select value={status} onChange={event => { setStatus(event.target.value); setPage(1); }}><option value="">All statuses</option><option>Needs review</option><option>Reviewed</option><option>In progress</option></Select></FormField><FormField label="Level"><Select value={level} onChange={event => { setLevel(event.target.value); setPage(1); }}><option value="">All levels</option><option>A2</option><option>B1</option><option>B2</option></Select></FormField>{(search || status || level) && <Button variant="ghost" onClick={() => { setSearch(""); setStatus(""); setLevel(""); setPage(1); }}>Clear filters</Button>}</div>
      {filtered.length ? <div className="abilities-table-wrap"><Table><caption className="ds-visually-hidden">Student assessment results</caption><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Assessment</TableHead><TableHead sortDirection={descending ? "descending" : "ascending"} onSort={() => setDescending(value => !value)}>Date</TableHead><TableHead>Status</TableHead><TableHead align="right">Final grade</TableHead><TableHead align="right">Action</TableHead></TableRow></TableHeader><TableBody>{filtered.slice((currentPage - 1) * 5, currentPage * 5).map(({ assessment, summary }) => <TableRow key={assessment.id}><TableCell><div className="abilities-person"><Avatar name={assessment.student} size="tiny" /><div><strong>{assessment.student}</strong><span>{assessment.email}</span></div></div></TableCell><TableCell description={`Level ${assessment.level}`}>English Proficiency Test</TableCell><TableCell>{date(assessment.date)}</TableCell><TableCell><Badge tone={summary.status === "Needs review" ? "warning" : summary.status === "Reviewed" ? "success" : "info"}>{summary.status}</Badge>{summary.status === "Needs review" && <span className="abilities-table-pending">{summary.pending} questions pending</span>}</TableCell><TableCell align="right"><strong>{summary.finalGrade === null ? "—" : `${points(summary.finalGrade)}/100`}</strong></TableCell><TableCell align="right"><Button size="small" variant="outline" endIcon={<ArrowRight size={14} />} onClick={() => onOpen(assessment.id)}>{summary.status === "Needs review" ? "Review test" : "View results"}</Button></TableCell></TableRow>)}</TableBody></Table></div> : <EmptyState title="No assessments found" description="Try another student name or clear the selected filters." action={<Button variant="outline" startIcon={<Search size={15} />} onClick={() => { setSearch(""); setStatus(""); setLevel(""); }}>Clear filters</Button>} />}
      <div className="abilities-list-footer"><span>{filtered.length ? (currentPage - 1) * 5 + 1 : 0}–{Math.min(currentPage * 5, filtered.length)} of {filtered.length} results</span><Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} /></div>
    </div></Card><p className="abilities-demo-note">Example students, responses and AI feedback. Review changes are saved only in this browser.</p></div>;
}
