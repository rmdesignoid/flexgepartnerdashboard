"use client";



import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { ArrowLeft, ArrowRight, Check, Copy, FileText, Folder, Moon, Search, Settings, Sun, UserRound, X } from "lucide-react";

import { IconSlot, Pagination, FilterSelect, Popover, Dialog, DialogClose, AlertDialog, DropdownMenu, ContextMenu, Combobox, MultiSelect, SegmentedControl as CoreSegmentedControl, ToggleGroup, DatePicker, DateRangePicker, Breadcrumb, type MenuItem, Checkbox, Radio, Switch, Slider, Progress, Separator, Skeleton, Spinner, Label, Toggle, LinkButton, Avatar, AvatarStack, Badge, Button, EmptyState, FormField, IconButton, Input, LoadingButton, SearchInput, Select, StatusBadge, Tabs, Textarea, Sonner, toast, ToastStack, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from ".";

import { foundationPages, type FoundationId, coreCatalog, componentFamilies, figmaFile, type CatalogEntry, type CoreName } from "./catalog";

import "./catalog.css";

import { CardExamples } from "./card-examples";
import { SidebarExamples } from "./sidebar-examples";
import { ColorFoundations } from "./color-foundations";
import { LogoFoundations } from "./logo-foundations";



type Size = "mini" | "small" | "regular" | "large";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "ghost-muted" | "destructive" | "accent";

const people = [{ name: "Ana Martins" }, { name: "Lucas Costa" }, { name: "Mariana Santos" }, { name: "Rafael Lima" }, { name: "Camila Rocha" }];

const peopleWithPhotos = [{ name: "Ana Martins", src: "/avatar-photo.png" }, { name: "Gabriel Santos", src: "/avatar-photo-gabriel.png" }, { name: "Mariana Costa", src: "/avatar-photo-mariana.png" }, { name: "Rafael Lima" }, { name: "Camila Rocha" }];



function ControlGroup({ label, children }: { label: string; children: ReactNode }) {

  return <fieldset className="catalog-control-group"><legend>{label}</legend><div className="catalog-control-items">{children}</div></fieldset>;

}

function SegmentedControl<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void }) {

  return <ControlGroup label={label}><CoreSegmentedControl label={label} value={value} items={options.map(option => ({ value: option, label: option }))} onValueChange={next => onChange(next as T)} /></ControlGroup>;

}

function ControlToggle({ children, pressed, onChange }: { children: ReactNode; pressed: boolean; onChange: (value: boolean) => void }) {

  return <Toggle size="small" variant="outline" pressed={pressed} onPressedChange={onChange}>{children}</Toggle>;

}

function DemoFrame({ controls, children }: { controls: ReactNode; children: ReactNode }) {

  return <><div className="catalog-controls" role="group" aria-label="Preview controls">{controls}</div><div className="catalog-preview"><div className="catalog-preview-content">{children}</div></div><p className="catalog-preview-notice">Live preview · imported core component</p></>;

}



function SonnerDemo() {

  const [type, setType] = useState("lines");

  const [levels, setLevels] = useState<1 | 2 | 3>(1);

  const [notice, setNotice] = useState("");

  const id = useId();

  const ids = useRef<Array<string | number>>([]);

  useEffect(() => { const active = ids.current; return () => { active.forEach(entry => toast.dismiss(entry)); }; }, []);

  const action = { label: "Undo", onClick: () => setNotice("Example action undone.") };

  function notify() {

    ids.current.forEach(entry => toast.dismiss(entry));

    ids.current = [];

    for (let index = 0; index < levels; index++) {

      const options = { toasterId: id, description: type === "lines" ? "Your changes have been saved." : undefined, action: type === "action" || type === "lines" ? action : undefined, duration: 6000 };

      ids.current.push(type === "loading" ? toast.loading("Saving changes…", { ...options, duration: 6000 }) : toast("Resource updated", { ...options, icon: type === "simple" ? null : undefined }));

    }

  }

  return <DemoFrame controls={<><ControlGroup label="Content"><Select aria-label="Notification content" size="small" value={type} onChange={event => setType(event.target.value)}><option value="simple">Simple</option><option value="loading">Loading</option><option value="action">Line and button</option><option value="lines">Lines and button</option></Select></ControlGroup><SegmentedControl label="Stack" value={String(levels)} options={["1", "2", "3"]} onChange={value => setLevels(Number(value) as 1 | 2 | 3)} /></>}><div className="catalog-sonner-demo"><ToastStack levels={levels} title={type === "loading" ? "Saving changes…" : "Resource updated"} loading={type === "loading"} icon={type === "simple" ? null : undefined} description={type === "lines" ? "Your changes have been saved." : undefined} action={type === "action" || type === "lines" ? action : undefined} /><div className="catalog-demo-row"><Button onClick={notify}>Show notification</Button><Button variant="outline" onClick={() => ids.current.forEach(entry => toast.dismiss(entry))}>Dismiss notifications</Button></div><span role="status">{notice}</span><Sonner id={id} /></div></DemoFrame>;

}

