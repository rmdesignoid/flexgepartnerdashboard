"use client";
/* eslint-disable @next/next/no-img-element -- Official Figma SVGs retain their native dimensions. */
import { CalendarPlus } from "lucide-react";
import { LessonPlanSummary } from "./LessonPlanSummary";
import { BulkPlanningDialog, type BulkPlanningProps } from "./BulkPlanningDialog";
import { useState } from "react";
import { AlertDialog, Button, Badge, DropdownMenu, EmptyState, IconButton, Input, Pagination, Popover, Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs } from "../../design-system";
import { exampleLessonPlans, visibleLessonPlans, type LessonPlan, type PlanFilters, type PlanSort } from "./data";
import "./lesson-plans.css";

const assetRoot = "/lesson-plans/";
const asset = (name: string) => <img src={`${assetRoot}${name}.svg`} alt="" aria-hidden="true" />;
const options = (key: "levels" | "grammars" | "tags") => [...new Set(exampleLessonPlans.flatMap(plan => plan[key]))].sort();
const emptyFilters: PlanFilters = { query: "", level: "", grammar: "", tag: "" };
const updatedDate = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function LessonPlansView({ darkMode = false, ...bulkProps }: { darkMode?: boolean } & BulkPlanningProps) {
  const [plans, setPlans] = useState(exampleLessonPlans);
  const [tab, setTab] = useState("library");
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState<PlanSort>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [notice, setNotice] = useState("");
  const filtered = visibleLessonPlans(plans, filters, sort);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function changeFilter(key: keyof PlanFilters, value: string) { setFilters(current => ({ ...current, [key]: value })); setPage(1); }
  function toggleSort(key: PlanSort["key"]) { setSort(current => ({ key, direction: current?.key === key && current.direction === "ascending" ? "descending" : "ascending" })); setPage(1); }
  async function copyPlan(plan: LessonPlan) {
    try { await navigator.clipboard.writeText(`${plan.title}\n${plan.goal}\nLevels: ${plan.levels.join(", ")}\nGrammar: ${plan.grammars.join(", ")}`); setNotice(`${plan.title} copied.`); }
    catch { setNotice("Could not copy this lesson plan. Please try again."); }
  }
  return <div className="lesson-plans ds-root" data-theme={darkMode ? "dark" : "light"}>
    <header className="lesson-plans-header"><div><h1>My Lesson Plans</h1><p>Create, organize, and manage lesson plans for your classes.</p></div><div className="lesson-plans-header-actions">
      <Popover label="Notifications" align="end" trigger={<IconButton size="mini" variant="ghost" label="Notifications" icon={asset("imgIconWrapper")} />}><EmptyState title="No new notifications" /></Popover>
      <DropdownMenu label="List preferences" align="end" trigger={<IconButton size="mini" variant="ghost" label="List preferences" icon={asset("imgIconWrapper1")} />} items={[2, 10, 20].map(size => ({ id: `page-size-${size}`, label: `${size} plans per page${pageSize === size ? " (selected)" : ""}`, onSelect: () => { setPageSize(size); setPage(1); } }))} />
    </div></header>
    <div className="lesson-plans-tabs"><Tabs label="Lesson plan collections" value={tab} onChange={value => { setTab(value); setNotice(""); }} items={[{ value: "library", label: "Lesson Plans Library", startIcon: asset("imgIconGalleryThumbnails") }, { value: "sequence", label: "Lesson Plan Sequence", startIcon: asset("imgIconGalleryVertical") }]} /></div>
    {tab === "library" ? <>
      <div className="lesson-plans-filters"><div className="lesson-plans-search"><Input aria-label="Search lesson plans by name" placeholder="Search by name" value={filters.query} endIcon={asset("imgDecorationRight")} onChange={event => changeFilter("query", event.target.value)} /></div>
        <div className="lesson-plans-level"><Select aria-label="Filter by level" size="small" startIcon={asset("imgSelectLeftDecoration")} value={filters.level} onChange={event => changeFilter("level", event.target.value)}><option value="">All Levels</option>{options("levels").map(value => <option key={value}>{value}</option>)}</Select></div>
        <div className="lesson-plans-topic"><Select aria-label="Filter by grammar topic" size="small" startIcon={asset("imgSelectLeftDecoration1")} value={filters.grammar} onChange={event => changeFilter("grammar", event.target.value)}><option value="">All Grammar Topics</option>{options("grammars").map(value => <option key={value}>{value}</option>)}</Select></div>
        <div className="lesson-plans-topic"><Select aria-label="Filter by tag" size="small" startIcon={asset("imgSelectLeftDecoration")} value={filters.tag} onChange={event => changeFilter("tag", event.target.value)}><option value="">All Tags</option>{options("tags").map(value => <option key={value}>{value}</option>)}</Select></div>
      </div>
      <div className="lesson-plans-list">{rows.length ? <Table aria-label="Lesson plans library" className="lesson-plans-table"><TableHeader><TableRow><TableHead sortDirection={sort?.key === "title" ? sort.direction : "none"} onSort={() => toggleSort("title")}>Lesson Plan</TableHead><TableHead sortDirection={sort?.key === "status" ? sort.direction : "none"} onSort={() => toggleSort("status")}>Status</TableHead><TableHead align="right">Actions</TableHead></TableRow></TableHeader><TableBody>{rows.map(plan => <TableRow key={plan.id}><TableCell><LessonPlanSummary plan={plan} /></TableCell><TableCell><div className="lesson-plan-status"><div className="lesson-plan-status-line"><Badge tone={plan.status === "Published" ? "success" : "neutral"}>{plan.status}</Badge><BulkPlanningDialog {...bulkProps} plan={plan} history trigger={<Button variant="ghost" size="mini" className="lesson-plan-applications">{bulkProps.applications.filter(item => item.snapshot.sourceId === plan.id).length} applications</Button>} /></div><span className="lesson-plan-updated">Last updated: {updatedDate(plan.updatedAt)}</span></div></TableCell><TableCell align="right"><div className="lesson-plan-actions"><BulkPlanningDialog {...bulkProps} plan={plan} trigger={<IconButton size="small" variant="ghost" label={`Apply ${plan.title} to classes`} icon={<CalendarPlus />} disabled={plan.status !== "Published"} title={plan.status !== "Published" ? "Publish this plan before applying it" : "Apply to classes"} />} /><IconButton variant="ghost" size="small" label={`Edit ${plan.title}`} title="Edit lesson plan" icon={asset("imgIconWrapper3")} disabled /><IconButton variant="ghost" size="small" label={`Copy ${plan.title}`} title="Copy lesson plan" icon={asset("imgIconWrapper4")} onClick={() => void copyPlan(plan)} /><AlertDialog title="Remove lesson plan?" description={`Remove “${plan.title}” from this list?`} actionLabel="Remove" destructive onConfirm={() => { setPlans(current => current.filter(item => item.id !== plan.id)); setNotice(`${plan.title} removed from this list.`); }} trigger={<IconButton variant="ghost" size="small" label={`Remove ${plan.title}`} title="Remove lesson plan" icon={asset("imgIconWrapper5")} />} /></div></TableCell></TableRow>)}</TableBody></Table> : <div className="lesson-plans-empty"><EmptyState title={plans.length ? "No matching lesson plans" : "No lesson plans yet"} description={plans.length ? "Try a different search or clear your filters." : "Your saved lesson plans will appear here."} action={plans.length ? <Button variant="outline" size="small" onClick={() => { setFilters(emptyFilters); setPage(1); }}>Clear filters</Button> : undefined} /></div>}</div>
      <footer className="lesson-plans-footer"><span>Showing {rows.length} of {filtered.length}</span><Pagination pageCount={pageCount} page={currentPage} onPageChange={setPage} /></footer>
    </> : <div className="lesson-plans-empty"><EmptyState title="No lesson plan sequences yet" description="Your lesson plan sequences will appear here." /></div>}
    <p className="lesson-plans-notice" role="status">{notice}</p>
  </div>;
}
