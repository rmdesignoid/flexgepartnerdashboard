import { Calendar1, CalendarClock, CalendarSync, CalendarX2, CalendarDays, UserRoundX, BookOpen, BookOpenText, BookOpenCheck, BookCheck } from 'lucide-react';
export type EventStatus = "To Plan" | "Planning" | "Planned" | "Taught";
export type ClassStatus = "Scheduled" | "Reschedule pending" | "Rescheduled" | "Student no-show" | "Canceled";
const statusSlug = (status: string) => status.toLowerCase().replace(/\s+/g, "-");
export const classStatusConfig: Record<ClassStatus, { Icon: typeof CalendarDays; tone: string }> = {
  Scheduled: { Icon: Calendar1, tone: "scheduled" },
  "Reschedule pending": { Icon: CalendarClock, tone: "reschedule-pending" },
  Rescheduled: { Icon: CalendarSync, tone: "rescheduled" },
  "Student no-show": { Icon: UserRoundX, tone: "student-no-show" },
  Canceled: { Icon: CalendarX2, tone: "canceled" },
};

export function ClassStatusIndicator({ status, showLabel = false }: { status?: ClassStatus; showLabel?: boolean }) {
  if (!status) return null;
  const { Icon, tone } = classStatusConfig[status];
  const label = status === "Student no-show" ? "No-show" : status;
  return (
    <span className={`class-status class-status--${tone}`} title={label} aria-label={`Class status: ${label}`}>
      <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
      {showLabel ? <span>{label}</span> : null}
    </span>
  );
}

export function PlanningStatusIndicator({ status }: { status: EventStatus }) {
  const { Icon } = planningStatusConfig[status];
  return (
    <span className={`planning-status-icon planning-status-icon--${statusSlug(status)}`} title={status} aria-label={`Planning status: ${status}`}>
      <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
    </span>
  );
}

const planningStatusConfig: Record<EventStatus, { Icon: typeof BookOpen }> = {
  "To Plan": { Icon: BookOpen },
  Planning: { Icon: BookOpenText },
  Planned: { Icon: BookOpenCheck },
  Taught: { Icon: BookCheck },
};

export function PlanningStatusBadge({ status }: { status: EventStatus }) {
  return <span className={`planning-status planning-status--${statusSlug(status)}`}><PlanningStatusIndicator status={status} />{status}</span>;
}


export function PlannerClassStatuses({ classStatus, planningStatus, className = "" }: { classStatus?: string; planningStatus: string; className?: string }) {
  const classValue = Object.keys(classStatusConfig).includes(classStatus ?? "Scheduled") ? (classStatus ?? "Scheduled") as ClassStatus : undefined;
  const planValue = Object.keys(planningStatusConfig).includes(planningStatus) ? planningStatus as EventStatus : "To Plan";
  return <div className={`event-card__statuses ${className}`}>
    <ClassStatusIndicator status={classValue} showLabel />
    <span className={`planning-status-label planning-status-label--${statusSlug(planValue)}`} title={planValue}><PlanningStatusIndicator status={planValue} /><span>{planValue}</span></span>
  </div>;
}