function TableDemo() {

  const [direction, setDirection] = useState<"none" | "ascending" | "descending">("none");

  const [selected, setSelected] = useState<string[]>([]);

  const [twoLines, setTwoLines] = useState(false);

  const [empty, setEmpty] = useState(false);

  const [notice, setNotice] = useState("");

  const people = [{ name: "Ana Martins", level: "A1", total: 12 }, { name: "Lucas Costa", level: "B1", total: 8 }, { name: "Mariana Santos", level: "A2", total: 10 }];

  const rows = empty ? [] : [...people].sort((a, b) => direction === "none" ? 0 : a.total - b.total);

  if (direction === "descending") rows.reverse();

  const all = rows.length > 0 && rows.every(row => selected.includes(row.name));

  const toggle = (name: string) => setSelected(previous => previous.includes(name) ? previous.filter(item => item !== name) : [...previous, name]);

  return <DemoFrame controls={<><SegmentedControl label="Lines" value={twoLines ? "2 lines" : "1 line"} options={["1 line", "2 lines"]} onChange={value => setTwoLines(value === "2 lines")} /><ControlGroup label="State"><ControlToggle pressed={empty} onChange={setEmpty}>Empty</ControlToggle></ControlGroup></>}><div className="catalog-table-demo"><div className="catalog-table-heading"><strong>Example students</strong><span role="status">{rows.filter(row => selected.includes(row.name)).length} of {rows.length} selected</span></div><Table aria-label="Example students"><TableCaption className="catalog-sr-only">Example students with learning level and class totals.</TableCaption><TableHeader><TableRow><TableHead className="ds-table-checkbox"><input type="checkbox" aria-label="Select all students" checked={all} disabled={!rows.length} onChange={() => setSelected(all ? [] : rows.map(row => row.name))} /></TableHead><TableHead>Student</TableHead><TableHead>Level</TableHead><TableHead align="right" sortDirection={direction} onSort={() => setDirection(direction === "ascending" ? "descending" : "ascending")}>Classes</TableHead><TableHead align="right">Actions</TableHead></TableRow></TableHeader><TableBody>{rows.map(row => <TableRow key={row.name} selected={selected.includes(row.name)}><TableCell className="ds-table-checkbox"><input type="checkbox" aria-label={`Select ${row.name}`} checked={selected.includes(row.name)} onChange={() => toggle(row.name)} /></TableCell><TableCell description={twoLines ? "Active student" : undefined}><span className="catalog-table-person"><Avatar name={row.name} size="tiny" />{row.name}</span></TableCell><TableCell><Badge>{row.level}</Badge></TableCell><TableCell align="right">{row.total}</TableCell><TableCell align="right"><Button variant="ghost" size="mini" aria-label={`View ${row.name}`} onClick={() => setNotice(`Viewing ${row.name} in this example.`)}>View</Button></TableCell></TableRow>)}{!rows.length && <TableRow><TableCell colSpan={5}><EmptyState title="No students found" description="The table keeps its headers when empty." /></TableCell></TableRow>}</TableBody></Table><span role="status">{notice}</span></div></DemoFrame>;

}



function SelectionDemo({ kind }: { kind: "Checkbox" | "Radio" | "Switch" }) {

  const [checked, setChecked] = useState<boolean | "indeterminate">(false);

  const [choice, setChoice] = useState("email");

  const [disabled, setDisabled] = useState(false);

  const [invalid, setInvalid] = useState(false);

  const id = useId();

  return <DemoFrame controls={<><ControlGroup label="State"><ControlToggle pressed={disabled} onChange={setDisabled}>Disabled</ControlToggle>{kind !== "Switch" && <ControlToggle pressed={invalid} onChange={setInvalid}>Error</ControlToggle>}{kind === "Checkbox" && <ControlToggle pressed={checked === "indeterminate"} onChange={value => setChecked(value ? "indeterminate" : false)}>Indeterminate</ControlToggle>}</ControlGroup></>}><div className="catalog-selection-demo">{kind === "Checkbox" ? <div className="catalog-selection-row"><Checkbox id={id} checked={checked} onCheckedChange={setChecked} disabled={disabled} invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined} /><Label htmlFor={id}>Receive updates</Label></div> : kind === "Switch" ? <div className="catalog-selection-row"><Switch id={id} checked={checked === true} onChange={event => setChecked(event.target.checked)} disabled={disabled} /><Label htmlFor={id}>Enable notifications</Label></div> : <fieldset className="catalog-radio-group"><legend>Notification channel</legend>{["email", "push"].map(value => <div className="catalog-selection-row" key={value}><Radio id={`${id}-${value}`} name={id} value={value} checked={choice === value} onChange={event => setChoice(event.target.value)} disabled={disabled} invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined} /><Label htmlFor={`${id}-${value}`}>{value === "email" ? "Email" : "Push"}</Label></div>)}</fieldset>}{invalid && <span id={`${id}-error`} className="ds-field__error">Review this selection.</span>}<span role="status">{kind === "Radio" ? `Channel: ${choice}` : checked === "indeterminate" ? "Partial selection" : checked ? "On" : "Off"}</span></div></DemoFrame>;

}

