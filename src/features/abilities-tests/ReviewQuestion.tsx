"use client";

import { useId, useRef, useState } from "react";
import { Bot, Check, ChevronDown, ChevronUp, Circle, CircleAlert, CircleCheck, Minus, Pause, Play, X } from "lucide-react";
import { Badge, Button, Card, Dialog, FormField, IconButton, Input, Slider, Tabs, Textarea } from "@/src/design-system";
import { criterionScore, isValidated, points, questionScore, type Criterion, type Question, type QuestionReview } from "./model";

const time = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
export function AssessmentAudio({ src, label }: { src: string; label: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  return <div className="abilities-audio-group"><span className="abilities-caption">{label} · Example audio</span><div className="abilities-audio">
    {/* Audio-only language assessment: no video captions or visual information. */}
    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
    <audio ref={audio} src={src} preload="metadata" onLoadedMetadata={() => setDuration(Number.isFinite(audio.current?.duration) ? audio.current!.duration : 0)} onTimeUpdate={() => setPosition(audio.current?.currentTime ?? 0)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => setError("Audio could not be loaded. Please try again.")} />
    <IconButton label={`${playing ? "Pause" : "Play"} ${label}`} variant="secondary" roundness="round" onClick={() => { setError(""); if (playing) audio.current?.pause(); else void audio.current?.play().catch(() => setError("Audio could not be played.")); }} icon={playing ? <Pause size={16} /> : <Play size={16} />} />
    <Slider label={`Seek ${label}`} value={[position]} max={duration || 1} step={0.1} disabled={!duration} onValueChange={([value]) => { if (audio.current) { audio.current.currentTime = value; setPosition(value); } }} />
    <span className="abilities-audio-time">{time(position)} / {time(duration)}</span>
  </div>{error && <span role="alert" className="abilities-error">{error}</span>}</div>;
}

function Evidence({ question, criterion }: { question: Question; criterion: Criterion }) {
  if (question.audio) return <AssessmentAudio src={question.audio} label="Student’s answer" />;
  const evidence = criterion.evidence;
  const index = evidence ? question.answer.indexOf(evidence) : -1;
  return <div className="abilities-answer"><span className="abilities-caption">Student’s answer</span><p>{index >= 0 ? <>{question.answer.slice(0, index)}<mark>{evidence}</mark>{question.answer.slice(index + evidence!.length)}</> : question.answer}</p>{index >= 0 && <span className="abilities-caption">Highlighted passage · {criterion.label}</span>}</div>;
}

function CriterionDialog({ question, criterion, review, edit, onSave }: { question: Question; criterion: Criterion; review?: QuestionReview; edit: boolean; onSave: (criterionId: string, score: number, justification: string) => void }) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState("");
  const [justification, setJustification] = useState("");
  const [dimension, setDimension] = useState(criterion.dimensions?.[0] ?? criterion.label);
  const [error, setError] = useState("");
  const dimensionExplanation = dimension === "Cohesion" ? "The response follows a clear sequence from the past weekend to future plans. Linking words connect the ideas, although some transitions could be more precise." : dimension === "Punctuation" ? "Sentence boundaries are generally clear. The comma before ‘but’ helps separate the contrasting ideas in the response." : dimension === "Spelling" ? "The words in this example are spelled correctly. The phrase ‘my friends was’ is an agreement issue and should be considered under grammar." : criterion.explanation;
  const dimensionEvidence = dimension === "Cohesion" ? "Next Saturday" : dimension === "Punctuation" ? "tired, but" : dimension === "Spelling" ? undefined : criterion.evidence;
  const formId = useId();
  const initial = criterionScore(criterion, review);
  const numeric = score.trim() === "" ? NaN : Number(score);
  const validRange = Number.isFinite(numeric) && numeric >= 0 && numeric <= criterion.max;
  const valid = validRange && numeric !== initial && !!justification.trim();
  const disabledReason = !validRange ? `Enter a score from 0 to ${points(criterion.max)}.` : numeric === initial ? "Change the score before saving." : !justification.trim() ? "Add a justification before saving." : "";
  return <Dialog title={edit ? "Edit correction" : "Correction details"} description={criterion.label} size="wide" scroll="body" open={open} onOpenChange={next => { if (next) { setScore(String(initial)); setJustification(""); setError(""); setDimension(criterion.dimensions?.[0] ?? criterion.label); } setOpen(next); }} trigger={<Button variant={edit ? "outline" : "ghost"} size="mini">{edit ? "Edit correction" : "View details"}</Button>} footer={edit ? <><div className="abilities-footer-score"><span className="abilities-ai"><Bot size={14} />AI suggested score</span><strong className={validRange && numeric !== criterion.aiScore ? "abilities-strike" : ""}>{points(criterion.aiScore)} / {points(criterion.max)} points</strong></div>{validRange && numeric !== initial && <div className="abilities-footer-score"><span className="abilities-caption">Teacher’s score</span><strong>{points(numeric)} / {points(criterion.max)} points</strong></div>}<span title={disabledReason} className="abilities-save"><Button type="submit" form={formId} disabled={!valid}>Save score</Button></span></> : <Button variant="outline" onClick={() => setOpen(false)}>Close details</Button>}>
    <div className="abilities-stack"><span className="abilities-ai"><Bot size={15} />AI score <strong>{points(criterion.aiScore)} / {points(criterion.max)} points</strong></span><p>{criterion.explanation}</p></div>
    {criterion.dimensions && <Tabs label="Correction dimensions" value={dimension} onChange={setDimension} items={criterion.dimensions.map(label => ({ value: label, label }))} />}
    <Evidence question={question} criterion={{ ...criterion, evidence: dimensionEvidence }} />
    <Card><div className="abilities-stack"><span className="abilities-ai"><Bot size={15} />AI explanation · {dimension}</span><p>{dimensionExplanation}</p><span className="abilities-caption">Illustrative feedback for this prototype.</span></div></Card>
    {review?.criteria[criterion.id] && <Card><div className="abilities-stack"><strong>Saved teacher’s correction</strong><p>{review.criteria[criterion.id].justification}</p><span className="abilities-caption">{points(initial)} / {points(criterion.max)} points</span></div></Card>}
    {edit && <form id={formId} className="abilities-stack" onSubmit={event => { event.preventDefault(); if (!valid) return; try { onSave(criterion.id, numeric, justification); setOpen(false); } catch (err) { setError(err instanceof Error ? err.message : "The correction could not be saved."); } }}>
      <FormField label="Teacher’s score" required hint={`From 0 to ${points(criterion.max)} points`} error={score !== "" && !validRange ? "Enter a score within the allowed range." : undefined}><Input type="number" min={0} max={criterion.max} step="0.01" required value={score} onChange={event => setScore(event.target.value)} /></FormField>
      <FormField label="Teacher’s justification" required><Textarea required rows={4} value={justification} onChange={event => setJustification(event.target.value)} placeholder="Explain why you are adjusting this score. Include evidence from the student’s answer." /></FormField>
      {error && <p className="abilities-error" role="alert">{error}</p>}
    </form>}
  </Dialog>;
}

