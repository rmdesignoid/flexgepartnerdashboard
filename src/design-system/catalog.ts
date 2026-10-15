export type CatalogGroup = "Actions" | "Forms" | "Identity" | "Structure" | "Feedback";

export type CoreName = "Sidebar" | "Pagination" | "FilterSelect" | "Breadcrumb" | "DateRangePicker" | "DatePicker" | "ToggleGroup" | "SegmentedControl" | "MultiSelect" | "Combobox" | "ContextMenu" | "DropdownMenu" | "AlertDialog" | "Dialog" | "Popover" | "Checkbox" | "Radio" | "Switch" | "Slider" | "Progress" | "Separator" | "Skeleton" | "Spinner" | "Label" | "Toggle" | "LinkButton" | "Sonner" | "Table" | "LoadingButton" | "Button" | "IconButton" | "Input" | "SearchInput" | "Textarea" | "Select" | "FormField" | "Badge" | "StatusBadge" | "Avatar" | "AvatarStack" | "Card" | "Tabs" | "EmptyState";

export type CatalogEntry = { name: CoreName; group: CatalogGroup; description: string; variants: string; props: string; example: string; guidance: string; figmaNode: string; figmaFile?: string };



// Documentation describes the public API; previews import production components.

export const figmaFile = "https://www.figma.com/design/5sIAwYrLHz2GQnKg7cU9SX/Flexge-Design-System-2.0";

