"use client";
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { CircleCheck, CircleMinus, Search, X } from 'lucide-react';
import { Badge, Button, Checkbox, DateRangePicker, Dialog, EmptyState, IconButton, Input, Switch } from '../../design-system';
import { CalendarFilterPopover, emptyCalendarFilters } from "../planner/CalendarFilterPopover";
import { matchesCalendarFilters, optionsFromClasses, type CalendarFilters } from "../planner/filter-model";
import { PlannerClassStatuses } from "../planner/status";
import { BulkApplicationResult } from "./BulkApplicationResult";
import type { LessonPlan } from './data';
import { classFingerprint, currentPlanLabel, levelWarning, unavailableReason, type Application, type ApplicationRequest, type ApplicationResult, type PlannerClass } from './bulk-planning';
import './bulk-planning.css';

export type BulkPlanningProps = {
  classes: PlannerClass[];
  applications: Application[];
  onApply: (plan: LessonPlan, requests: ApplicationRequest[]) => ApplicationResult[];
  onOpenClass: (id: string) => void;
};
const localDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const formatDate = (date: string) => date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unavailable';
const time = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export function BulkPlanningDialog({ plan, trigger, history = false, classes, applications, onApply, onOpenClass }: BulkPlanningProps & { plan: LessonPlan; trigger: ReactElement; history?: boolean }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'result' | 'history'>(history ? 'history' : 'select');
  const destinationsRef = useRef<HTMLElement>(null);
  useEffect(() => { if (destinationsRef.current) destinationsRef.current.scrollTop = 0; }, [step]);
  const [selected, setSelected] = useState<ApplicationRequest[]>([]);
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState('');
  const [until, setUntil] = useState('');
  const [filters, setFilters] = useState<CalendarFilters>(emptyCalendarFilters);
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [hideCanceled, setHideCanceled] = useState(false);
  const [results, setResults] = useState<ApplicationResult[]>([]);
  const visible = classes.filter(item => (!hideCanceled || item.classStatus !== "Canceled") && (selectedOnly ? selected.some(request => request.id === item.id) : (!from || item.date >= from) && (!until || item.date <= until) && item.title.toLowerCase().includes(query.trim().toLowerCase()) && matchesCalendarFilters(item, filters)))
    .sort((a, b) => a.date.localeCompare(b.date) || a.startMinutes - b.startMinutes);
  const selectable = visible.filter(item => !unavailableReason(item, plan));
  const allSelected = selectable.length > 0 && selectable.every(item => selected.some(request => request.id === item.id));
  const records = applications.filter(item => item.snapshot.sourceId === plan.id).slice().reverse();
  function choose(item: PlannerClass, checked: boolean) {
    if (!checked && selected.length === 1) setSelectedOnly(false);
    setSelected(current => checked ? [...current.filter(request => request.id !== item.id), { id: item.id, fingerprint: classFingerprint(item) }] : current.filter(request => request.id !== item.id));
  }
  function changeOpen(next: boolean) {
    setOpen(next);
    if (next) {
      const today = new Date(); const end = new Date(today); end.setDate(end.getDate() + 30);
      setFrom(localDate(today)); setUntil(localDate(end)); setQuery(''); setFilters(emptyCalendarFilters);
      setSelected([]); setResults([]); setSelectedOnly(false); setHideCanceled(false); setStep(history ? 'history' : 'select');
    }
  }
  function openClass(id: string) { setOpen(false); onOpenClass(id); }
  const footer = <>
    {step === 'select' && <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button disabled={!selected.length} onClick={() => { setResults(onApply(plan, selected)); setStep('result'); }}>{selected.length ? `Apply to ${selected.length} ${selected.length === 1 ? 'class' : 'classes'}` : 'Apply to classes'}</Button>
    </>}
    {step === 'result' && <>{results.some(result => !result.success) && <Button variant="outline" onClick={() => { setSelected(current => current.filter(request => results.some(result => result.id === request.id && !result.success))); setStep('select'); setSelectedOnly(true); }}>Try pending classes again</Button>}<Button variant="outline" onClick={() => setStep('history')}>View application history</Button><Button onClick={() => setOpen(false)}>Done</Button></>}
    {step === 'history' && <Button onClick={() => setOpen(false)}>Done</Button>}
  </>;
  return <Dialog open={open} onOpenChange={changeOpen} trigger={trigger} className="bulk-planning-dialog" title={step === 'history' ? 'Lesson plan applications' : step === 'result' ? 'Application result' : 'Apply lesson plan to classes'} description={step === 'history' ? 'See which classes received this lesson plan and open their planning details.' : step === 'result' ? 'See which classes received the lesson plan and access their planning.' : 'Select classes from your Planner and apply this lesson plan to them.'} footer={footer}>
    <div className="bulk-layout">
      <section ref={destinationsRef} className="bulk-destinations" aria-label={step === 'result' ? 'Application results' : 'Destination classes'}>
        {step === 'select' && <>
          <div className="bulk-list-toolbar">
          <div className="bulk-filter-bar">
            <Input aria-label="Search classes" placeholder="Search student or group" startIcon={<Search />} value={query} onChange={event => setQuery(event.target.value)} />
            <div className="bulk-period"><DateRangePicker label="Class period" value={{ from: from ? new Date(`${from}T12:00:00`) : undefined, to: until ? new Date(`${until}T12:00:00`) : undefined }} onValueChange={range => { setFrom(range?.from ? localDate(range.from) : ''); setUntil(range?.to ? localDate(range.to) : ''); }} presets={[7, 30, 90].map(days => { const start = new Date(); start.setHours(12, 0, 0, 0); const end = new Date(start); end.setDate(end.getDate() + days); return { label: `Next ${days} days`, value: { from: start, to: end } }; })} /></div>
            <CalendarFilterPopover filters={filters} onApply={setFilters} options={optionsFromClasses(classes)} />
          </div>
          <div className="bulk-selection-bar"><label><Checkbox aria-label="Select all eligible classes" checked={allSelected ? true : selectable.some(item => selected.some(request => request.id === item.id)) ? 'indeterminate' : false} disabled={!selectable.length} onCheckedChange={checked => { if (!checked) setSelectedOnly(false); const ids = new Set(selectable.map(item => item.id)); setSelected(current => checked ? [...current.filter(request => !ids.has(request.id)), ...selectable.map(item => ({ id: item.id, fingerprint: classFingerprint(item) }))] : current.filter(request => !ids.has(request.id))); }} />Select all eligible classes ({selectable.length})</label><div className="bulk-selection-actions"><label className="bulk-hide-canceled" htmlFor={`bulk-hide-canceled-${plan.id}`}><Switch id={`bulk-hide-canceled-${plan.id}`} checked={hideCanceled} onChange={event => setHideCanceled(event.target.checked)} />Hide canceled classes</label>{selected.length > 0 && <Badge tone="info" className={`bulk-selected-badge ${selectedOnly ? 'is-active' : ''}`}>
              <Button variant="ghost" size="mini" aria-pressed={selectedOnly} aria-label={selectedOnly ? 'Show all classes' : `View ${selected.length} selected classes`} onClick={() => setSelectedOnly(value => !value)}>{selected.length} selected</Button>
              <IconButton variant="ghost" size="mini" label="Clear selected classes" title="Clear selected classes" icon={<X />} onClick={() => { setSelected([]); setSelectedOnly(false); }} />
            </Badge>}</div></div>
          </div>
          {!visible.length && <EmptyState title="No classes found" description="Change the date range or planning filter. Only classes already in the Planner appear here." />}
          <div className="bulk-class-list bulk-class-list--compact">{visible.map(item => {
            const reason = unavailableReason(item, plan); const warning = levelWarning(item, plan);
            const Row = reason ? 'div' : 'label';
            const alreadyApplied = reason === 'This version is already applied.';
            return <Row aria-disabled={reason ? true : undefined} className={`bulk-class bulk-class--compact ${reason ? 'is-unavailable' : selected.some(request => request.id === item.id) ? 'is-selected' : ''}`} key={item.id}>
              {reason ? <span className="bulk-class-unavailable-icon" aria-hidden="true">{alreadyApplied ? <CircleCheck size={16} /> : <CircleMinus size={16} />}</span> : <Checkbox aria-label={`Select ${item.title} on ${item.date} at ${time(item.startMinutes)}`} checked={selected.some(request => request.id === item.id)} onCheckedChange={checked => choose(item, checked === true)} />}
              <div>
                <div className="bulk-class-overview"><strong title={item.title}>{item.title}</strong><PlannerClassStatuses className="bulk-class-statuses" classStatus={item.classStatus} planningStatus={item.status} /></div>
                <p className="bulk-class-meta" title={`${formatDate(item.date)} · ${time(item.startMinutes)}–${time(item.startMinutes + item.duration)} · ${currentPlanLabel(item)}`}><span>{formatDate(item.date)} · {time(item.startMinutes)}–{time(item.startMinutes + item.duration)}</span><span aria-hidden="true"> · </span><span>{currentPlanLabel(item)}</span></p>
                {(reason || warning) && <small className={reason ? 'bulk-class-unavailable-reason' : 'bulk-warning'}>{reason ? alreadyApplied ? 'Already applied · No changes needed' : `Unavailable · ${reason}` : warning}</small>}
              </div>
            </Row>;
          })}</div>
        </>}
        {step === 'result' && <BulkApplicationResult results={results} classes={classes} planTitle={plan.title} onOpenClass={openClass} />}
        {step === 'history' && <><h3>Application history</h3><p>One record per class and applied version. Applied does not mean taught.</p>{!records.length && <EmptyState title="No applications yet" />}{records.map(record => { const item = classes.find(candidate => candidate.id === record.eventId); return <article className="bulk-class" key={record.id}><div><strong>{item?.title ?? record.classTitle}</strong><p>{formatDate(item?.date ?? record.date)} · {time(item?.startMinutes ?? record.startMinutes)}</p><small>Version {formatDate(record.snapshot.sourceVersion)} · Applied {new Date(record.appliedAt).toLocaleString('en-US')} · Browser test</small><div className="bulk-tags"><Badge tone="success">Applied</Badge>{item?.planId !== record.snapshot.id && <Badge>Previous application</Badge>}</div></div><Button size="small" variant="outline" disabled={!item} onClick={() => openClass(record.eventId)}>Open in Planner</Button></article>; })}</>}
      </section>
    </div>
  </Dialog>;
}
