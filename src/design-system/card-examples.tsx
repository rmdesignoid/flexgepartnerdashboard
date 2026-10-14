"use client";
import { useId } from "react";
import { FileText } from "lucide-react";
import { Badge, Button, Card, IconSlot, StatusBadge } from ".";

type ExampleProps = { onAction?: (action: string) => void };
export function LessonPlanCardExample({ onAction }: ExampleProps) {
  const titleId = useId();
  return <Card className="ds-doc-card" aria-labelledby={titleId} header={<div className="ds-doc-card-heading"><div><h3 id={titleId}>Lesson plan</h3><p>Review the class details before teaching.</p></div><StatusBadge status="Planned" /></div>} footer={<div className="ds-doc-card-actions"><Button variant="outline" size="small" onClick={() => onAction?.("View plan")}>View plan</Button><Button size="small" onClick={() => onAction?.("Edit plan")}>Edit plan</Button></div>}><dl className="ds-doc-card-details"><div><dt>Student</dt><dd>Ana Martins</dd></div><div><dt>Level</dt><dd>A1 · Beginner</dd></div><div><dt>Date & time</dt><dd>Oct 14, 2026 · 10:00 AM</dd></div><div><dt>Duration</dt><dd>50 minutes</dd></div></dl></Card>;
}
export function LessonResourcesCardExample({ onAction }: ExampleProps) {
  const titleId = useId();
  return <Card className="ds-doc-card" aria-labelledby={titleId} header={<div className="ds-doc-card-heading"><div><h3 id={titleId}>Lesson resources</h3><p>Materials attached to this lesson.</p></div><Badge>2 resources</Badge></div>} footer={<div className="ds-doc-card-actions"><Button variant="outline" size="small" onClick={() => onAction?.("Browse resources")}>Browse resources</Button><Button size="small" onClick={() => onAction?.("Add resource")}>Add resource</Button></div>}><ul className="ds-doc-card-resources">{[{ title: "Daily routines", description: "Reading · A1 · 10 min" }, { title: "Introducing yourself", description: "Speaking · A1 · 15 min" }].map(resource => <li key={resource.title}><span className="ds-doc-card-resource-icon"><IconSlot size={20}><FileText /></IconSlot></span><div><strong>{resource.title}</strong><span>{resource.description}</span></div></li>)}</ul></Card>;
}
export function CardExamples(props: ExampleProps) {
  return <div className="ds-doc-card-examples"><LessonPlanCardExample {...props} /><LessonResourcesCardExample {...props} /></div>;
}
