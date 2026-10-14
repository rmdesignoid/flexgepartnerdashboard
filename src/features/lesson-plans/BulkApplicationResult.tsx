import { CheckCircle2, AlertTriangle, BookOpen, Search } from 'lucide-react';
import { useState } from 'react';
import { Button, Input, EmptyState } from '../../design-system';
import { PlannerClassStatuses } from '../planner/status';
import type { ApplicationResult, PlannerClass } from './bulk-planning';

const formatDate = (date: string) => date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unavailable class';
const time = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export function BulkApplicationResult({ results, classes, planTitle, onOpenClass }: { results: ApplicationResult[]; classes: PlannerClass[]; planTitle: string; onOpenClass: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const completed = results.filter(result => result.success);
  const pending = results.filter(result => !result.success);
  const matches = (result: ApplicationResult) => result.title.toLowerCase().includes(query.trim().toLowerCase());
  const visibleCompleted = completed.filter(matches);
  const visiblePending = pending.filter(matches);
  const Icon = pending.length ? AlertTriangle : CheckCircle2;
  return <div className="bulk-result">
    <div className="bulk-result-toolbar">
      <div className={`bulk-result-summary${pending.length ? ' bulk-result-summary--pending' : ''}`} role="status">
        <span className="bulk-result-icon"><Icon size={24} aria-hidden="true" /></span>
        <div><h3>{!completed.length ? 'Lesson plan not applied' : pending.length ? 'Lesson plan applied with pending classes' : 'Lesson plan applied successfully'}</h3>
          <p>{completed.length > 0 ? `“${planTitle}” is ready in ${completed.length} ${completed.length === 1 ? 'class' : 'classes'}.` : 'No class planning was changed.'}{pending.length > 0 && ` ${pending.length} ${pending.length === 1 ? 'class remains' : 'classes remain'} unchanged.`}</p>
        </div>
      </div>
      <div className="bulk-result-heading"><h3>Destination classes <span>({results.length})</span></h3>{results.length > 5 && <Input aria-label="Search application results" placeholder="Search classes" startIcon={<Search />} value={query} onChange={event => setQuery(event.target.value)} />}</div>
    </div>
    {visibleCompleted.length > 0 && <section aria-label="Classes with applied planning"><h4 className="bulk-result-group-title">Applied ({completed.length})</h4><div className="bulk-result-list">{visibleCompleted.map(result => {
      const item = classes.find(candidate => candidate.id === result.id);
      return <article className="bulk-result-row" key={result.id}>
        <CheckCircle2 className="bulk-result-row-icon" size={18} aria-hidden="true" />
        <div className="bulk-result-class"><strong>{result.title}</strong><p>{formatDate(result.date)}{item && ` · ${time(item.startMinutes)}–${time(item.startMinutes + item.duration)}`}</p><PlannerClassStatuses classStatus={item?.classStatus} planningStatus={item?.status ?? 'Planned'} />{!item && <small>This class is no longer available in the Planner.</small>}</div>
        <Button size="small" variant="outline" startIcon={<BookOpen />} disabled={!item} aria-label={`View planning for ${result.title}`} onClick={() => onOpenClass(result.id)}>View planning</Button>
      </article>;
    })}</div></section>}
    {visiblePending.length > 0 && <section aria-label="Classes not updated"><h4 className="bulk-result-group-title">Needs attention ({pending.length})</h4><div className="bulk-result-list">{visiblePending.map(result => <article className="bulk-result-row bulk-result-row--pending" key={result.id}><AlertTriangle className="bulk-result-row-icon" size={18} aria-hidden="true" /><div className="bulk-result-class"><strong>{result.title}</strong><p>{formatDate(result.date)}</p><small>{result.message}</small></div></article>)}</div></section>}
    {!visibleCompleted.length && !visiblePending.length && <EmptyState title="No matching classes" description="Try another class name." />}
  </div>;
}