export const coreCatalog: CatalogEntry[] = [
{
  "name": "Sidebar",
  "group": "Structure",
  "description": "The shared product navigation, with expandable groups and a compact icon rail.",
  "variants": "expanded · collapsed / active · hover · focus · disabled / links · module actions · badges / header and footer slots",
  "props": "Sidebar: collapsed + aside props and ref / SidebarMain, SidebarFooter: div props / SidebarNavigation: groups, activeId, collapsed, collapsedGroups, onGroupToggle, onItemSelect + nav props",
  "example": "<Sidebar collapsed={collapsed}><SidebarMain><SidebarNavigation groups={groups} activeId={module} collapsed={collapsed} onItemSelect={setModule} /></SidebarMain><SidebarFooter>{userActions}</SidebarFooter></Sidebar>",
  "guidance": "This is the component used by Planner. Groups use disclosure buttons; collapsed groups remove their items from keyboard navigation. activeId exposes aria-current. href renders a navigation link, while onItemSelect handles module actions. Labels remain accessible in icon-only mode. Branding, persistence, module routing and user actions belong to the consumer. The comparison below records the existing product differences from Figma.",
  "figmaNode": "842:51929"
},

{

  "name": "Pagination",

  "group": "Structure",

  "description": "Compact navigation between pages of a collection.",

  "variants": "first \u00b7 middle \u00b7 last \u00b7 single page \u00b7 disabled / 24px buttons \u00b7 8px gap \u00b7 automatic ellipsis",

  "props": "pageCount, page, defaultPage, onPageChange, disabled, previousLabel, nextLabel, pageLabel, ellipsisLabel + nav props and ref",

  "example": "<Pagination pageCount={10} page={page} onPageChange={setPage} />",

  "guidance": "Use pageCount for the total number of pages and page for the current 1-based page. Consumers load or slice their data in onPageChange. Previous and Next are disabled at the boundaries. aria-current identifies the current page; ellipses indicate omitted pages. Labels can be localized. The active page uses the neutral Figma background.",

  "figmaNode": "842:51939"

} ,

{

  "name": "FilterSelect",

  "group": "Forms",

  "description": "A multiple-option filter with removable selected tags.",

  "variants": "placeholder · selected · focus · error · loading · disabled / 32px / 400px popover",

  "props": "label, options, value, defaultValue, onValueChange, open, onOpenChange, loading, disabled, invalid, startIcon, name, required, selectedLabel, clearLabel, searchPlaceholder + button props and ref",

  "example": "<FilterSelect label=\"Learning levels\" options={[{ value: \"A1\", label: \"A1 — Beginner\" }, { value: \"A2\", label: \"A2 — Elementary\" }]} value={levels} onValueChange={setLevels} />",

  "guidance": "The trigger shows the number of selected options. Selected tags can be removed individually or with Clean. Search filters the remaining options; selection keeps the popover open. Arrows navigate and Enter selects; Escape closes and restores focus. Compose with FormField for labels and errors. name submits each selected value.",

  "figmaNode": "5804:118112",

  "figmaFile": "https://www.figma.com/design/V3MCesP1lo63pCcUvpkfbg/3.-Delivery"

},

{

  "name": "Popover",

  "group": "Structure",

  "description": "Floating content anchored to a trigger.",

  "variants": "controlled \u00b7 uncontrolled / top \u00b7 right \u00b7 bottom \u00b7 left / light \u00b7 dark",

  "props": "trigger, label, children, open, onOpenChange, side, align",

  "example": "<Popover label=\"Help\" trigger={<Button>Help</Button>}><p>Helpful content</p></Popover>",

  "guidance": "Use for contextual content. Escape closes and returns focus to the trigger. The portal inherits the consumer theme.",

  "figmaNode": "176:27848"

},

{

  "name": "Dialog",

  "group": "Structure",

  "description": "A modal surface for focused tasks.",

  "variants": "controlled \u00b7 uncontrolled / title \u00b7 description \u00b7 body \u00b7 footer",

  "props": "trigger, title, description, children, footer, open, onOpenChange, size (regular | wide), scroll (dialog | body) / DialogClose",

  "example": "<Dialog title=\"Edit name\" trigger={<Button>Edit</Button>}><FormField label=\"Name\"><Input /></FormField></Dialog>",

  "guidance": "Focus is trapped while open and restored when closed. Compose DialogClose asChild with a Button. Use size=wide for extensive reviews and scroll=body to keep the title and footer available. Use AlertDialog for confirmations.",

  "figmaNode": ""

},

{

  "name": "AlertDialog",

  "group": "Feedback",

  "description": "A confirmation requiring an explicit decision.",

  "variants": "default \u00b7 destructive / cancel \u00b7 confirm",

  "props": "trigger, title, description, actionLabel, cancelLabel, onConfirm, destructive, open, onOpenChange",

  "example": "<AlertDialog title=\"Delete resource?\" description=\"This action cannot be undone.\" actionLabel=\"Delete\" destructive onConfirm={removeResource} trigger={<Button>Delete</Button>} />",

  "guidance": "Initial focus goes to Cancel. Outside clicks do not dismiss. Consumers handle the operation and asynchronous state.",

  "figmaNode": ""

},

{

  "name": "DropdownMenu",

  "group": "Structure",

  "description": "An action menu opened from a button.",

  "variants": "icons \u00b7 disabled \u00b7 destructive \u00b7 shortcuts \u00b7 separators \u00b7 submenus",

  "props": "trigger, items, label, align, open, onOpenChange / MenuItem",

  "example": "<DropdownMenu label=\"Actions\" trigger={<Button>Actions</Button>} items={[{ id: \"edit\", label: \"Edit\", onSelect: edit }]} />",

  "guidance": "Use for actions rather than field values. Arrows navigate, typing finds items, Escape returns focus. Submenus use children.",

  "figmaNode": "288:105151"

},

{

  "name": "ContextMenu",

  "group": "Structure",

  "description": "An action menu opened with a context gesture.",

  "variants": "right click \u00b7 long press \u00b7 Shift+F10 / icons \u00b7 submenus",

  "props": "children, items, label / MenuItem",

  "example": "<ContextMenu label=\"Resource actions\" items={actions}><span>Resource</span></ContextMenu>",

  "guidance": "The trigger is keyboard focusable. Provide an ordinary action menu elsewhere when contextual actions are essential.",

  "figmaNode": "288:105164"

},

{

  "name": "Combobox",

  "group": "Forms",

  "description": "A searchable single selection.",

  "variants": "empty \u00b7 selected \u00b7 search \u00b7 no results \u00b7 disabled \u00b7 error",

  "props": "label, options, value, defaultValue, onValueChange, placeholder, name, required, invalid, startIcon",

  "example": "<Combobox label=\"Student\" options={students} value={student} onValueChange={setStudent} />",

  "guidance": "Compose with FormField for a visible label and messages. Options have stable unique values. Search supports labels and keywords; selection closes the menu.",

  "figmaNode": "842:49185"

},

{

  "name": "MultiSelect",

  "group": "Forms",

  "description": "A searchable selection of multiple values.",

  "variants": "empty \u00b7 selected \u00b7 search \u00b7 no results \u00b7 disabled \u00b7 error",

  "props": "label, options, value, defaultValue, onValueChange, placeholder, name, required, invalid, startIcon",

  "example": "<MultiSelect label=\"Students\" options={students} value={selected} onValueChange={setSelected} />",

  "guidance": "The menu stays open to combine selections. Selected indicators reflect field values; name creates one hidden input per selected value.",

  "figmaNode": ""

},

{

  "name": "SegmentedControl",

  "group": "Forms",

  "description": "A ToggleGroup variation that keeps exactly one option selected.",

  "variants": "single selection / default \u00b7 focus \u00b7 disabled",

  "props": "label, items, value, defaultValue, onValueChange, disabled, orientation",

  "example": "<SegmentedControl label=\"Size\" items={[{ value: \"small\", label: \"Small\" }, { value: \"regular\", label: \"Regular\" }]} defaultValue=\"regular\" />",

  "guidance": "Uses the same core and visual states as ToggleGroup, with required single selection. Use for short lists. Supply an initial value. Clicking the active item preserves selection. Arrows navigate; the group exposes radio semantics.",

  "figmaNode": ""

},

{

  "name": "ToggleGroup",

  "group": "Actions",

  "description": "A connected set of toggle buttons.",

  "variants": "single \u00b7 multiple / selected \u00b7 unselected \u00b7 disabled \u00b7 icons",

  "props": "type, label, items, value, defaultValue, onValueChange, disabled, orientation",

  "example": "<ToggleGroup type=\"multiple\" label=\"Formatting\" items={[{ value: \"bold\", label: \"Bold\" }, { value: \"italic\", label: \"Italic\" }]} defaultValue={[\"bold\"]} />",

  "guidance": "Use multiple for independent options. single may have no selection; use SegmentedControl when one value must stay selected.",

  "figmaNode": ""

},

{

  "name": "DatePicker",

  "group": "Forms",

  "description": "A calendar for choosing a single date.",

  "variants": "empty \u00b7 selected \u00b7 disabled \u00b7 bounded dates / keyboard navigation",

  "props": "label, value, defaultValue, onValueChange, minDate, maxDate, name, required, invalid",

  "example": "<DatePicker label=\"Lesson date\" value={date} onValueChange={setDate} />",

  "guidance": "Use local Date objects. The calendar supports keyboard navigation and date limits. name submits a local YYYY-MM-DD value.",

  "figmaNode": ""

},

{

  "name": "DateRangePicker",

  "group": "Forms",

  "description": "A calendar for choosing start and end dates.",

  "variants": "presets · two months · hover preview · complete range · bounded dates",

  "props": "label, value, defaultValue, onValueChange, minDate, maxDate, presets, name, required, invalid",

  "example": "<DateRangePicker label=\"Reporting period\" value={range} onValueChange={setRange} />",

  "guidance": "Matches the product period selector: presets and two months. Choose start and end in either order; hover previews the range. Only completed ranges are committed. Escape cancels the draft. name submits name.from and name.to in local YYYY-MM-DD format.",

  "figmaNode": ""

},

{

  "name": "Breadcrumb",

  "group": "Structure",

  "description": "Navigation showing the current page within a hierarchy.",

  "variants": "links \u00b7 current page \u00b7 wrapping",

  "props": "items: { label, href? }[], label",

  "example": "<Breadcrumb items={[{ label: \"Planner\", href: \"/\" }, { label: \"Resources\", href: \"/resources\" }, { label: \"Lesson\" }]} />",

  "guidance": "The final item is the current page and is not a link. Separators are decorative. Keep labels concise.",

  "figmaNode": ""

},

  {

    "name": "Checkbox",

    "group": "Forms",

    "description": "Independent selection with a mixed state.",

    "variants": "unchecked · checked · indeterminate / default · focus · error · disabled",

    "props": "checked, defaultChecked, onCheckedChange, invalid, name, value, required + props and ref",

    "example": "<Checkbox id=\"updates\" /><Label htmlFor=\"updates\">Receive updates</Label>",

    "guidance": "Use onCheckedChange. checked accepts a boolean or indeterminate. Associate a Label with the control; the mixed state exposes aria-checked=mixed.",

    "figmaNode": "16:1789"

  },

  {

    "name": "Radio",

    "group": "Forms",

    "description": "Select one option from a group.",

    "variants": "unchecked · checked / default · focus · error · disabled",

    "props": "checked, defaultChecked, onChange, name, value, invalid, required + props and ref",

    "example": "<Radio id=\"email\" name=\"channel\" value=\"email\" /><Label htmlFor=\"email\">Email</Label>",

    "guidance": "Wrap options in a fieldset with a legend. Use the same name and a unique id for each option. Arrow keys follow native radio behavior.",

    "figmaNode": "16:1794"

  },

  {

    "name": "Switch",

    "group": "Forms",

    "description": "Enable or disable a setting.",

    "variants": "unchecked · checked / focus · disabled / 33 × 18px",

    "props": "checked, defaultChecked, onChange, name, value, required + props and ref",

    "example": "<Switch id=\"notifications\" /><Label htmlFor=\"notifications\">Notifications</Label>",

    "guidance": "Use for binary settings. The native control exposes role=switch and participates in forms.",

    "figmaNode": "16:1800"

  },

  {

    "name": "Slider",

    "group": "Forms",

    "description": "Adjust a numeric value using the keyboard or pointer.",

    "variants": "single · range / horizontal · vertical / focus · disabled / track 6px",

    "props": "label, thumbLabels, value, defaultValue, onValueChange, onValueCommit, min, max, step, orientation, name + props and ref",

    "example": "<Slider label=\"Volume\" defaultValue={[50]} />",

    "guidance": "Values are an array. Give each range thumb a label. Arrow keys adjust the value; Home and End reach the limits.",

    "figmaNode": "65:4894"

  },

  {

    "name": "Progress",

    "group": "Feedback",

    "description": "Show determinate progress or an ongoing operation.",

    "variants": "0–100% · indeterminate / 8px",

    "props": "label, value?, max + div props",

    "example": "<Progress label=\"Upload\" value={50} />",

    "guidance": "Provide a label. Omit value for indeterminate progress; aria-valuenow is then omitted. Values are clamped between zero and max.",

    "figmaNode": "438:64985"

  },

  {

    "name": "Separator",

    "group": "Structure",

    "description": "A horizontal or vertical visual divider.",

    "variants": "horizontal · vertical / none · regular · spacious",

    "props": "orientation, spacing, decorative + div props",

    "example": "<Separator orientation=\"horizontal\" />",

    "guidance": "decorative defaults to true. Set decorative=false when the divider has semantic meaning.",

    "figmaNode": "176:26203"

  },

  {

    "name": "Skeleton",

    "group": "Feedback",

    "description": "A static placeholder while content loads.",

    "variants": "line · object · avatar / custom dimensions",

    "props": "variant, width, height + div props",

    "example": "<Skeleton variant=\"line\" /><Skeleton variant=\"object\" />",

    "guidance": "Group placeholders in a container with aria-busy or a named status. Each Skeleton is decorative.",

    "figmaNode": "303:246698"

  },

  {

    "name": "Spinner",

    "group": "Feedback",

    "description": "A compact indicator of an ongoing operation.",

    "variants": "default · mirrored / 16px",

    "props": "mirrored, label + span props",

    "example": "<Spinner label=\"Loading\" />",

    "guidance": "With a label, the spinner exposes an accessible status. Without a label, it is decorative. Respects reduced motion preferences.",

    "figmaNode": "757:154510"

  },

  {

    "name": "Label",

    "group": "Forms",

    "description": "A label associated with a control.",

    "variants": "inline · block / required / 14px, weight 500",

    "props": "htmlFor, required, layout + label props and ref",

    "example": "<Label htmlFor=\"name\">Name</Label><Input id=\"name\" />",

    "guidance": "htmlFor must match the control id. required shows an asterisk; also set required on the field. FormField remains available for associated labels and messages.",

    "figmaNode": "16:1663"

  },

  {

    "name": "Toggle",

    "group": "Actions",

    "description": "A button with a pressed state.",

    "variants": "pressed · unpressed / outline · ghost / mini · small · regular · large / disabled",

    "props": "pressed, defaultPressed, onPressedChange + Button props and ref",

    "example": "<Toggle defaultPressed startIcon={<Check />}>Favorite</Toggle>",

    "guidance": "aria-pressed communicates its state. Use to toggle an option and keep the label stable.",

    "figmaNode": "816:112968"

  },

  {

    "name": "LinkButton",

    "group": "Actions",

    "description": "A navigation link styled as a button.",

    "variants": "mini · small · regular · large / startIcon · endIcon / disabled",

    "props": "href, variant, size, roundness, disabled, startIcon, endIcon + anchor props and ref",

    "example": "<LinkButton href=\"/students\" endIcon={<ArrowRight />}>Students</LinkButton>",

    "guidance": "Use href for navigation. Use Button to perform an action. disabled removes the destination and the link from the Tab order.",

    "figmaNode": "11:2009"

  },

  {

    "name": "Sonner",

    "group": "Feedback",

    "description": "Temporary notifications with actions and stacking.",

    "variants": "Simple · Loading · Line and button · Lines and button / 1 Level · 2 Levels · 3 Levels / light · dark",

    "props": "Sonner: id, theme, position, duration, visibleToasts, toastOptions / toast(message, options), toast.loading, toast.dismiss, toast.promise / ToastCard and ToastStack",

    "example": "<Sonner />\n<Button onClick={() => toast(\"Resource updated\", { description: \"Changes saved.\", action: { label: \"Undo\", onClick: undo } })}>Save</Button>",

    "guidance": "Mount one Sonner per application. Use toast.loading and update the same id when complete; toast.promise follows asynchronous operations. Notifications are announced without moving focus. The catalog uses an isolated instance.",

    "figmaNode": "295:240815"

  },

  {

    "name": "Table",

    "group": "Structure",

    "description": "A semantic table composed of headers, cells and row states.",

    "variants": "1-line text 36px · 2-line text 60px / left · right / default · hover · active · selected / sortable · checkbox · badge · buttons · avatar · input · empty",

    "props": "Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption / selected, state, align, description, onSort, sortDirection + HTML props and ref",

    "example": "<Table><TableCaption>Students</TableCaption><TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Ana Martins</TableCell></TableRow></TableBody></Table>",

    "guidance": "Table provides structure and styles. Consumers control data, sorting and selection. TableHead uses scope and aria-sort; name checkboxes and actions. Use description for a second line and compose cells with Avatar, Badge, Button or Input. Small screens support horizontal scrolling.",

    "figmaNode": "288:172340"

  },

  {

    "name": "LoadingButton",

    "group": "Actions",

    "description": "A loading action with a spinner and preserved label.",

    "variants": "mini · small · regular · large / default · round",

    "props": "size, startIcon, endIcon, loadingLabel, roundness + Button props",

    "example": "<LoadingButton>Saving</LoadingButton>",

    "guidance": "aria-busy communicates processing; disabled prevents duplicate submissions.",

    "figmaNode": "11:1126"

  },

  {

    "name": "Button",

    "group": "Actions",

    "description": "Primary, secondary and destructive actions.",

    "variants": "primary · secondary · outline · ghost · destructive · accent / mini 24 · small 32 · regular 36 · large 40 / loading · disabled",

    "props": "variant, size, startIcon, endIcon, loading, loadingLabel, roundness + native props and ref",

    "example": "<Button variant=\"accent\" size=\"regular\">Save</Button>",

    "guidance": "Primary is blue; Accent is purple; Outline has a border. The component controls startIcon and endIcon size. Loading replaces the start icon. Use destructive for destructive actions.",

    "figmaNode": "9:1071"

  },

  {

    "name": "IconButton",

    "group": "Actions",

    "description": "A compact action represented by an icon.",

    "variants": "primary · secondary · outline · ghost · ghost-muted · destructive · accent / mini · small · regular · large / default · round",

    "props": "label, icon, variant, size, roundness + native props and ref",

    "example": "<IconButton type=\"button\" label=\"Settings\" icon={<Settings />} />",

    "guidance": "Pass the icon through icon; legacy children remain supported. label must describe the action, even when a tooltip is present.",

    "figmaNode": "9:775"

  },

  {

    "name": "Input",

    "group": "Forms",

    "description": "A standalone text control with native HTML attributes.",

    "variants": "empty · placeholder · value · focus · error · error focus · disabled / 32px",

    "props": "invalid, startIcon, endIcon, endAction, leading, trailing + native props and ref",

    "example": "<Input aria-label=\"Name\" placeholder=\"Full name\" />",

    "guidance": "Input renders the control only. Provide an accessible name with aria-label or an associated Label. Use Field (FormField in code) to add a label, hint or error message. startIcon and endIcon are decorative. endAction requires label and onClick. Legacy leading and trailing slots remain supported.",

    "figmaNode": "16:1738"

  },

  {

    "name": "SearchInput",

    "group": "Forms",

    "description": "A search field composed with Input and a search icon.",

    "variants": "type=search / disabled · filled",

    "props": "invalid, startIcon, endIcon, endAction, leading, trailing + native props and ref",

    "example": "<SearchInput aria-label=\"Search resources\" placeholder=\"Search resources\" />",

    "guidance": "Provide an accessible name even without a visible label.",

    "figmaNode": "16:1738"

  },

  {

    "name": "Textarea",

    "group": "Forms",

    "description": "Multi-line text input.",

    "variants": "empty · placeholder · value · focus · error · error focus · disabled / base height 76px",

    "props": "invalid, resizable + native props and ref",

    "example": "<Textarea aria-label=\"Instructions\" rows={3} placeholder=\"Describe the activity\" />",

    "guidance": "Use for longer content and preserve the ability to resize.",

    "figmaNode": "16:1745"

  },

  {

    "name": "Select",

    "group": "Forms",

    "description": "Single selection with a popover menu based on Radix Select.",

    "variants": "mini 32 · small 32 · regular 36 · large 40 / 1 Line · 2 Lines / loading · disabled · invalid",

    "props": "size, startIcon, leading, description, loading, invalid + native props and ref",

    "example": "<Select aria-label=\"Level\" startIcon={<UserRound />}><option value=\"A1\">A1</option><option value=\"A2\">A2</option></Select>",

    "guidance": "The menu aligns with the field and supports selected indicators, groups and disabled options. Arrow keys navigate, typing searches, Enter selects and Escape closes. startIcon uses the 20px left slot; legacy leading remains supported. The official chevron uses a 16px canvas with internal spacing.",

    "figmaNode": "16:1732"

  },

  {

    "name": "FormField",

    "group": "Forms",

    "description": "A label, control and supporting message, implemented as FormField.",

    "variants": "vertical · horizontal / hint · error · required",

    "props": "label, hint, error, required, orientation, id, children",

    "example": "<FormField label=\"Name\" required hint=\"Full name\"><Input required /></FormField>",

    "guidance": "Import FormField to use Field. Compose one Input, Select or Textarea per field. Labels, required state, invalid state and supporting messages are associated automatically. A field is a single labeled control, not a group of fields.",

    "figmaNode": "120:13754"

  },

  {

    "name": "Badge",

    "group": "Identity",

    "description": "A compact label for supporting information.",

    "variants": "neutral · danger · success / subtle · strong",

    "props": "tone, emphasis, startIcon, endIcon, children + span props",

    "example": "<Badge>Resource</Badge>",

    "guidance": "The six visual styles have explicit names. Info and warning are domain extensions.",

    "figmaNode": "19:6979"

  },

  {

    "name": "StatusBadge",

    "group": "Identity",

    "description": "A planning status with semantic color.",

    "variants": "To Plan · Planning · Planned · Taught / Badge fallback",

    "props": "status: string, startIcon, endIcon",

    "example": "<StatusBadge status=\"Planned\" />",

    "guidance": "Use recognized statuses and retain text to communicate meaning beyond color.",

    "figmaNode": "19:6979"

  },

  {

    "name": "Avatar",

    "group": "Identity",

    "description": "A person represented by a photo or initials.",

    "variants": "extra-tiny 20 · tiny 24 · small 32 · regular 40 / round · roundrect / photo · initials",

    "props": "name, src, size, roundness",

    "example": "<Avatar name=\"Ana Martins\" size=\"lg\" />",

    "guidance": "Provide the full name to generate initials and an accessible description.",

    "figmaNode": "18:1398"

  },

  {

    "name": "AvatarStack",

    "group": "Identity",

    "description": "A group of people with a visible limit and overflow count.",

    "variants": "small 32 · regular 40 / max · overflow",

    "props": "items: { id?, name, src? }[], max, size",

    "example": "<AvatarStack items={[{ name: \"Ana Martins\" }, { name: \"Lucas Costa\" }]} max={3} />",

    "guidance": "Use for a participant summary and provide a complete list in another context.",

    "figmaNode": "22:9509"

  },

  {

    "name": "Card",

    "group": "Structure",

    "description": "A surface for related content.",

    "variants": "1 Slot · 2 Slots · 3 Slots / radius 6px",

    "props": "header, footer, children + section props",

    "example": "<Card header={<div><h3>Lesson resources</h3><p>Materials attached to this lesson.</p></div>} footer={<div><Button variant=\"outline\">Browse resources</Button><Button>Add resource</Button></div>}>\n  <ul><li>Daily routines — Reading · A1</li><li>Introducing yourself — Speaking · A1</li></ul>\n</Card>",

    "guidance": "Use the header for the title, supporting description and optional status. Keep content and metadata in the body. Place secondary and primary actions together in the footer, in that order. These examples follow the Planner and Resources hierarchy.",

    "figmaNode": "179:29234"

  },

  {

    "name": "Tabs",

    "group": "Structure",

    "description": "Controlled switching between related content.",

    "variants": "small 32 · regular 40 · large 48 / label · icon + label · counter · disabled",

    "props": "items: { value, label, href?, startIcon?, endIcon?, icon?, counter?, content?, disabled? }[], value, onChange, size, label",

    "example": "<Tabs items={items} value={value} onChange={setValue} />",

    "guidance": "Panel tabs use Arrow keys, Home and End for focus and selection, with aria-controls and aria-labelledby. When every item has href, Tabs renders navigation links with aria-current=location. Anchor navigation keeps sections visible and uses standard link keyboard behavior.",

    "figmaNode": "9:639"

  },

  {

    "name": "EmptyState",

    "group": "Structure",

    "description": "An empty state with guidance for the next step.",

    "variants": "title / optional description / optional action",

    "props": "title, description?, action?, icon?",

    "example": "<EmptyState title=\"No resources\" description=\"Create your first resource.\" action={<Button type=\"button\">Create resource</Button>} />",

    "guidance": "Explain why the area is empty and offer a relevant action. Decorative icons use a 20px slot inside a 36px container with 8px padding.",

    "figmaNode": "842:44451"

  }

];