function SliderDemo() {

  const [values, setValues] = useState([50]);

  const [range, setRange] = useState(false);

  const [vertical, setVertical] = useState(false);

  const [disabled, setDisabled] = useState(false);

  return <DemoFrame controls={<><SegmentedControl label="Mode" value={range ? "range" : "single"} options={["single", "range"]} onChange={value => { setRange(value === "range"); setValues(value === "range" ? [35, 65] : [50]); }} /><SegmentedControl label="Orientation" value={vertical ? "vertical" : "horizontal"} options={["horizontal", "vertical"]} onChange={value => setVertical(value === "vertical")} /><ControlGroup label="State"><ControlToggle pressed={disabled} onChange={setDisabled}>Disabled</ControlToggle></ControlGroup></>}><div className="catalog-basic-demo catalog-slider-demo"><Slider label="Volume" thumbLabels={range ? ["Minimum volume", "Maximum volume"] : undefined} value={values} onValueChange={setValues} disabled={disabled} orientation={vertical ? "vertical" : "horizontal"} minStepsBetweenThumbs={1} /><output>{values.join(" – ")}</output></div></DemoFrame>;

}

function ProgressDemo() {

  const [value, setValue] = useState([50]); const [indeterminate, setIndeterminate] = useState(false);

  return <DemoFrame controls={<ControlGroup label="State"><ControlToggle pressed={indeterminate} onChange={setIndeterminate}>Indeterminate</ControlToggle></ControlGroup>}><div className="catalog-basic-demo"><Progress label="Example progress" value={indeterminate ? undefined : value[0]} /><Slider label="Adjust progress" value={value} onValueChange={setValue} disabled={indeterminate} /><output>{indeterminate ? "Loading…" : `${value[0]}%`}</output></div></DemoFrame>;

}



function ExtendedDemo({ name }: { name: CoreName }) {

  const [notice, setNotice] = useState("");

  const [single, setSingle] = useState("ana");

  const [multiple, setMultiple] = useState<string[]>(["ana"]);

  const [disabled, setDisabled] = useState(false);

  const [invalid, setInvalid] = useState(false);

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<string[]>(["one"]);

  const [date, setDate] = useState<Date>();

  const [range, setRange] = useState<{ from: Date | undefined; to?: Date }>();

  const [segment, setSegment] = useState("regular");

  const [toggles, setToggles] = useState<string[]>(["bold"]);

  const options = [{ value: "ana", label: "Ana Martins", icon: <Avatar name="Ana Martins" size="extra-tiny" /> }, { value: "lucas", label: "Lucas Costa", icon: <Avatar name="Lucas Costa" size="extra-tiny" /> }, { value: "mariana", label: "Mariana Santos", icon: <Avatar name="Mariana Santos" size="extra-tiny" />, disabled: true }];

  const items: MenuItem[] = [{ id: "edit", label: "Edit", icon: <FileText />, onSelect: () => setNotice("Edit selected.") }, { id: "share", label: "Share", children: [{ id: "copy", label: "Copy link", onSelect: () => setNotice("Copy link selected.") }] }, { id: "unavailable", label: "Unavailable action", disabled: true }, { id: "separator", separator: true }, { id: "delete", label: "Delete", destructive: true, onSelect: () => setNotice("Delete selected in this example.") }];

  const fields = ["FilterSelect", "Combobox", "MultiSelect", "DatePicker", "DateRangePicker"].includes(name);

  let preview: ReactNode;

  switch (name) {

    case "FilterSelect": preview = <FilterSelect label="Options" options={[{ value: "one", label: "Option 1" }, { value: "two", label: "Option 2" }, { value: "three", label: "Option 3" }]} value={filters} onValueChange={setFilters} disabled={disabled} invalid={invalid} loading={loading} />; break;

    case "Popover": preview = <Popover label="Resource details" trigger={<Button variant="outline">Open popover</Button>}><div className="catalog-popover-content"><div><h3>Resource details</h3><p>Contextual information anchored to the trigger.</p></div><Separator spacing="none" /><div className="catalog-demo-row"><Button size="small" onClick={() => setNotice("Resource action completed.")}>View resource</Button></div></div></Popover>; break;

    case "Dialog": preview = <Dialog title="Edit resource" description="Update the example resource name." trigger={<Button>Edit resource</Button>} footer={<DialogClose asChild><Button onClick={() => setNotice("Changes saved in this example.")}>Save changes</Button></DialogClose>}><FormField label="Resource name"><Input defaultValue="Lesson resource" /></FormField></Dialog>; break;

    case "AlertDialog": preview = <AlertDialog title="Delete resource?" description="This action cannot be undone. This preview does not delete any data." trigger={<Button variant="destructive">Delete resource</Button>} actionLabel="Delete" destructive onConfirm={() => setNotice("Deletion confirmed in this example.")} />; break;

    case "DropdownMenu": preview = <DropdownMenu label="Resource actions" trigger={<Button variant="outline">Actions</Button>} items={items} />; break;

    case "ContextMenu": preview = <div className="catalog-context-example"><ContextMenu label="Resource actions" items={items}><div className="catalog-context-resource"><FileText size={24} aria-hidden="true" /><strong>Lesson resource</strong><span>Right-click this resource to open its actions.</span><span>Keyboard: focus this area and press Shift+F10.</span></div></ContextMenu><DropdownMenu label="Resource actions" trigger={<Button variant="outline">Actions</Button>} items={items} /></div>; break;

    case "Combobox": preview = <Combobox label="Student" options={options} value={single} onValueChange={setSingle} disabled={disabled} invalid={invalid} />; break;

    case "MultiSelect": preview = <MultiSelect label="Students" options={options} value={multiple} onValueChange={setMultiple} disabled={disabled} invalid={invalid} />; break;

    case "SegmentedControl": preview = <CoreSegmentedControl label="Example size" items={[{ value: "small", label: "Small" }, { value: "regular", label: "Regular" }, { value: "large", label: "Large" }]} value={segment} onValueChange={setSegment} />; break;

    case "ToggleGroup": preview = <ToggleGroup type="multiple" label="Text formatting" items={[{ value: "bold", label: "Bold" }, { value: "italic", label: "Italic" }, { value: "underline", label: "Underline" }]} value={toggles} onValueChange={setToggles} />; break;

    case "DatePicker": preview = <DatePicker label="Lesson date" value={date} onValueChange={setDate} disabled={disabled} invalid={invalid} />; break;

    case "DateRangePicker": preview = <DateRangePicker label="Reporting period" value={range} onValueChange={setRange} disabled={disabled} invalid={invalid} />; break;

    case "Breadcrumb": preview = <Breadcrumb items={[{ label: "Planner" }, { label: "Design System" }, { label: "Breadcrumb" }]} />; break;

  }

  return <>{fields && <div className="catalog-controls"><ControlGroup label="State"><ControlToggle pressed={disabled} onChange={setDisabled}>Disabled</ControlToggle><ControlToggle pressed={invalid} onChange={setInvalid}>Error</ControlToggle>{name === "FilterSelect" && <ControlToggle pressed={loading} onChange={setLoading}>Loading</ControlToggle>}</ControlGroup></div>}<div className="catalog-preview"><div className={fields ? "catalog-extended-field" : "catalog-preview-content"}>{preview}</div></div><p className="catalog-preview-notice" role="status">{notice || "Live preview · imported core component"}</p></>;

}