export function ReviewQuestion({ question, number, review, expanded, onToggle, onSave, onValidate }: { question: Question; number: number; review?: QuestionReview; expanded: boolean; onToggle: () => void; onSave: (criterionId: string, score: number, justification: string) => void; onValidate: () => void }) {
  const manual = !!question.criteria?.length;
  const reviews = review ? { [question.id]: review } : {};
  const validated = isValidated(question, reviews);
  const score = questionScore(question, reviews);
  const correct = score === question.max;
  const changed = !!Object.keys(review?.criteria ?? {}).length;
  const aiTotal = question.criteria?.reduce((sum, criterion) => sum + criterion.aiScore, 0) ?? score;
  return <article id={question.id} className="abilities-question" tabIndex={-1} aria-label={`Question ${number}`}>
    <Card><div className="abilities-stack">
      <div className="abilities-question-meta"><Badge tone={manual ? validated ? "success" : "warning" : correct ? "success" : score > 0 ? "neutral" : "danger"} startIcon={manual && !validated ? <CircleAlert /> : (manual ? validated : correct) ? <Check /> : score > 0 ? <Minus /> : <X />}>Question {number}</Badge><span className="abilities-caption">{manual ? validated ? "Validated" : "Needs validation" : `${points(score)}/${points(question.max)} points`}</span><span className={manual ? "abilities-ai" : "abilities-caption"}>{manual ? <Bot size={13} /> : <CircleCheck size={13} />}{manual ? "AI evaluated" : "Auto-graded"}</span></div>
      <p>{question.prompt}</p>
      {question.options && <><span className="abilities-caption">Answer</span><div className={`abilities-options ${question.options.length === 3 ? "abilities-options--three" : ""}`}>{question.options.map(option => { const selected = question.answer === option; const right = question.correct === option; return <div className={`abilities-option ${selected ? right ? "is-correct" : "is-wrong" : right ? "is-key" : ""}`} key={option}>{selected ? right ? <CircleCheck size={16} /> : <X size={16} /> : <Circle size={16} />}<span>{option}</span><small>{selected && "Student’s answer"}{selected && right && <br />}{right && "Correct option"}</small></div>; })}</div></>}
      {question.kind === "grammar" && <div className="abilities-corrections"><div><span className="abilities-caption">Student’s correction</span><p>{question.correction || (question.answer === "Correct" ? "No correction provided." : "Student did not provide a correction.")}</p></div>{question.correct === "Incorrect" && <div><span className="abilities-caption">Correct answer</span><p>{question.correctedSentence}</p></div>}</div>}
      {question.kind === "gap" && <div className="abilities-corrections"><div><span className="abilities-caption">Student’s answer</span><p><mark className={correct ? "is-correct" : "is-wrong"}>{question.answer}</mark></p></div>{!correct && <div><span className="abilities-caption">Correct answer</span><p><mark className="is-key">{question.correct}</mark></p></div>}</div>}
      {question.segments && <div><span className="abilities-caption">Student’s answer</span><p className="abilities-fill">{question.segments.map((segment, i) => typeof segment === "string" ? segment : segment.answer === segment.correct ? <mark className="is-correct" key={i}>{segment.answer}</mark> : <Button variant="ghost" key={i} className="abilities-reveal" aria-label={`${segment.answer}. Correct answer: ${segment.correct}`}><mark className="is-wrong">{segment.answer}</mark><mark className="is-key">{segment.correct}</mark></Button>)}</p><span className="abilities-caption">Focus or hover over a wrong answer to reveal the correct word.</span></div>}
      {question.explanation && <p className="abilities-caption"><Bot size={13} />{question.explanation}</p>}
      {manual && <><span className="abilities-caption">Student’s answer</span>{question.audio ? <AssessmentAudio src={question.audio} label="Student recording" /> : <p className="abilities-student-answer">{question.answer}</p>}
        <section className={`abilities-rubric ${validated ? "is-validated" : ""}`} aria-label="Question correction">
          <div className="abilities-rubric-summary"><IconButton label={expanded ? "Collapse correction" : "Expand correction"} variant="ghost" icon={expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />} onClick={onToggle} aria-expanded={expanded} aria-controls={`${question.id}-criteria`} /><div><span className="abilities-ai"><Bot size={14} />AI suggested score</span><strong className={changed ? "abilities-strike" : ""}>{points(aiTotal)} / {points(question.max)} points</strong></div>{changed && <div><span className="abilities-caption">Teacher’s score</span><strong>{points(score)} / {points(question.max)} points</strong></div>}<div className="abilities-rubric-action"><Button size="small" variant={validated ? "secondary" : "primary"} disabled={validated} onClick={onValidate} startIcon={validated ? <Check size={14} /> : undefined}>{validated ? "Score validated" : "Validate score"}</Button></div></div>
          {expanded && <div id={`${question.id}-criteria`} className="abilities-rubric-body"><span className="abilities-ai"><Bot size={15} />AI correction</span>{question.criteria!.map(criterion => { const correction = review?.criteria[criterion.id]; return <section className="abilities-criterion" key={criterion.id}><div className="abilities-criterion-heading"><h3>{criterion.label}</h3><div className="abilities-actions"><CriterionDialog question={question} criterion={criterion} review={review} edit={false} onSave={onSave} /><CriterionDialog question={question} criterion={criterion} review={review} edit onSave={onSave} /></div></div><div className="abilities-criterion-feedback"><strong className={correction ? "abilities-strike" : ""}>{points(criterion.aiScore)} / {points(criterion.max)} points</strong><p>{criterion.explanation}</p></div>{correction && <div className="abilities-criterion-feedback"><strong>{points(correction.score)} / {points(criterion.max)} points</strong><p><span className="abilities-caption">Teacher’s correction · </span>{correction.justification}</p></div>}</section>; })}</div>}
        </section>
      </>}
    </div></Card>
  </article>;
}