export const customCatalog = [

  {

    "name": "Filters and selection",

    "layer": "Pattern",

    "components": "ResourceMultiSelect · ResourceFilterDropdown · CalendarFilterSelect · FilterMenu · MultiFilter",

    "variants": "Search, multiple selection, clear selection and option creation.",

    "source": "app/page.tsx; src/features/ai-conversation/AIConversationView.tsx; src/features/teacher-hours/TeacherHoursView.tsx"

  },

  {

    "name": "Dates and periods",

    "layer": "Pattern",

    "components": "ScheduleDatePicker · TeacherHoursPeriod · LessonLogPeriod",

    "variants": "Single dates, presets, custom ranges and hover previews.",

    "source": "app/page.tsx; src/features/teacher-hours/TeacherHoursPeriod.tsx; src/features/lesson-logs/LessonLogPeriod.tsx"

  },

  {

    "name": "Time and recurrence",

    "layer": "Flexge",

    "components": "ScheduleTimePicker · ScheduleRepeatUnitSelect · ScheduleEventModal",

    "variants": "Time, recurrence and scheduling in a modal or popover.",

    "source": "app/page.tsx"

  },

  {

    "name": "Lesson status",

    "layer": "Flexge",

    "components": "ClassStatusIndicator · PlanningStatusIndicator · PlanningStatusBadge · AttendanceBadge · StatusBadge",

    "variants": "Planning, lesson status, attendance and presentation with or without labels.",

    "source": "app/page.tsx; src/features/teacher-hours/TeacherHoursView.tsx"

  },

  {

    "name": "Navigation",

    "layer": "Pattern",

    "components": "CalendarViewTabs · ConversationBreadcrumb",

    "variants": "Calendar or agenda; breadcrumbs with the current page.",

    "source": "app/page.tsx; src/features/ai-conversation/ConversationBreadcrumb.tsx"

  },

  {

    "name": "Dialogs",

    "layer": "Pattern",

    "components": "LessonLogDetailsDialog · SessionDialog · DeletePracticeDialog · ConfirmDialog · CorrectionDialog",

    "variants": "Details, previous/next navigation, confirmation, deletion and corrections.",

    "source": "src/features/lesson-logs/LessonLogDetailsDialog.tsx; src/features/teacher-hours/TeacherHoursView.tsx; src/features/ai-conversation/AIConversationView.tsx; src/features/ai-conversation/OralReport.tsx"

  },

  {

    "name": "Cards and planning",

    "layer": "Flexge",

    "components": "StackedClassCard · EventIdentity · ResourcePreviewImage · PlanningView",

    "variants": "Compact identity, event types, resource details and planning in edit or report mode.",

    "source": "app/page.tsx"

  },

  {

    "name": "Tables and feedback",

    "layer": "Pattern",

    "components": "Student, resource and hours tables · notices · LessonsPanelSkeleton · ClassPlanErrorState",

    "variants": "Loading, retry errors, empty states, pagination and notifications with undo.",

    "source": "app/page.tsx; src/features/teacher-hours/TeacherHoursView.tsx; src/features/ai-conversation/AIConversationView.tsx"

  },

  {

    "name": "Audio and charts",

    "layer": "Flexge",

    "components": "AudioPlayer · SavedRecording · RadarChart · EvolutionChart",

    "variants": "Play/pause, position, speed and errors; overall or per-criterion progress.",

    "source": "src/features/ai-conversation/AudioPlayer.tsx; src/features/ai-conversation/OralReport.tsx; src/features/ai-conversation/StudentPerformance.tsx"

  }

];



