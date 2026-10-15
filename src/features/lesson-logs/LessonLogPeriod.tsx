"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import "./lesson-logs.css";

export function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function periodDates(days: number) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);
  return [localDateKey(start), localDateKey(end)] as const;
}

export function LessonLogPeriod({ from, to, preset, onChange }: { from: string; to: string; preset: string; onChange: (from: string, to: string, preset: string) => void }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => new Date(`${from || localDateKey(new Date())}T12:00:00`));
  const [anchor, setAnchor] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const start = anchor && hover ? [anchor, hover].sort()[0] : anchor || from;
  const end = anchor && hover ? [anchor, hover].sort()[1] : anchor ? anchor : to;
  const format = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  function selectDay(key: string) {
    if (!anchor) { setAnchor(key); setHover(null); }
    else { const [a, b] = [anchor, key].sort(); onChange(a, b, "Custom period"); setAnchor(null); setHover(null); setOpen(false); }
  }
  return <Popover.Root open={open} onOpenChange={(value) => { setOpen(value); setAnchor(null); setHover(null); }}>
    <Popover.Trigger asChild><button type="button" className="lesson-period-trigger" aria-label={`Date range: ${preset}`}><CalendarDays size={16} /><span>{preset === "Custom period" ? `${format(from)} – ${format(to)}` : preset}</span><ChevronDown size={16} /></button></Popover.Trigger>
    <Popover.Portal><Popover.Content className="lesson-period-popover" align="start" sideOffset={4} collisionPadding={12}>
      <div className="lesson-period-presets">{[30, 60, 90, 0].map((days) => <button type="button" key={days} aria-pressed={preset === (days ? `Last ${days} days` : "All time")} onClick={() => { const [a, b] = days ? periodDates(days) : ["", ""]; onChange(a, b, days ? `Last ${days} days` : "All time"); if(a) setMonth(new Date(`${a}T12:00:00`)); setOpen(false); }}>{days ? `Last ${days} days` : "All time"}</button>)}</div>
      <div className="lesson-period-calendars" aria-label="Choose start and end dates">
        {[0, 1].map((offset) => {
          const first = new Date(month.getFullYear(), month.getMonth() + offset, 1);
          const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
          const cells = Math.ceil((first.getDay() + days) / 7) * 7;
          return <section className="lesson-period-month" key={offset}><header>
            {offset === 0 ? <button type="button" className="icon-button" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={16} /></button> : <span />}
            <strong>{first.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</strong>
            {offset === 1 ? <button type="button" className="icon-button" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={16} /></button> : <span />}
          </header><div className="lesson-period-grid">{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day}>{day}</span>)}{Array.from({length: cells}, (_, i) => {
            const date = new Date(first.getFullYear(), first.getMonth(), i - first.getDay() + 1);
            const key = localDateKey(date), outside = date.getMonth() !== first.getMonth(), selected = !outside && !!start && !!end && key >= start && key <= end;
            return <button type="button" key={key} disabled={outside} className={`${selected ? "is-range" : ""} ${selected && (key === start || key === end) ? "is-endpoint" : ""}`} aria-label={date.toLocaleDateString("en-US", {month:"long",day:"numeric",year:"numeric"})} aria-pressed={selected} onMouseEnter={() => anchor && setHover(key)} onFocus={() => anchor && setHover(key)} onClick={() => selectDay(key)}>{date.getDate()}</button>;
          })}</div></section>;
        })}
      </div>
      <span className="lesson-period-hint" role="status">{anchor ? "Choose the end date" : "Choose a start date, then an end date"}</span>
    </Popover.Content></Popover.Portal>
  </Popover.Root>;
}