function IconFoundations() {
  const [query, setQuery] = useState("Ana Martins");
  const [tab, setTab] = useState("lessons");
  const [notice, setNotice] = useState("");
  return <section className="catalog-panel catalog-icons" aria-labelledby="catalog-icons-title">
    <h3 id="catalog-icons-title">Icon system</h3>
    <p className="catalog-icons-intro">Use the shared icon library. Components control the size and alignment of their icon slots.</p>
    <section aria-labelledby="catalog-icon-library"><h4 id="catalog-icon-library">Icon library</h4><p>Common icons used across the product, from Lucide.</p><div className="catalog-icon-gallery">{[{ name: "Search", icon: <Search /> }, { name: "Settings", icon: <Settings /> }, { name: "UserRound", icon: <UserRound /> }, { name: "FileText", icon: <FileText /> }, { name: "Check", icon: <Check /> }, { name: "X", icon: <X /> }].map(item => <figure key={item.name}><IconSlot>{item.icon}</IconSlot><figcaption><code>{item.name}</code></figcaption></figure>)}</div></section>
    <section aria-labelledby="catalog-icon-sizes"><h4 id="catalog-icon-sizes">Slot sizes</h4><div className="catalog-icon-sizes">{[{ size: 12 as const, usage: "Badge · mini Button" }, { size: 16 as const, usage: "Button · Input · Tabs" }, { size: 20 as const, usage: "Select start icon · EmptyState" }, { size: 24 as const, usage: "Sonner" }].map(item => <div key={item.size}><div className="catalog-icon-size-sample"><IconSlot size={item.size}><Search /></IconSlot></div><strong>{item.size}px</strong><span>{item.usage}</span></div>)}</div><p className="catalog-icon-note">SVG icons follow the slot size. Image assets keep their supplied dimensions. The Select chevron uses its official 16px asset.</p></section>
    <section aria-labelledby="catalog-icon-examples"><h4 id="catalog-icon-examples">In components</h4><div className="catalog-icon-examples">
      <div><h5>Decorative icons</h5><p>Icons support the text label and are hidden from screen readers.</p><div className="catalog-icon-example-row"><Button size="small" startIcon={<FileText />} endIcon={<ArrowRight />} onClick={() => setNotice("Open lessons selected in this example.")}>Open lessons</Button><Badge startIcon={<Check />}>Ready</Badge></div><code>startIcon · endIcon</code><Input aria-label="Student name example" placeholder="Student name" startIcon={<UserRound />} endIcon={<Check />} /><Select aria-label="Learning level example" startIcon={<UserRound />} defaultValue="A1"><option value="A1">A1 — Beginner</option><option value="A2">A2 — Elementary</option></Select></div>
      <div><h5>Icon actions</h5><p>Interactive icons need an accessible action name.</p><div className="catalog-icon-example-row"><IconButton label="Example settings" icon={<Settings />} size="small" onClick={() => setNotice("Settings selected in this example.")} /><span>Settings</span></div><code>IconButton: label + icon</code><Input aria-label="Search students example" value={query} onChange={event => setQuery(event.target.value)} startIcon={<Search />} endAction={{ label: "Clear student search", icon: <X />, onClick: () => { setQuery(""); setNotice("Search cleared. Focus returned to the input."); }, disabled: !query }} /><code>Input: endAction</code></div>
      <div><h5>Navigation icons</h5><p>The text label still identifies each tab.</p><Tabs label="Icon navigation example" value={tab} onChange={setTab} items={[{ value: "lessons", label: "Lessons", startIcon: <FileText />, content: "Lesson plans and learning materials." }, { value: "students", label: "Students", startIcon: <UserRound />, content: "Student profiles and learning levels." }]} /><code>Tabs: items[].startIcon</code></div>
      <div><h5>Loading</h5><p>The spinner replaces the start icon while the action keeps its label.</p><div className="catalog-icon-example-row"><Button size="small" startIcon={<FileText />} loading>Saving changes</Button></div><code>Button: loading</code></div>
    </div><p className="catalog-icon-feedback" role="status">{notice || "Try the actions, clear the search or switch tabs."}</p></section>
    <details className="catalog-icon-compatibility"><summary>API compatibility</summary><p>Prefer <code>startIcon</code> and <code>endIcon</code> for decoration, and <code>icon</code> for IconButton. Existing <code>leading</code>, <code>trailing</code>, IconButton children and Tabs <code>items[].icon</code> remain supported.</p></details>
  </section>;
}

