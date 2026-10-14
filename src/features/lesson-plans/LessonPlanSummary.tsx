/* eslint-disable @next/next/no-img-element -- Shared official thumbnail and metadata assets. */
import { Badge } from '../../design-system';
import type { LessonPlan } from './data';
import './lesson-plan-summary.css';

export function LessonPlanSummary({ plan, layout = 'row', showStatus = false }: { plan: LessonPlan; layout?: 'row' | 'preview'; showStatus?: boolean }) {
  const Heading = layout === 'preview' ? 'h3' : 'h2';
  return <div className={`lesson-plan-detail lesson-plan-summary--${layout}`}>
    <div className="lesson-plan-thumbnail"><img src="/lesson-plans/imgIcon.svg" width={20} height={20} alt="" aria-hidden="true" /></div>
    <div className="lesson-plan-content">
      <Heading>{plan.title}</Heading>
      <p title={plan.goal}>{plan.goal}</p>
      <div className="lesson-plan-metadata">
        <div className="lesson-plan-tags" aria-label="Levels and grammar topics">
          {plan.levels.map(level => <Badge key={level}>{level}</Badge>)}
          <img src="/lesson-plans/imgIcon1.svg" width={12} height={12} alt="" aria-hidden="true" />
          {plan.grammars.map(grammar => <Badge key={grammar}>{grammar}</Badge>)}
        </div>
        <div className="lesson-plan-tags lesson-plan-curriculum" aria-label="Tags">{plan.tags.map(tag => <Badge tone="info" key={tag}>{tag}</Badge>)}</div>
      </div>
      {showStatus && <div className="lesson-plan-summary-status"><Badge tone={plan.status === 'Published' ? 'success' : 'neutral'}>{plan.status}</Badge><span>Last updated: {new Date(`${plan.updatedAt}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>}
    </div>
  </div>;
}