export const colorTokens = ["background", "surface", "surface-soft", "secondary", "border", "foreground", "muted", "primary", "primary-hover", "primary-soft", "accent", "accent-hover", "success", "warning", "danger"];



export type ComponentFamily = { id: string; label: string; members: CoreName[] };

export const componentFamilies: ComponentFamily[] = [

  {

    "id": "avatar",

    "label": "Avatar",

    "members": [

      "Avatar",

      "AvatarStack"

    ]

  },

  {

    "id": "badge",

    "label": "Badge",

    "members": [

      "Badge",

      "StatusBadge"

    ]

  },

  {

    "id": "button",

    "label": "Button",

    "members": [

      "Button",

      "IconButton",

      "LoadingButton"

    ]

  },

  {

    "id": "card",

    "label": "Card",

    "members": [

      "Card"

    ]

  },

  {

    "id": "checkbox",

    "label": "Checkbox",

    "members": [

      "Checkbox"

    ]

  },

  {

    "id": "empty",

    "label": "Empty",

    "members": [

      "EmptyState"

    ]

  },

  {

    "id": "field",

    "label": "Field",

    "members": [

      "FormField"

    ]

  },

  {

    "id": "input",

    "label": "Input",

    "members": [

      "Input",

      "SearchInput"

    ]

  },

  {

    "id": "label",

    "label": "Label",

    "members": [

      "Label"

    ]

  },

  {

    "id": "linkbutton",

    "label": "LinkButton",

    "members": [

      "LinkButton"

    ]

  },

  {

    "id": "progress",

    "label": "Progress",

    "members": [

      "Progress"

    ]

  },

  {

    "id": "radio",

    "label": "Radio",

    "members": [

      "Radio"

    ]

  },

  {

    "id": "select",

    "label": "Select",

    "members": [

      "Select"

    ]

  },

  {

    "id": "separator",

    "label": "Separator",

    "members": [

      "Separator"

    ]

  },

  {

    "id": "skeleton",

    "label": "Skeleton",

    "members": [

      "Skeleton"

    ]

  },

  {

    "id": "slider",

    "label": "Slider",

    "members": [

      "Slider"

    ]

  },

  {

    "id": "sonner",

    "label": "Sonner",

    "members": [

      "Sonner"

    ]

  },

  {

    "id": "spinner",

    "label": "Spinner",

    "members": [

      "Spinner"

    ]

  },

  {

    "id": "switch",

    "label": "Switch",

    "members": [

      "Switch"

    ]

  },

  {

    "id": "table",

    "label": "Table",

    "members": [

      "Table"

    ]

  },

  {

    "id": "tabs",

    "label": "Tabs",

    "members": [

      "Tabs"

    ]

  },

  {

    "id": "textarea",

    "label": "Textarea",

    "members": [

      "Textarea"

    ]

  },

  {

    "id": "toggle",

    "label": "Toggle",

    "members": [

      "Toggle"

    ]

  }

];



