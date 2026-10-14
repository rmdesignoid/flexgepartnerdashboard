"use client";
import "./calendar-filters.css";
import { useState } from 'react';
import { Users, User, GraduationCap, CalendarDays, BookOpen, ListFilter, ChevronDown, Check } from 'lucide-react';
import { Popover } from '../../design-system';
import { type CalendarFilters, type FilterOptions, defaultFilterOptions } from './filter-model';
export const emptyCalendarFilters: CalendarFilters = { group: [], teacher: [], student: [], classStatus: [], planningStatus: [] };

function CalendarFilterSelect({ icon: Icon, label, value, options, onChange }: { icon: typeof Users; label: string; value: string[]; options: string[]; onChange: (value: string[]) => void }) {
  const displayValue = !value.length ? label : value.length === 1 ? value[0] : `${value.length} selected`;
  const toggleOption = (option: string) => onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  return <Popover onOpenAutoFocus={event => event.preventDefault()} trigger={<button className="calendar-filter-select" type="button" aria-label={label}><Icon size={17} aria-hidden="true" /><span>{displayValue}</span><ChevronDown size={17} aria-hidden="true" /></button>} label={label} className="calendar-filter-options" side="bottom" align="start"><div role="listbox" aria-label={label} aria-multiselectable="true"><button type="button" role="option" aria-selected={!value.length} className={!value.length ? "is-selected" : ""} onClick={() => onChange([])}><span className="calendar-filter-options__check" aria-hidden="true">{!value.length ? <Check size={13} /> : null}</span>{label}</button>{options.map((option) => <button key={option} type="button" role="option" aria-selected={value.includes(option)} className={value.includes(option) ? "is-selected" : ""} onClick={() => toggleOption(option)}><span className="calendar-filter-options__check" aria-hidden="true">{value.includes(option) ? <Check size={13} /> : null}</span>{option}</button>)}</div></Popover>;
}

export function CalendarFilterPopover({ filters, onApply, options = defaultFilterOptions }: { filters: CalendarFilters; onApply: (filters: CalendarFilters) => void; options?: FilterOptions }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filters);
  const selectedCount = Object.values(filters).flat().length;
  const update = (key: keyof CalendarFilters, value: string[]) => setDraft((current) => ({ ...current, [key]: value }));
  const reset = () => { setDraft(emptyCalendarFilters); onApply(emptyCalendarFilters); };
  const apply = () => { onApply(draft); setOpen(false); };
  return <Popover open={open} onOpenChange={(next) => { if (next) setDraft(filters); setOpen(next); }} trigger={<button className={`outline-button calendar-filter-button${selectedCount ? " is-active" : ""}`} type="button"><ListFilter size={16} strokeWidth={1.8} />Filter{selectedCount ? <span>{selectedCount}</span> : null}</button>} className="calendar-filter-menu" side="bottom" align="end" label="Filter lessons"><div className="calendar-filter-groups"><section className="calendar-filter-group" aria-label="People"><h2 >People</h2><CalendarFilterSelect icon={Users} label="All Groups" value={draft.group} options={options.group} onChange={(value) => update("group", value)} /><CalendarFilterSelect icon={User} label="All Teachers" value={draft.teacher} options={options.teacher} onChange={(value) => update("teacher", value)} /><CalendarFilterSelect icon={GraduationCap} label="All Students" value={draft.student} options={options.student} onChange={(value) => update("student", value)} /></section><section className="calendar-filter-group" aria-label="Class status"><h2 >Class status</h2><CalendarFilterSelect icon={CalendarDays} label="All Class Status" value={draft.classStatus} options={["Scheduled", "Rescheduled", "Canceled", "Student no-show"]} onChange={(value) => update("classStatus", value)} /><CalendarFilterSelect icon={BookOpen} label="All Planning Status" value={draft.planningStatus} options={["To Plan", "Planning", "Planned", "Taught"]} onChange={(value) => update("planningStatus", value)} /></section></div><div className="calendar-filter-menu__actions"><button type="button" onClick={reset}>Clear Filter</button><button type="button" onClick={apply}>Apply</button></div></Popover>;
}