function PaginationDemo() {

  const [page, setPage] = useState(1);

  const [count, setCount] = useState("10");

  const [disabled, setDisabled] = useState(false);

  const total = Number(count);

  const current = Math.min(page, total);

  return <><div className="catalog-controls"><ControlGroup label="Pages"><SegmentedControl label="Page count" value={count} onChange={value => { setCount(value); setPage(1); }} options={["1", "3", "10", "20"]} /></ControlGroup><ControlGroup label="State"><ControlToggle pressed={disabled} onChange={setDisabled}>Disabled</ControlToggle></ControlGroup></div><div className="catalog-preview"><div className="catalog-pagination-demo"><p role="status">Page {current} of {total}</p><Pagination pageCount={total} page={current} onPageChange={setPage} disabled={disabled} /></div></div><p className="catalog-preview-notice">Live preview · imported core component</p></>;

}



function LivePreview({ name }: { name: CoreName }) {

  const [size, setSize] = useState<Size>("regular");

  const [variant, setVariant] = useState<Variant>("primary");

  const [avatarSize, setAvatarSize] = useState<"extra-tiny" | "tiny" | "small" | "regular">("regular");

  const [round, setRound] = useState(false);

  const [invalid, setInvalid] = useState(false);

  const [twoLines, setTwoLines] = useState(false);

  const [withStartIcon, setWithStartIcon] = useState(false);

  const [withEndIcon, setWithEndIcon] = useState(false);

  const [withAction, setWithAction] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const [horizontal, setHorizontal] = useState(false);

  const [disabled, setDisabled] = useState(false);

  const [loading, setLoading] = useState(false);

  const [tab, setTab] = useState("overview");

  const [notice, setNotice] = useState("");

  const hintId = useId();

  const click = () => setNotice("Example action completed. No data was saved.");

  if (name === "Card") return <><div className="catalog-preview"><div className="catalog-preview-content catalog-card-preview"><CardExamples onAction={action => setNotice(`${action} selected in this example. No data was changed.`)} /></div></div><p className="catalog-preview-notice" role="status">{notice || "Live preview · imported core component"}</p></>;

  if (["FilterSelect", "Popover", "Dialog", "AlertDialog", "DropdownMenu", "ContextMenu", "Combobox", "MultiSelect", "SegmentedControl", "ToggleGroup", "DatePicker", "DateRangePicker", "Breadcrumb"].includes(name)) return <ExtendedDemo name={name} />;

  if (name === "Sonner") return <SonnerDemo />;

  if (name === "Table") return <TableDemo />;
  if (name === "Sidebar") return <SidebarExamples />;

  if (name === "Pagination") return <PaginationDemo />;

  if (name === "Checkbox" || name === "Radio" || name === "Switch") return <SelectionDemo kind={name} />;

  if (name === "Slider") return <SliderDemo />;

  if (name === "Progress") return <ProgressDemo />;

  const previews: Partial<Record<CoreName, ReactNode>> = {

    Checkbox: <SelectionDemo kind="Checkbox" />,

    Radio: <SelectionDemo kind="Radio" />,

    Switch: <SelectionDemo kind="Switch" />,

    Slider: <SliderDemo />,

    Progress: <ProgressDemo />,

    Separator: <div className="catalog-separator-demo"><span>Horizontal</span><Separator decorative={false} /><div className="catalog-selection-row"><span>Before</span><Separator orientation="vertical" spacing="spacious" decorative={false} /><span>After</span></div></div>,

    Skeleton: <div className="catalog-skeleton-demo" role="status" aria-label="Loading content"><Skeleton variant="avatar" /><div className="catalog-basic-demo"><Skeleton /><Skeleton variant="object" /></div></div>,

    Spinner: <div className="catalog-demo-row"><Spinner label="Loading" /><Spinner mirrored label="Loading, mirrored" /></div>,

    Label: <div className="catalog-field-demo catalog-label-demo"><Label htmlFor={`${hintId}-label`} required>Name</Label><Input id={`${hintId}-label`} required placeholder="Full name" /></div>,

    Toggle: <Toggle size={size} variant={variant === "ghost" ? "ghost" : "outline"} pressed={round} onPressedChange={setRound} disabled={disabled} startIcon={withStartIcon ? <Check /> : undefined} endIcon={withEndIcon ? <ArrowRight /> : undefined}>Favorite</Toggle>,

    LinkButton: <LinkButton href="#example-link" size={size} disabled={disabled} startIcon={withStartIcon ? <Folder /> : undefined} endIcon={withEndIcon ? <ArrowRight /> : undefined} onClick={event => { event.preventDefault(); click(); }}>View resources</LinkButton>,

    Sonner: <SonnerDemo />,

    Table: <TableDemo />,

    Button: <Button type="button" size={size} variant={variant} startIcon={withStartIcon ? <Check /> : undefined} endIcon={withEndIcon ? <ArrowRight /> : undefined} roundness={round ? "round" : "default"} disabled={disabled} loading={loading} onClick={click}>Save changes</Button>,

    LoadingButton: <LoadingButton size={size} startIcon={withStartIcon ? <Check /> : undefined} endIcon={withEndIcon ? <ArrowRight /> : undefined} roundness={round ? "round" : "default"}>Saving</LoadingButton>,

    IconButton: <IconButton variant={variant} roundness={round ? "round" : "default"} type="button" label="Example settings" size={size} disabled={disabled} onClick={click} icon={<Settings />} />,

    Input: <Input aria-label="Name" placeholder="Full name" invalid={invalid} disabled={disabled} value={inputValue} onChange={event => setInputValue(event.target.value)} startIcon={withStartIcon ? <UserRound /> : undefined} endIcon={withEndIcon ? <Check /> : undefined} endAction={withAction ? { icon: <X />, label: "Clear name", onClick: () => setInputValue("") } : undefined} />,

    SearchInput: <SearchInput aria-label="Example search" placeholder="Search resources" invalid={invalid} disabled={disabled} startIcon={withStartIcon ? <Folder /> : undefined} endIcon={withEndIcon ? <Check /> : undefined} endAction={withAction ? { icon: <X />, label: "Clear search", onClick: () => setInputValue("") } : undefined} value={inputValue} onChange={event => setInputValue(event.target.value)} />,

    Textarea: <Textarea aria-label="Instructions" placeholder="Describe the activity" invalid={invalid} disabled={disabled} rows={3} />,

    Select: <Select aria-label="Level" size={size} startIcon={withStartIcon ? <UserRound /> : undefined} invalid={invalid} loading={loading} disabled={disabled} description={twoLines ? "Select a learning level" : undefined} defaultValue="A1"><option value="A1">A1 — Beginner</option><option value="A2">A2 — Elementary</option><option value="B1">B1 — Intermediate</option></Select>,

    FormField: <div className="catalog-field-demo catalog-field-demo--compositions"><FormField orientation={horizontal ? "horizontal" : "vertical"} label="Name" required hint="Enter your full name."><Input placeholder="Full name" /></FormField><FormField orientation={horizontal ? "horizontal" : "vertical"} label="Level" hint="Select a learning level."><Select defaultValue="A1"><option value="A1">A1 — Beginner</option><option value="A2">A2 — Elementary</option><option value="B1">B1 — Intermediate</option></Select></FormField><FormField orientation={horizontal ? "horizontal" : "vertical"} label="Notes" error="Review this content."><Textarea defaultValue="Example content" /></FormField></div>,

    Badge: <div className="catalog-demo-row">{(["neutral", "danger", "success"] as const).flatMap(tone => (["subtle", "strong"] as const).map(emphasis => <Badge key={`${tone}-${emphasis}`} tone={tone} emphasis={emphasis} startIcon={withStartIcon ? <Check /> : undefined} endIcon={withEndIcon ? <ArrowRight /> : undefined}>{tone} / {emphasis}</Badge>))}</div>,

    StatusBadge: <div className="catalog-demo-row">{["To Plan", "Planning", "Planned", "Taught"].map(status => <StatusBadge key={status} status={status} startIcon={withStartIcon ? <Check /> : undefined} endIcon={withEndIcon ? <ArrowRight /> : undefined} />)}</div>,

    Avatar: <div className="catalog-avatar-examples"><figure><div><Avatar name="Ana Martins" size={avatarSize} roundness={round ? "roundrect" : "round"} /></div><figcaption>Initials</figcaption></figure><figure><div><Avatar name="André Martins" src="/teacher-avatar-andre.png" size={avatarSize} roundness={round ? "roundrect" : "round"} /></div><figcaption>Photo</figcaption></figure><figure><div><AvatarStack items={peopleWithPhotos} max={3} size={avatarSize} /></div><figcaption>Stack with overflow</figcaption></figure></div>,

    AvatarStack: <div className="catalog-avatar-examples"><figure><div><AvatarStack items={people.slice(0, 3)} size={avatarSize} /></div><figcaption>Initials · 3 people</figcaption></figure><figure><div><AvatarStack items={peopleWithPhotos.slice(0, 3)} size={avatarSize} /></div><figcaption>Photos · 3 people</figcaption></figure><figure><div><AvatarStack items={peopleWithPhotos} max={5} size={avatarSize} /></div><figcaption>Photos and initials · 5 people</figcaption></figure><figure><div><AvatarStack items={peopleWithPhotos} max={3} size={avatarSize} /></div><figcaption>Overflow · 3 visible + 2 more</figcaption></figure></div>,

    Tabs: <div><Tabs size={size === "mini" ? "small" : size} items={[{ value: "overview", label: "Overview", startIcon: withStartIcon ? <Folder /> : undefined, endIcon: withEndIcon ? <Check /> : undefined, counter: 3, content: <p className="catalog-tab-content">Summary of the selected content.</p> }, { value: "details", label: "Details", startIcon: withStartIcon ? <FileText /> : undefined, endIcon: withEndIcon ? <Check /> : undefined, content: <p className="catalog-tab-content">Details of the selected content.</p> }, { value: "history", label: "History", disabled: true }]} value={tab} onChange={setTab} /></div>,

    EmptyState: <EmptyState icon={withStartIcon ? <Search /> : undefined} title="No resources found" description="Adjust your search or create your first resource." action={<Button type="button" onClick={click}>Create resource</Button>} />,

  };

  const avatar = ["Avatar", "AvatarStack"].includes(name);

  const iconable = ["Button", "LoadingButton", "Toggle", "LinkButton", "Input", "SearchInput", "Select", "Tabs", "Badge", "StatusBadge", "EmptyState"].includes(name);

  const sized = ["Button", "LoadingButton", "IconButton", "Toggle", "LinkButton", "Select", "Tabs"].includes(name);

  const hasState = ["Button", "IconButton", "Toggle", "LinkButton", "Select", "Input", "SearchInput", "Textarea"].includes(name);

  const hasShape = ["Button", "LoadingButton", "IconButton", "Avatar"].includes(name);

  return <>

    {(sized || avatar || iconable || name === "FormField" || hasState) && <div className="catalog-controls" role="group" aria-label="Preview controls">

      {["Button", "IconButton"].includes(name) && <ControlGroup label="Variant"><Select aria-label="Variant" size="small" value={variant} onChange={event => setVariant(event.target.value as Variant)}>{(name === "IconButton" ? ["primary", "secondary", "outline", "ghost", "ghost-muted", "destructive", "accent"] : ["primary", "secondary", "outline", "ghost", "destructive", "accent"]).map(value => <option key={value}>{value}</option>)}</Select></ControlGroup>}

      {name === "Toggle" && <SegmentedControl label="Variant" value={variant === "ghost" ? "ghost" : "outline"} options={["outline", "ghost"]} onChange={setVariant} />}

      {sized && <SegmentedControl label="Size" value={size} options={name === "Tabs" ? ["small", "regular", "large"] : ["mini", "small", "regular", "large"]} onChange={setSize} />}

      {avatar && <SegmentedControl label="Size" value={avatarSize} options={name === "AvatarStack" ? ["small", "regular"] : ["extra-tiny", "tiny", "small", "regular"]} onChange={setAvatarSize} />}

      {hasShape && <SegmentedControl label="Shape" value={round ? (avatar ? "roundrect" : "round") : (avatar ? "round" : "default")} options={avatar ? ["round", "roundrect"] : ["default", "round"]} onChange={value => setRound(value === (avatar ? "roundrect" : "round"))} />}

      {name === "FormField" && <SegmentedControl label="Orientation" value={horizontal ? "horizontal" : "vertical"} options={["vertical", "horizontal"]} onChange={value => setHorizontal(value === "horizontal")} />}

      {name === "Select" && <SegmentedControl label="Lines" value={twoLines ? "2 lines" : "1 line"} options={["1 line", "2 lines"]} onChange={value => setTwoLines(value === "2 lines")} />}

      {iconable && <ControlGroup label={name === "EmptyState" ? "Content" : "Icons"}><ControlToggle pressed={withStartIcon} onChange={setWithStartIcon}>{name === "EmptyState" ? "Icon" : "Start icon"}</ControlToggle>{!["Select", "EmptyState"].includes(name) && <ControlToggle pressed={withEndIcon} onChange={setWithEndIcon}>End icon</ControlToggle>}{["Input", "SearchInput"].includes(name) && <ControlToggle pressed={withAction} onChange={setWithAction}>Clear action</ControlToggle>}</ControlGroup>}

      {hasState && <ControlGroup label="State"><ControlToggle pressed={disabled} onChange={setDisabled}>Disabled</ControlToggle>{["Button", "Select"].includes(name) && <ControlToggle pressed={loading} onChange={setLoading}>Loading</ControlToggle>}{["Input", "SearchInput", "Textarea", "Select"].includes(name) && <ControlToggle pressed={invalid} onChange={setInvalid}>Error</ControlToggle>}</ControlGroup>}

    </div>}

    <div className="catalog-preview"><div className="catalog-preview-content">{previews[name]}</div></div>

    <p className="catalog-preview-notice" role="status">{notice || "Live preview · imported core component"}</p>

  </>;

}