componentFamilies.push({"id": "popover", "label": "Popover", "members": ["Popover"]},{"id": "dialog", "label": "Dialog", "members": ["Dialog"]},{"id": "alertdialog", "label": "AlertDialog", "members": ["AlertDialog"]},{"id": "dropdownmenu", "label": "DropdownMenu", "members": ["DropdownMenu"]},{"id": "contextmenu", "label": "ContextMenu", "members": ["ContextMenu"]},{"id": "combobox", "label": "Combobox", "members": ["Combobox"]},{"id": "multiselect", "label": "MultiSelect", "members": ["MultiSelect"]},{"id": "togglegroup", "label": "ToggleGroup", "members": ["ToggleGroup", "SegmentedControl"]},{"id": "datepicker", "label": "DatePicker", "members": ["DatePicker"]},{"id": "daterangepicker", "label": "DateRangePicker", "members": ["DateRangePicker"]},{"id": "breadcrumb", "label": "Breadcrumb", "members": ["Breadcrumb"]});

componentFamilies.push({ id: "filterselect", label: "FilterSelect", members: ["FilterSelect"] });

componentFamilies.push({ id: "pagination", label: "Pagination", members: ["Pagination"] });

componentFamilies.push({ id: "sidebar", label: "Sidebar", members: ["Sidebar"] });
componentFamilies.sort((a, b) => a.label.localeCompare(b.label, "en"));


export const foundationPages = [
 { id: "logo", label: "Logo", description: "Approved Flexge logo and symbol applications, from the visual identity manual." },
 { id: "colors", label: "Colors", description: "Semantic roles and complete base palettes from Flexge Design System 2.0." },
 { id: "typography", label: "Typography", description: "The Inter type scale and line-height tokens." },
 { id: "icons", label: "Icons", description: "The icon library, slot sizes and interactive component examples." },
 { id: "spacing", label: "Spacing", description: "Shared spacing tokens for consistent layouts." },
 { id: "radius", label: "Radius", description: "Corner-radius tokens for controls and surfaces." },
 { id: "motion", label: "Motion", description: "Shared timing, easing and accessible feedback for component interactions." },
 { id: "shadows", label: "Shadows", description: "Elevation tokens for surfaces and floating content." },
] as const;
export type FoundationId = typeof foundationPages[number]["id"];

/** Keep existing bookmarked component URLs working after regrouping the catalog. */
export function resolveComponentFamily(component = "button") {
  const id = component === "segmentedcontrol" ? "togglegroup" : component;
  return componentFamilies.find(entry => entry.id === id) ?? componentFamilies.find(entry => entry.id === "button")!;
}
