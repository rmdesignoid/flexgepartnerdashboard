"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type LessonDetails = {
  name: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  goal: string;
  grammars: string[];
  summary: string;
  teachers: string[];
  participants: { name: string; email?: string }[];
  observation?: string;
};

export function LessonLogDetailsDialog({ lesson, index, total, onClose, onPrevious, onNext }: {
  lesson: LessonDetails;
  index: number;
  total: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, []);
  useEffect(() => { bodyRef.current?.scrollTo({ top: 0 }); }, [index]);

  return <dialog ref={dialogRef} className="lesson-details" aria-labelledby="lesson-details-title" aria-describedby="lesson-details-date" onCancel={(event) => { event.preventDefault(); onClose(); }} onPointerDown={(event) => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>
    <header className="lesson-details__header">
      <div><p className="lesson-details__eyebrow">Lesson details</p><h2 id="lesson-details-title">{lesson.name}</h2><p id="lesson-details-date" className="lesson-details__date">{lesson.date} · {lesson.time} · {lesson.duration} min</p></div>
      <button type="button" className="lesson-details__close" onClick={onClose} aria-label="Close lesson details"><X size={18} /></button>
      <span className={`lesson-log-status is-${lesson.status.toLowerCase().replaceAll(" ", "-")}`}>{lesson.status}</span>
    </header>
    <div ref={bodyRef} className="lesson-details__body">
      <section className="lesson-details__section"><h3>Lesson goal</h3><p>{lesson.goal && lesson.goal !== "—" ? lesson.goal : "No lesson goal recorded."}</p></section>
      <section className="lesson-details__section"><h3>Grammars</h3>{lesson.grammars.length ? <div className="lesson-details__badges">{lesson.grammars.map((grammar) => <span key={grammar}>{grammar}</span>)}</div> : <p className="lesson-details__empty">No grammar topics recorded.</p>}</section>
      <section className="lesson-details__section"><h3>Lesson summary</h3><p className="lesson-details__summary">{lesson.summary || "No lesson summary recorded."}</p></section>
      {lesson.observation?.trim() ? <section className="lesson-details__section"><h3>Observation</h3><p>{lesson.observation}</p></section> : null}
      <div className="lesson-details__support">
        <section className="lesson-details__section"><h3>Teacher</h3><p>{lesson.teachers.join(", ") || "No teacher assigned"}</p></section>
        <section className="lesson-details__section"><h3 id="lesson-details-students">Students <span className="lesson-details__count">{lesson.participants.length}</span></h3><div className="lesson-details__table-wrap"><table className="lesson-details__students" aria-labelledby="lesson-details-students"><thead><tr><th scope="col">Student</th><th scope="col">Email</th></tr></thead><tbody>{lesson.participants.length ? lesson.participants.map((person) => <tr key={person.email || person.name}><td>{person.name}</td><td className={!person.email ? "lesson-details__empty" : undefined}>{person.email || "—"}</td></tr>) : <tr><td colSpan={2} className="lesson-details__empty">No students recorded.</td></tr>}</tbody></table></div></section>
      </div>
    </div>
    <footer className="lesson-details__footer"><div className="lesson-details__navigation"><button type="button" onClick={onPrevious} disabled={index <= 0} aria-label="Previous lesson"><ChevronLeft size={16} /></button><span>{index + 1} of {total} lessons</span><button type="button" onClick={onNext} disabled={index >= total - 1} aria-label="Next lesson"><ChevronRight size={16} /></button></div><button type="button" className="outline-button" onClick={onClose}>Close</button></footer>
  </dialog>;
}