function ComponentDetail({ entry }: { entry: CatalogEntry }) {

  const headingId = useId();

  const [copyStatus, setCopyStatus] = useState("");

  async function copyExample() {

    try { await navigator.clipboard.writeText(entry.example); setCopyStatus("Example copied."); }

    catch { setCopyStatus("Could not copy. Select the code below."); }

  }

  return <article className="catalog-detail" aria-labelledby={headingId}>

    <div className="catalog-detail-heading"><div><h2 id={headingId}>{entry.name === "FormField" ? "Field" : entry.name}</h2><p>{entry.description}</p></div>{entry.figmaNode && <a className="catalog-status" href={`${entry.figmaFile ?? figmaFile}?node-id=${entry.figmaNode.replace(":", "-")}`} target="_blank" rel="noreferrer">View in Figma ↗</a>}</div>

    <LivePreview key={entry.name} name={entry.name} />

    <dl className="catalog-contract"><div><dt>Variants and states</dt><dd>{entry.variants}</dd></div><div><dt>API</dt><dd><code>{entry.props}</code></dd></div><div><dt>Usage</dt><dd>{entry.guidance}</dd></div></dl>

    <div className="catalog-code-heading"><h3>Usage example</h3><button type="button" onClick={() => void copyExample()}><Copy size={14} />Copy</button></div>

    <pre className="catalog-code"><code>{entry.example}</code></pre><p className="catalog-copy-status" role="status">{copyStatus}</p>

    <p className="catalog-source">Source: <code>src/design-system/index.tsx</code> · styles: <code>styles.css</code> · tokens: <code>tokens.css</code></p>

  </article>;

}



function FoundationContent({ page }: { page: FoundationId }) {
  const entry = foundationPages.find(item => item.id === page)!;
  return <><div className="catalog-section-heading"><h2>{entry.label}</h2><p>{entry.description}</p></div>
    {page === "logo" && <LogoFoundations />}
    {page === "colors" && <ColorFoundations />}
    {page === "typography" && <section className="catalog-panel"><h3>Type scale</h3><p>Inter · system font fallback.</p>{["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"].map(size => <div className="catalog-type" key={size}><code>--ds-font-size-{size}</code><span style={{ fontSize: `var(--ds-font-size-${size})`, lineHeight: `var(--ds-line-height-${size})` }}>A consistent interface</span></div>)}</section>}
    {page === "icons" && <IconFoundations />}
    {page === "spacing" && <section className="catalog-panel"><h3>Spacing scale</h3>{[1, 2, 3, 4, 5, 6].map(step => <div className="catalog-space" key={step}><code>--ds-space-{step}</code><span style={{ width: `var(--ds-space-${step})` }} /></div>)}</section>}
    {page === "radius" && <section className="catalog-panel"><h3>Corner radii</h3><div className="catalog-radius-grid">{["sm", "md", "lg", "xl", "full"].map(radius => <div key={radius}><span style={{ borderRadius: `var(--ds-radius-${radius})` }} /><code>--ds-radius-{radius}</code></div>)}</div></section>}
    {page === "shadows" && <section className="catalog-panel"><h3>Elevation</h3><div className="catalog-shadow-grid">{["sm", "md", "lg", "popover"].map(shadow => <div key={shadow} style={{ boxShadow: `var(--ds-shadow-${shadow})` } as CSSProperties}><code>{shadow}</code></div>)}</div></section>}
    {page !== "icons" && page !== "colors" && page !== "logo" && <p className="catalog-foundation-source">Source: <code>src/design-system/tokens.css</code> · Examples follow the selected theme.</p>}
  </>;
}

export function DesignSystemView({ foundation, component = "button" }: { foundation?: FoundationId; component?: string }) {

  const section = foundation ? "foundations" : "components";
  const familyId = component;

  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");

  const family = componentFamilies.find(entry => entry.id === familyId) ?? componentFamilies.find(entry => entry.id === "button")!;

  const entries = family.members.map(name => coreCatalog.find(entry => entry.name === name)!);

  const theme = previewTheme;

  return <div className="catalog-shell ds-root" data-theme={theme}><main className="catalog catalog-standalone ds-root" lang="en" data-theme={theme}>

    <header className="catalog-header">

      <div className="catalog-header-leading"><LinkButton className="catalog-back" href="/" size="small" aria-label="Back to Planner" title="Back to Planner" startIcon={<ArrowLeft />} /><div><div className="catalog-title-row"><h1>Design System <span>v0.5</span></h1></div><p>Flexge 2.0 components and foundations.</p></div></div>

      <div className="catalog-theme-buttons" role="group" aria-label="Catalog theme">

        <IconButton label="Light theme" title="Light theme" size="small" variant={theme === "light" ? "secondary" : "ghost"} aria-pressed={theme === "light"} icon={<Sun />} onClick={() => setPreviewTheme("light")} />

        <IconButton label="Dark theme" title="Dark theme" size="small" variant={theme === "dark" ? "secondary" : "ghost"} aria-pressed={theme === "dark"} icon={<Moon />} onClick={() => setPreviewTheme("dark")} />

      </div>

    </header>

    <div className="catalog-layout">

      <nav className="catalog-nav" aria-label="Design system index">

        <div className="catalog-nav-family"><span className="catalog-nav-label">Foundations</span>{foundationPages.map(entry => <a key={entry.id} href={`/design-system/foundations/${entry.id}`} aria-current={foundation === entry.id ? "page" : undefined}>{entry.label}</a>)}</div>
        <div className="catalog-nav-family"><span className="catalog-nav-label">Components</span>{componentFamilies.map(entry => <a key={entry.id} href={`/design-system?component=${entry.id}`} aria-current={section === "components" && family.id === entry.id ? "page" : undefined}>{entry.label}</a>)}</div>

      </nav>

      <div className="catalog-main" key={`${section}-${familyId}`}>

      {foundation && <FoundationContent page={foundation} />}

      {section === "components" && <>

        {entries.map(entry => <ComponentDetail key={entry.name} entry={entry} />)}

      </>}



      </div>

    </div>

  </main></div>;

}

