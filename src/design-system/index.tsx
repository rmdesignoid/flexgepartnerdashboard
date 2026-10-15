"use client";
/* eslint-disable @next/next/no-img-element -- Native images preserve SVG geometry across React consumers. */
import { Children, isValidElement, createContext, forwardRef, useContext, useEffect, useId, useRef, useState, type AnchorHTMLAttributes, type ComponentPropsWithoutRef, type CSSProperties, type LabelHTMLAttributes, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode, type ReactElement, type SelectHTMLAttributes, type TableHTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes, type TextareaHTMLAttributes } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { DayPicker, DayButton, type DateRange } from "react-day-picker";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Toaster as SonnerToaster, toast as sonnerToast, type ToasterProps } from "sonner";
import { Check, Search, X, ChevronRight, CalendarDays } from "lucide-react";
import "./styles.css";
import "./motion.css";
const DialogLayerContext = createContext(0);
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "ghost-muted" | "destructive" | "accent" | "danger";
export type ControlSize = "mini" | "small" | "regular" | "large" | "sm" | "md" | "lg";
export type AvatarSize = "extra-tiny" | "tiny" | "small" | "regular" | "sm" | "md" | "lg";
const cx = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ");
const controlSize = (size: ControlSize) => ({ sm: "small", md: "small", lg: "large" }[size as "sm" | "md" | "lg"] ?? size);
const avatarSize = (size: AvatarSize) => ({ sm: "tiny", md: "small", lg: "regular" }[size as "sm" | "md" | "lg"] ?? size);
export type IconSlots = { startIcon?: ReactNode; endIcon?: ReactNode };
export type SidebarProps = HTMLAttributes<HTMLElement> & { collapsed?: boolean };
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar({ collapsed = false, className, children, ...props }, ref) {
  return <aside {...props} ref={ref} data-collapsed={collapsed} className={cx("sidebar", "ds-sidebar", collapsed && "is-collapsed", className)}>{children}</aside>;
});
export function SidebarMain({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div {...props} className={cx("sidebar__main", className)} />; }
export function SidebarFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div {...props} className={cx("sidebar__footer", className)} />; }
export type SidebarNavItem = { id: string; label: string; icon?: ReactNode; href?: string; badge?: ReactNode; disabled?: boolean };
export type SidebarNavGroup = { label: string; items: readonly SidebarNavItem[] };
export type SidebarNavigationProps = HTMLAttributes<HTMLElement> & { groups: readonly SidebarNavGroup[]; activeId?: string; collapsed?: boolean; collapsedGroups?: ReadonlySet<string>; onGroupToggle?: (label: string) => void; onItemSelect?: (id: string) => void };
export function SidebarNavigation({ groups, activeId, collapsed = false, collapsedGroups, onGroupToggle, onItemSelect, className, ...props }: SidebarNavigationProps) {
  const instanceId = useId();
  const [internalGroups, setInternalGroups] = useState<Set<string>>(() => new Set());
  const hiddenGroups = collapsedGroups ?? internalGroups;
  const toggleGroup = (label: string) => {
    if (collapsedGroups === undefined) setInternalGroups(current => { const next = new Set(current); if (next.has(label)) next.delete(label); else next.add(label); return next; });
    onGroupToggle?.(label);
  };
  return <nav {...props} className={cx("nav-groups", className)} aria-label={props["aria-label"] ?? "Main navigation"}>{groups.map((group, index) => {
    const id = `${instanceId}-group-${index}`;
    const expanded = collapsed || !hiddenGroups.has(group.label);
    return <section className="nav-group" key={group.label}><button type="button" className="nav-group__title" aria-expanded={expanded} aria-controls={id} onClick={() => toggleGroup(group.label)}><span>{group.label}</span><ChevronRight size={13} aria-hidden="true" className="ds-sidebar-group-chevron" /></button><div id={id} className={cx("nav-group__items", !expanded && "is-collapsed")} aria-hidden={!expanded || undefined} inert={!expanded || undefined}><div className="nav-group__items-inner">{group.items.map(item => {
      const active = item.id === activeId;
      const common = { className: cx("nav-item", active && "is-active"), "aria-label": item.label, "aria-current": active ? "page" as const : undefined, "data-tooltip": item.label, title: collapsed ? item.label : undefined };
      const content = <>{item.icon}<span className="ds-sidebar-item-label">{item.label}</span>{item.badge !== undefined && <span className="ds-sidebar-badge">{item.badge}</span>}</>;
      return item.href && !item.disabled ? <a {...common} href={item.href} key={item.id} onClick={() => onItemSelect?.(item.id)}>{content}</a> : <button {...common} type="button" key={item.id} disabled={item.disabled} onClick={() => onItemSelect?.(item.id)}>{content}</button>;
    })}</div></div></section>;
  })}</nav>;
}
export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> & { pageCount: number; page?: number; defaultPage?: number; onPageChange?: (page: number) => void; disabled?: boolean; previousLabel?: string; nextLabel?: string; pageLabel?: (page: number) => string; ellipsisLabel?: string };
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination({ pageCount, page, defaultPage = 1, onPageChange, disabled = false, previousLabel = "Previous", nextLabel = "Next", pageLabel = value => `Page ${value}`, ellipsisLabel = "More pages", className, ...props }, ref) {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const count = Number.isFinite(pageCount) ? Math.max(1, Math.floor(pageCount)) : 1;
  const requestedPage = page ?? internalPage;
  const current = Number.isFinite(requestedPage) ? Math.max(1, Math.min(count, Math.floor(requestedPage))) : 1;
  const changePage = (next: number) => {
    if (disabled || next === current || next < 1 || next > count) return;
    if (page === undefined) setInternalPage(next);
    onPageChange?.(next);
  };
  const start = current <= 4 ? 1 : current >= count - 3 ? Math.max(1, count - 3) : current - 1;
  const end = current <= 4 ? Math.min(count, 4) : current >= count - 3 ? count : current + 1;
  const visible = new Set([1, count]);
  for (let value = start; value <= end; value++) visible.add(value);
  if (count <= 7) for (let value = 1; value <= count; value++) visible.add(value);
  const pages: Array<number | string> = [];
  for (const value of [...visible].sort((a, b) => a - b)) {
    const previous = pages.at(-1);
    if (typeof previous === "number" && value - previous === 2) pages.push(previous + 1);
    else if (typeof previous === "number" && value - previous > 2) pages.push(`gap-${previous}`);
    pages.push(value);
  }
  return <nav {...props} ref={ref} aria-label={props["aria-label"] ?? "Pagination"} className={cx("ds-pagination", className)}><ul className="ds-pagination-list">
    <li><Button variant="ghost" size="mini" className="ds-pagination-button" disabled={disabled || current === 1} onClick={() => changePage(current - 1)} startIcon={<img src="/design-system/pagination-previous.svg" width={13.25} height={13.25} alt="" />}>{previousLabel}</Button></li>
    {pages.map(value => <li key={value}>{typeof value === "number" ? <Button variant="ghost" size="mini" className="ds-pagination-button" aria-label={pageLabel(value)} aria-current={value === current ? "page" : undefined} disabled={disabled} onClick={() => changePage(value)}>{value}</Button> : <span className="ds-pagination-ellipsis" role="img" aria-label={ellipsisLabel}><img src="/design-system/pagination-ellipsis.svg" width={16.25} height={16.25} alt="" /></span>}</li>)}
    <li><Button variant="ghost" size="mini" className="ds-pagination-button" disabled={disabled || current === count} onClick={() => changePage(current + 1)} endIcon={<img src="/design-system/pagination-next.svg" width={13.25} height={13.25} alt="" />}>{nextLabel}</Button></li>
  </ul></nav>;
});
export function IconSlot({ children, size = 16, className }: { children: ReactNode; size?: 12 | 16 | 20 | 24; className?: string }) {
  if (children === null || children === undefined || children === false) return null;
  return <span className={cx("ds-icon-slot", `ds-icon-slot--${size}`, className)} aria-hidden="true">{children}</span>;
}
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, IconSlots { variant?: ButtonVariant; size?: ControlSize; loading?: boolean; loadingLabel?: string; roundness?: "default" | "round"; }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = "primary", size = "regular", loading = false, loadingLabel, disabled, children, startIcon, endIcon, className, roundness = "default", type = "button", ...props }, ref) {
  return <button {...props} type={type} ref={ref} className={cx("ds-button", `ds-button--${variant === "danger" ? "destructive" : variant}`, `ds-control--${controlSize(size)}`, roundness === "round" && "ds-round", className)} disabled={disabled || loading} aria-busy={loading || undefined}>{loading && <span className="ds-spinner" aria-hidden="true"><img src="/design-system/spinner.svg" width={13} height={13} alt="" /></span>}{!loading && <IconSlot size={controlSize(size) === "mini" ? 12 : 16}>{startIcon}</IconSlot>}{loading && loadingLabel ? loadingLabel : children}<IconSlot size={controlSize(size) === "mini" ? 12 : 16}>{endIcon}</IconSlot></button>;
});
export const LoadingButton = forwardRef<HTMLButtonElement, ButtonProps>(function LoadingButton({ className, ...props }, ref) { return <Button variant="outline" {...props} ref={ref} className={cx("ds-loading-button", className)} loading />; });
export const IconButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { size?: ControlSize; label: string; icon?: ReactNode; variant?: ButtonVariant; roundness?: "default" | "round" }>(function IconButton({ size = "regular", variant = "outline", label, roundness = "default", className, children, icon, type = "button", ...props }, ref) {
  return <Button {...props} type={type} ref={ref} variant={variant} size={size} roundness={roundness} className={cx("ds-icon-button", className)} aria-label={label}><IconSlot size={controlSize(size) === "mini" ? 12 : 16}>{icon ?? children}</IconSlot></Button>;
});
const FieldContext = createContext<{ id: string; describedBy?: string; invalid?: boolean; required?: boolean } | null>(null);
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & IconSlots & { invalid?: boolean; leading?: ReactNode; trailing?: ReactNode; endAction?: { icon: ReactNode; label: string; onClick: () => void; disabled?: boolean } };
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ invalid, leading, trailing, startIcon, endIcon, endAction, className, ...props }, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const start = startIcon !== undefined ? (startIcon === null || startIcon === false ? null : <IconSlot>{startIcon}</IconSlot>) : leading;
  const end = endIcon !== undefined ? (endIcon === null || endIcon === false ? null : <IconSlot>{endIcon}</IconSlot>) : trailing;
  const field = useContext(FieldContext);
  const input = <input {...props} ref={node => { inputRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }} id={props.id ?? field?.id} required={props.required ?? field?.required} className={cx("ds-input", className)} aria-invalid={invalid ?? props["aria-invalid"] ?? field?.invalid} aria-describedby={cx(props["aria-describedby"], field?.describedBy) || undefined} />;
  return start || end || endAction ? <span className={cx("ds-input-shell", !!start && "has-leading", !!end && "has-trailing", !!endAction && "has-action")}>
    {start && <span className="ds-input-decoration ds-input-decoration--leading" aria-hidden="true">{start}</span>}{input}
    {end && <span className="ds-input-decoration ds-input-decoration--trailing" aria-hidden="true">{end}</span>}
    {endAction && <IconButton className="ds-input-action" size="small" variant="ghost-muted" label={endAction.label} disabled={props.disabled || endAction.disabled} onClick={() => { endAction.onClick(); inputRef.current?.focus(); }} icon={endAction.icon} />}
  </span> : input;
});
export const SearchInput = forwardRef<HTMLInputElement, InputProps>(function SearchInput({ startIcon, leading, ...props }, ref) { return <Input type="search" {...props} leading={leading} startIcon={startIcon !== undefined ? startIcon : leading === undefined ? <Search /> : undefined} ref={ref} />; });
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean; resizable?: boolean }>(function Textarea({ invalid, resizable = true, className, ...props }, ref) {
  const field = useContext(FieldContext);
  return <textarea {...props} ref={ref} id={props.id ?? field?.id} required={props.required ?? field?.required} className={cx("ds-input", "ds-textarea", !resizable && "ds-textarea--fixed", className)} aria-invalid={invalid ?? props["aria-invalid"] ?? field?.invalid} aria-describedby={cx(props["aria-describedby"], field?.describedBy) || undefined} />;
});
export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple" | "value" | "defaultValue"> & { value?: string; defaultValue?: string; invalid?: boolean; size?: ControlSize; loading?: boolean; leading?: ReactNode; startIcon?: ReactNode; description?: string };
type SelectOption = { value: string; label: ReactNode; disabled?: boolean; group?: string };
function selectOptions(children: ReactNode, group?: string, disabled = false): SelectOption[] {
  return Children.toArray(children).flatMap(child => {
    if (!isValidElement<{ value?: string; label?: string; disabled?: boolean; children?: ReactNode }>(child)) return [];
    if (child.type === "option") return [{ value: String(child.props.value ?? child.props.children ?? ""), label: child.props.label ?? child.props.children, disabled: disabled || child.props.disabled, group }];
    return selectOptions(child.props.children, child.type === "optgroup" ? child.props.label : group, disabled || !!child.props.disabled);
  });
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ invalid, size = "regular", loading = false, leading, startIcon, description, className, children, value, defaultValue, onChange, autoFocus, ...props }, ref) {
  const field = useContext(FieldContext);
  const decoration = startIcon !== undefined ? (startIcon === null || startIcon === false ? null : <IconSlot size={20}>{startIcon}</IconSlot>) : leading;
  const options = selectOptions(children);
  const groups = options.reduce<Array<{ label?: string; options: SelectOption[] }>>((result, option) => {
    const previous = result[result.length - 1];
    if (previous && previous.label === option.group) previous.options.push(option);
    else result.push({ label: option.group, options: [option] });
    return result;
  }, []);
  const [localValue, setLocalValue] = useState(defaultValue ?? options.find(option => !option.disabled)?.value ?? "");
  const currentValue = value ?? localValue;
  const native = useRef<HTMLSelectElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useState<string>();
  const emptyValue = `empty-${useId()}`;
  const id = props.id ?? field?.id;
  const disabled = props.disabled || loading;
  const required = props.required ?? field?.required;
  const ariaInvalid = invalid ?? props["aria-invalid"] ?? field?.invalid;
  const describedBy = cx(props["aria-describedby"], field?.describedBy) || undefined;
  const resetting = useRef(false);
  useEffect(() => {
    const control = native.current;
    const form = control?.form;
    if (!form) return;
    const reset = () => {
      resetting.current = true;
      queueMicrotask(() => {
        if (control) {
          if (value !== undefined) control.value = value;
          else setLocalValue(control.value);
        }
        resetting.current = false;
      });
    };
    form.addEventListener("reset", reset, true);
    return () => form.removeEventListener("reset", reset, true);
  }, [value]);
  return <span className={cx("ds-select-shell", `ds-select-shell--${controlSize(size)}`, !!decoration && "has-leading", !!description && "has-description")} onChangeCapture={event => {
    // Radix's unnamed form bridge is redundant; only our native control emits consumer events.
    if (event.target !== native.current) event.stopPropagation();
  }}>

    <SelectPrimitive.Root value={currentValue === "" ? emptyValue : currentValue} disabled={disabled} required={required} onOpenChange={open => { if (open) setTheme(trigger.current?.closest("[data-theme]")?.getAttribute("data-theme") ?? undefined); }} onValueChange={next => {
      const control = native.current;
      if (!control || resetting.current) return;
      control.value = next === emptyValue ? "" : next;
      control.dispatchEvent(new Event("change", { bubbles: true }));
    }}>
      {/* eslint-disable-next-line jsx-a11y/no-autofocus -- Forward explicit consumer autofocus to the visible control. */}
      <SelectPrimitive.Trigger ref={trigger} form={props.form} id={id} className={cx("ds-input", "ds-select", className)} style={props.style} title={props.title} autoFocus={autoFocus} tabIndex={props.tabIndex} aria-label={props["aria-label"]} aria-labelledby={props["aria-labelledby"]} aria-describedby={describedBy} aria-invalid={ariaInvalid} aria-busy={loading || undefined}>
        {decoration && <span className="ds-input-decoration ds-input-decoration--leading" aria-hidden="true">{decoration}</span>}
        <SelectPrimitive.Value>{options.find(option => option.value === currentValue)?.label}</SelectPrimitive.Value>
        {description && <span className="ds-select-description">{description}</span>}
        <SelectPrimitive.Icon className={cx("ds-select-decoration", loading && "ds-spinner")}><img src={loading ? "/design-system/spinner.svg" : "/design-system/chevron-down.svg"} width={loading ? 13 : 16} height={loading ? 13 : 16} alt="" /></SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className={cx("ds-select-menu", controlSize(size) === "large" && "ds-select-menu--large")} data-theme={theme} position="popper" sideOffset={4} collisionPadding={8}>
          <SelectPrimitive.ScrollUpButton className="ds-select-scroll"><img src="/design-system/chevron-down.svg" width={16} height={16} alt="" /></SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="ds-select-viewport">{groups.map((group, index) => <SelectPrimitive.Group key={index}>
            {group.label && <SelectPrimitive.Label className="ds-select-group-label">{group.label}</SelectPrimitive.Label>}
            {group.options.map(option => <SelectPrimitive.Item key={option.value} value={option.value === "" ? emptyValue : option.value} disabled={option.disabled} className="ds-select-option">
              <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              <SelectPrimitive.ItemIndicator className="ds-select-check"><Check size={16} aria-hidden="true" /></SelectPrimitive.ItemIndicator>
            </SelectPrimitive.Item>)}
          </SelectPrimitive.Group>)}</SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="ds-select-scroll"><img src="/design-system/chevron-down.svg" width={16} height={16} alt="" /></SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
    <select {...props} ref={node => { native.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }} id={undefined} style={undefined} className="ds-select-native" tabIndex={-1} aria-hidden="true" disabled={disabled} required={required} value={currentValue} onFocus={() => trigger.current?.focus()} onInvalid={event => { event.preventDefault(); trigger.current?.focus(); props.onInvalid?.(event); }} onChange={event => { setLocalValue(event.target.value); onChange?.(event); }}>{children}</select>
  </span>;
});
export function FormField({ label, hint, error, required, children, orientation = "vertical", id: suppliedId }: { label: string; hint?: string; error?: string; required?: boolean; children: ReactNode; orientation?: "vertical" | "horizontal"; id?: string }) {
  const generated = useId(); const child = Children.toArray(children).find(node => isValidElement<{ id?: string }>(node) && node.props.id); const childId = isValidElement<{ id?: string }>(child) ? child.props.id : undefined; const id = suppliedId ?? childId ?? `field-${generated}`; const message = error || hint;
  return <FieldContext.Provider value={{ id, required, invalid: !!error, describedBy: message ? `${id}-message` : undefined }}><div className={cx("ds-field", orientation === "horizontal" && "ds-field--horizontal")}><label htmlFor={id} className="ds-field__label">{label}{required && <span aria-hidden="true"> *</span>}</label><div className="ds-field__control">{children}{message && <span id={`${id}-message`} className={error ? "ds-field__error" : "ds-field__hint"}>{message}</span>}</div></div></FieldContext.Provider>;
}
export type BadgeTone = "neutral" | "danger" | "success" | "info" | "warning";
export function Badge({ children, startIcon, endIcon, tone = "neutral", emphasis = "subtle", className, ...props }: HTMLAttributes<HTMLSpanElement> & IconSlots & { tone?: BadgeTone; emphasis?: "subtle" | "strong" }) { return <span {...props} className={cx("ds-badge", `ds-badge--${tone}`, `ds-badge--${emphasis}`, className)}><IconSlot size={12}>{startIcon}</IconSlot>{children}<IconSlot size={12}>{endIcon}</IconSlot></span>; }
export function StatusBadge({ status, ...icons }: { status: string } & IconSlots) { const slug = status.toLowerCase().replace(/\s+/g, "-"); return <Badge {...icons} className={["to-plan", "planning", "planned", "taught"].includes(slug) ? `ds-status-badge--${slug}` : undefined}>{status}</Badge>; }
export function Avatar({ name, src, size = "regular", roundness = "round" }: { name: string; src?: string; size?: AvatarSize; roundness?: "round" | "roundrect" }) {
  const [failedSrc, setFailedSrc] = useState<string>(); const initials = name.trim().split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
  return <span className={cx("ds-avatar", `ds-avatar--${avatarSize(size)}`, roundness === "roundrect" && "ds-avatar--roundrect")} role="img" aria-label={name}>{src && src !== failedSrc ? <img src={src} alt="" onError={() => setFailedSrc(src)} /> : initials}</span>;
}
export function AvatarStack({ items, max = 4, size = "small" }: { items: Array<{ id?: string; name: string; src?: string }>; max?: number; size?: AvatarSize }) {
  const visible = items.slice(0, Math.max(0, max)); const remaining = items.length - visible.length;
  return <div className="ds-avatar-stack" aria-label={`${items.length} people`}>{visible.map((item, index) => <Avatar key={item.id ?? `${item.name}-${index}`} {...item} size={size} />)}{remaining > 0 && <span className={`ds-avatar ds-avatar--${avatarSize(size)} ds-avatar-stack__overflow`} aria-label={`${remaining} more people`}>+{remaining}</span>}</div>;
}
export function Card({ children, className, header, footer, ...props }: HTMLAttributes<HTMLElement> & { header?: ReactNode; footer?: ReactNode }) { return <section {...props} className={cx("ds-card", className)}>{header && <header className="ds-card__header">{header}</header>}<div className="ds-card__body">{children}</div>{footer && <footer className="ds-card__footer">{footer}</footer>}</section>; }
export type TabItem = { value: string; label: string; href?: string; icon?: ReactNode; startIcon?: ReactNode; endIcon?: ReactNode; disabled?: boolean; counter?: number; content?: ReactNode };
export function Tabs({ items, value, onChange, size = "regular", label = "Content navigation" }: { items: TabItem[]; value: string; onChange: (value: string) => void; size?: "small" | "regular" | "large"; label?: string }) {
  const id = useId(); const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  // eslint-disable-next-line jsx-a11y/anchor-is-valid -- Disabled navigation links intentionally omit href, following LinkButton semantics.
  if (items.length > 0 && items.every(item => item.href)) return <nav className={`ds-tabs ds-tabs--${size}`} aria-label={label}>{items.map(item => <a key={item.value} className={cx("ds-tab", item.value === value && "is-active")} href={item.disabled ? undefined : item.href} role={item.disabled ? "link" : undefined} aria-current={item.value === value ? "location" : undefined} aria-disabled={item.disabled || undefined} tabIndex={item.disabled ? -1 : undefined} onClick={event => { if (item.disabled) event.preventDefault(); else onChange(item.value); }}><IconSlot>{item.startIcon !== undefined ? item.startIcon : item.icon}</IconSlot>{item.label}<IconSlot>{item.endIcon}</IconSlot>{item.counter !== undefined && <span className="ds-tab-counter">{item.counter}</span>}</a>)}</nav>;
  return <><div className={`ds-tabs ds-tabs--${size}`} role="tablist" aria-label={label}>{items.map((item, index) => <button key={item.value} ref={node => { buttons.current[index] = node; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={item.content !== undefined ? `${id}-panel-${index}` : undefined} aria-selected={item.value === value} tabIndex={item.value === value ? 0 : -1} disabled={item.disabled} className={cx("ds-tab", item.value === value && "is-active")} onClick={() => onChange(item.value)} onKeyDown={event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return; event.preventDefault();
    const enabled = items.map((entry, i) => entry.disabled ? -1 : i).filter(i => i >= 0); if (!enabled.length) return;
    const position = enabled.indexOf(index); const next = event.key === "Home" ? enabled[0] : event.key === "End" ? enabled[enabled.length - 1] : enabled[(position + (event.key === "ArrowRight" ? 1 : enabled.length - 1)) % enabled.length];
    onChange(items[next].value); buttons.current[next]?.focus();
  }}><IconSlot>{item.startIcon !== undefined ? item.startIcon : item.icon}</IconSlot>{item.label}<IconSlot>{item.endIcon}</IconSlot>{item.counter !== undefined && <span className="ds-tab-counter">{item.counter}</span>}</button>)}</div>{items.map((item, index) => item.content !== undefined && <div key={item.value} id={`${id}-panel-${index}`} role="tabpanel" aria-labelledby={`${id}-tab-${index}`} hidden={item.value !== value} tabIndex={0}>{item.content}</div>)}</>;
}
export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) { return <div className="ds-empty-state">{icon && <span className="ds-empty-state__icon"><IconSlot size={20}>{icon}</IconSlot></span>}<h3>{title}</h3>{description && <p>{description}</p>}{action}</div>; }

export type SonnerProps = Omit<ToasterProps, "theme"> & { theme?: "light" | "dark" };
export const toast = Object.assign((message: Parameters<typeof sonnerToast>[0], options?: Parameters<typeof sonnerToast>[1]) => sonnerToast(message, { ...options, icon: options?.icon === null ? null : <IconSlot size={24}>{options?.icon ?? <img src="/design-system/toast-default.svg" alt="" />}</IconSlot> }), sonnerToast);
export const Sonner = forwardRef<HTMLElement, SonnerProps>(function Sonner({ theme, toastOptions, icons, style, ...props }, ref) {
  const normalizedIcons = Object.fromEntries(Object.entries(icons ?? {}).map(([name, icon]) => [name, <IconSlot key={name} size={name === "close" ? 12 : 24}>{icon}</IconSlot>]));
  return <div className="ds-sonner-host" data-theme={theme}><SonnerToaster ref={ref} theme={theme} position="bottom-center" visibleToasts={3} gap={16} offset={32} mobileOffset={16} containerAriaLabel="Notifications" {...props} style={{ "--width": "356px", ...style } as React.CSSProperties} icons={{ loading: <img className="ds-toast-loader" src="/design-system/toast-loader.svg" alt="" />, ...normalizedIcons }} toastOptions={{ ...toastOptions, classNames: { ...toastOptions?.classNames, toast: cx("ds-toast", toastOptions?.classNames?.toast), title: "ds-toast-title", description: "ds-toast-description", actionButton: "ds-toast-action", cancelButton: "ds-toast-action", icon: "ds-toast-icon" } }} /></div>;
});
export function ToastCard({ title, description, loading, icon = <img src="/design-system/toast-default.svg" alt="" />, action }: { title: ReactNode; description?: ReactNode; loading?: boolean; icon?: ReactNode; action?: { label: string; onClick: () => void } }) {
  return <div className="ds-toast-card"><span className="ds-toast-icon" aria-hidden="true">{loading ? <img className="ds-toast-loader" src="/design-system/toast-loader.svg" alt="" /> : <IconSlot size={24}>{icon}</IconSlot>}</span><div className="ds-toast-content"><div className="ds-toast-title">{title}</div>{description && <div className="ds-toast-description">{description}</div>}</div>{action && <Button size="mini" variant="secondary" className="ds-toast-action" onClick={action.onClick}>{action.label}</Button>}</div>;
}
export function ToastStack({ levels = 1, ...props }: Parameters<typeof ToastCard>[0] & { levels?: 1 | 2 | 3 }) {
  return <div className={`ds-toast-stack ds-toast-stack--${levels}`}>{Array.from({ length: levels - 1 }, (_, index) => <div key={index} className="ds-toast-backdrop" aria-hidden="true" />)}<ToastCard {...props} /></div>;
}
export const Table = forwardRef<HTMLTableElement, TableHTMLAttributes<HTMLTableElement>>(function Table({ className, children, ...props }, ref) { return <div className="ds-table-scroll"><table {...props} ref={ref} className={cx("ds-table", className)}>{children}</table></div>; });
export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableHeader({ className, ...props }, ref) { return <thead {...props} ref={ref} className={cx("ds-table-header", className)} />; });
export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableBody({ className, ...props }, ref) { return <tbody {...props} ref={ref} className={cx("ds-table-body", className)} />; });
export const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableFooter({ className, ...props }, ref) { return <tfoot {...props} ref={ref} className={cx("ds-table-footer", className)} />; });
export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement> & { selected?: boolean; state?: "default" | "hover" | "active" | "selected" }>(function TableRow({ className, selected, state, ...props }, ref) { return <tr {...props} ref={ref} className={cx("ds-table-row", className)} data-state={selected ? "selected" : state} />; });
export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement> & { align?: "left" | "right"; onSort?: () => void; sortDirection?: "none" | "ascending" | "descending" }>(function TableHead({ className, align = "left", scope = "col", onSort, sortDirection = "none", children, ...props }, ref) {
  return <th {...props} ref={ref} scope={scope} className={cx("ds-table-head", `ds-table-align-${align}`, className)} aria-sort={onSort ? sortDirection : props["aria-sort"]}>{onSort ? <Button className="ds-table-sort" variant="ghost" size="mini" onClick={onSort} endIcon={<img src="/design-system/table-sort.svg" width={16} height={16} alt="" />}>{children}</Button> : children}</th>;
});
export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement> & { align?: "left" | "right"; description?: ReactNode }>(function TableCell({ className, align = "left", description, children, ...props }, ref) { return <td {...props} ref={ref} className={cx("ds-table-cell", `ds-table-align-${align}`, !!description && "ds-table-cell--two-lines", className)}>{children}{description && <div className="ds-table-cell-description">{description}</div>}</td>; });
export const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(function TableCaption({ className, ...props }, ref) { return <caption {...props} ref={ref} className={cx("ds-table-caption", className)} />; });

export type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & { invalid?: boolean };
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox({ invalid, className, ...props }, ref) {
  const field = useContext(FieldContext); const control = useRef<HTMLButtonElement>(null);
  return <span className="ds-checkbox-shell" onInvalidCapture={event => { event.preventDefault(); control.current?.focus(); }}><CheckboxPrimitive.Root {...props} ref={node => { control.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }} id={props.id ?? field?.id} required={props.required ?? field?.required} aria-invalid={invalid ?? props["aria-invalid"] ?? field?.invalid} aria-describedby={cx(props["aria-describedby"], field?.describedBy) || undefined} className={cx("ds-checkbox", className)}><CheckboxPrimitive.Indicator className="ds-checkbox-indicator"><img className="ds-checkbox-check" src="/design-system/checkbox-check.svg" width={14} height={14} alt="" /><img className="ds-checkbox-minus" src="/design-system/checkbox-minus.svg" width={14} height={14} alt="" /></CheckboxPrimitive.Indicator></CheckboxPrimitive.Root></span>;
});
export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & { invalid?: boolean };
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ invalid, className, "aria-invalid": ariaInvalid, ...props }, ref) {
  const field = useContext(FieldContext); const errorState = invalid ?? ariaInvalid ?? field?.invalid; const error = errorState === true || errorState === "true" || errorState === "grammar" || errorState === "spelling";
  return <span className="ds-radio-shell"><input {...props} ref={ref} type="radio" id={props.id ?? field?.id} required={props.required ?? field?.required} data-invalid={error || undefined} aria-describedby={cx(props["aria-describedby"], field?.describedBy) || undefined} className={cx("ds-choice-input", className)} /><img className="ds-choice-off" src={`/design-system/radio-${error ? "error-" : ""}off.svg`} width={21} height={21} alt="" /><img className="ds-choice-on" src={`/design-system/radio-${error ? "error-" : ""}on.svg`} width={17} height={17} alt="" /></span>;
});
export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size">;
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({ className, ...props }, ref) {
  const field = useContext(FieldContext);
  return <span className="ds-switch-shell"><input {...props} ref={ref} type="checkbox" role="switch" id={props.id ?? field?.id} required={props.required ?? field?.required} aria-describedby={cx(props["aria-describedby"], field?.describedBy) || undefined} className={cx("ds-choice-input", className)} /><span className="ds-switch-track" aria-hidden="true"><span className="ds-switch-thumb" /></span></span>;
});
export type SliderProps = ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { label: string; thumbLabels?: string[] };
export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider({ label, thumbLabels, className, value, defaultValue = [50], ...props }, ref) {
  const values = value ?? defaultValue;
  return <SliderPrimitive.Root {...props} ref={ref} value={value} defaultValue={defaultValue} className={cx("ds-slider", className)}><SliderPrimitive.Track className="ds-slider-track"><SliderPrimitive.Range className="ds-slider-range" /></SliderPrimitive.Track>{values.map((_, index) => <SliderPrimitive.Thumb key={index} className="ds-slider-thumb" aria-label={thumbLabels?.[index] ?? (values.length === 1 ? label : `${label} · ${index === 0 ? "minimum" : "maximum"}`)} />)}</SliderPrimitive.Root>;
});
export function Progress({ value, max = 100, label, className, ...props }: Omit<HTMLAttributes<HTMLDivElement>, "children"> & { value?: number; max?: number; label: string }) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current = value === undefined || !Number.isFinite(value) ? undefined : Math.min(limit, Math.max(0, value));
  return <div {...props} className={cx("ds-progress", current === undefined && "is-indeterminate", className)} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={limit} aria-valuenow={current}><div className="ds-progress-value" style={current === undefined ? undefined : { width: `${current / limit * 100}%` }} /></div>;
}
export function Separator({ orientation = "horizontal", spacing = "regular", decorative = true, className, ...props }: HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical"; spacing?: "none" | "regular" | "spacious"; decorative?: boolean }) {
  return <div {...props} className={cx("ds-separator", `ds-separator--${orientation}`, `ds-separator--${spacing}`, className)} role={decorative ? "none" : "separator"} aria-hidden={decorative || undefined} aria-orientation={decorative ? undefined : orientation}><span /></div>;
}
export function Skeleton({ variant = "line", width, height, className, style, ...props }: HTMLAttributes<HTMLDivElement> & { variant?: "line" | "object" | "avatar"; width?: CSSProperties["width"]; height?: CSSProperties["height"] }) {
  return <div {...props} className={cx("ds-skeleton", `ds-skeleton--${variant}`, className)} aria-hidden="true" style={{ width, height, ...style }}>{variant === "avatar" && <img src="/design-system/skeleton-avatar.svg" width={48} height={48} alt="" />}</div>;
}
export function Spinner({ mirrored = false, label, className, ...props }: HTMLAttributes<HTMLSpanElement> & { mirrored?: boolean; label?: string }) {
  return <span {...props} className={cx("ds-core-spinner", className)} role={label ? "status" : undefined} aria-label={label} aria-hidden={!label || undefined}><img src={`/design-system/spinner-${mirrored ? "mirrored" : "default"}.svg`} width={16} height={16} alt="" /></span>;
}
export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean; layout?: "inline" | "block" }>(function Label({ required, layout = "block", className, children, ...props }, ref) { return <label {...props} ref={ref} className={cx("ds-label", `ds-label--${layout}`, className)}>{children}{required && <span aria-hidden="true"> *</span>}</label>; });
export interface ToggleProps extends ButtonProps { pressed?: boolean; defaultPressed?: boolean; onPressedChange?: (pressed: boolean) => void; }
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle({ pressed, defaultPressed = false, onPressedChange, variant = "outline", className, onClick, ...props }, ref) {
  const [localPressed, setLocalPressed] = useState(defaultPressed); const active = pressed ?? localPressed;
  return <Button {...props} ref={ref} variant={variant} className={cx("ds-toggle", className)} aria-pressed={active} onClick={event => { onClick?.(event); if (!event.defaultPrevented) { setLocalPressed(!active); onPressedChange?.(!active); } }} />;
});
export const LinkButton = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & IconSlots & { size?: ControlSize; roundness?: "default" | "round"; disabled?: boolean; variant?: ButtonVariant }>(function LinkButton({ variant = "ghost", size = "regular", roundness = "default", disabled, startIcon, endIcon, className, children, href, onClick, ...props }, ref) {
  return <a {...props} ref={ref} href={disabled ? undefined : href} role={disabled ? "link" : props.role} aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : props.tabIndex} className={cx("ds-button", "ds-link-button", `ds-button--${variant === "danger" ? "destructive" : variant}`, `ds-control--${controlSize(size)}`, roundness === "round" && "ds-round", className)} onClick={event => { if (disabled) event.preventDefault(); else onClick?.(event); }}><IconSlot size={controlSize(size) === "mini" ? 12 : 16}>{startIcon}</IconSlot>{children}<IconSlot size={controlSize(size) === "mini" ? 12 : 16}>{endIcon}</IconSlot></a>;
});


// Portal surfaces inherit the nearest consumer theme rather than the document theme.
function useOverlayTheme() {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [theme, setTheme] = useState<string>();
  useEffect(() => {
    const owner = anchorRef.current?.closest("[data-theme]");
    if (!owner) return;
    const update = () => setTheme(owner.getAttribute("data-theme") ?? undefined);
    update();
    const observer = new MutationObserver(update);
    observer.observe(owner, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return { anchorRef, theme };
}
export type PopoverProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> & {
  trigger: ReactElement; children: ReactNode; label: string; align?: "start" | "center" | "end"; side?: "top" | "right" | "bottom" | "left"; className?: string; contentId?: string; onOpenAutoFocus?: ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>["onOpenAutoFocus"];
};
export function Popover({ trigger, children, label, align = "start", side = "bottom", className, contentId, onOpenAutoFocus, ...props }: PopoverProps) {
  const dialogLayer = useContext(DialogLayerContext);
  const { anchorRef, theme } = useOverlayTheme();
  return <PopoverPrimitive.Root {...props}><span ref={anchorRef} className="ds-overlay-anchor"><PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger></span><PopoverPrimitive.Portal><PopoverPrimitive.Content style={dialogLayer ? { zIndex: 1301 + dialogLayer * 100, pointerEvents: "auto" } : undefined} onOpenAutoFocus={onOpenAutoFocus} id={contentId} aria-label={label} align={align} side={side} sideOffset={8} collisionPadding={12} className={cx("ds-root ds-popover", className)} data-theme={theme}>{children}</PopoverPrimitive.Content></PopoverPrimitive.Portal></PopoverPrimitive.Root>;
}
export type DialogProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root> & { trigger: ReactElement; title: string; description?: string; children: ReactNode; footer?: ReactNode; className?: string; size?: "regular" | "wide"; scroll?: "dialog" | "body" };
export function Dialog({ trigger, title, description, children, footer, className, size = "regular", scroll = "dialog", ...props }: DialogProps) {
  const dialogLayer = useContext(DialogLayerContext);
  const { anchorRef, theme } = useOverlayTheme();
  return <DialogPrimitive.Root {...props}><span ref={anchorRef} className="ds-overlay-anchor"><DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger></span><DialogPrimitive.Portal><DialogPrimitive.Overlay className="ds-dialog-overlay" /><DialogPrimitive.Content className={cx("ds-root ds-dialog", size === "wide" && "ds-dialog--wide", scroll === "body" && "ds-dialog--body-scroll", className)} data-theme={theme}><header className="ds-dialog-header"><DialogPrimitive.Title className="ds-dialog-title">{title}</DialogPrimitive.Title>{description ? <DialogPrimitive.Description className="ds-dialog-description">{description}</DialogPrimitive.Description> : <DialogPrimitive.Description className="ds-visually-hidden">{title}</DialogPrimitive.Description>}</header><div className="ds-dialog-body"><DialogLayerContext.Provider value={dialogLayer + 1}>{children}</DialogLayerContext.Provider></div><DialogPrimitive.Close asChild><IconButton className="ds-dialog-close" label="Close dialog" variant="ghost" size="small" icon={<X />} /></DialogPrimitive.Close>{footer && <footer className="ds-dialog-footer">{footer}</footer>}</DialogPrimitive.Content></DialogPrimitive.Portal></DialogPrimitive.Root>;
}
export const DialogClose = DialogPrimitive.Close;
export type AlertDialogProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root> & { trigger: ReactElement; title: string; description: string; actionLabel: string; cancelLabel?: string; onConfirm: () => void; destructive?: boolean };
export function AlertDialog({ trigger, title, description, actionLabel, cancelLabel = "Cancel", onConfirm, destructive = false, ...props }: AlertDialogProps) {
  const { anchorRef, theme } = useOverlayTheme();
  return <AlertDialogPrimitive.Root {...props}><span ref={anchorRef} className="ds-overlay-anchor"><AlertDialogPrimitive.Trigger asChild>{trigger}</AlertDialogPrimitive.Trigger></span><AlertDialogPrimitive.Portal><AlertDialogPrimitive.Overlay className="ds-dialog-overlay" /><AlertDialogPrimitive.Content className="ds-root ds-dialog" data-theme={theme}><AlertDialogPrimitive.Title className="ds-dialog-title">{title}</AlertDialogPrimitive.Title><AlertDialogPrimitive.Description className="ds-dialog-description">{description}</AlertDialogPrimitive.Description><footer className="ds-dialog-footer"><AlertDialogPrimitive.Cancel asChild><Button variant="outline">{cancelLabel}</Button></AlertDialogPrimitive.Cancel><AlertDialogPrimitive.Action asChild><Button variant={destructive ? "destructive" : "primary"} onClick={onConfirm}>{actionLabel}</Button></AlertDialogPrimitive.Action></footer></AlertDialogPrimitive.Content></AlertDialogPrimitive.Portal></AlertDialogPrimitive.Root>;
}
export type MenuItem = { id: string; label?: string; icon?: ReactNode; shortcut?: string; disabled?: boolean; destructive?: boolean; separator?: boolean; children?: MenuItem[]; onSelect?: () => void };
function MenuItems({ items, context = false, theme }: { items: MenuItem[]; context?: boolean; theme?: string }) {
  const Menu = context ? ContextMenuPrimitive : DropdownPrimitive;
  return <>{items.map(item => item.separator ? <Menu.Separator className="ds-menu-separator" key={item.id} /> : item.children ? <Menu.Sub key={item.id}><Menu.SubTrigger disabled={item.disabled} className="ds-menu-item"><IconSlot>{item.icon}</IconSlot>{item.label}<ChevronRight className="ds-menu-trailing" size={16} /></Menu.SubTrigger><Menu.Portal><Menu.SubContent className="ds-root ds-menu" data-theme={theme} sideOffset={4} collisionPadding={12}><MenuItems items={item.children} context={context} theme={theme} /></Menu.SubContent></Menu.Portal></Menu.Sub> : <Menu.Item key={item.id} disabled={item.disabled} onSelect={item.onSelect} className={cx("ds-menu-item", item.destructive && "ds-menu-item--destructive")}><IconSlot>{item.icon}</IconSlot><span>{item.label}</span>{item.shortcut && <span className="ds-menu-shortcut">{item.shortcut}</span>}</Menu.Item>)}</>;
}
export type DropdownMenuProps = ComponentPropsWithoutRef<typeof DropdownPrimitive.Root> & { trigger: ReactElement; items: MenuItem[]; label: string; align?: "start" | "center" | "end" };
export function DropdownMenu({ trigger, items, label, align = "start", ...props }: DropdownMenuProps) {
  const { anchorRef, theme } = useOverlayTheme();
  return <DropdownPrimitive.Root {...props}><span ref={anchorRef} className="ds-overlay-anchor"><DropdownPrimitive.Trigger asChild>{trigger}</DropdownPrimitive.Trigger></span><DropdownPrimitive.Portal><DropdownPrimitive.Content aria-label={label} align={align} sideOffset={8} collisionPadding={12} className="ds-root ds-menu" data-theme={theme}><MenuItems items={items} theme={theme} /></DropdownPrimitive.Content></DropdownPrimitive.Portal></DropdownPrimitive.Root>;
}
export function ContextMenu({ children, items, label }: { children: ReactNode; items: MenuItem[]; label: string }) {
  const { anchorRef, theme } = useOverlayTheme();
  return <ContextMenuPrimitive.Root><span ref={anchorRef} className="ds-overlay-anchor"><ContextMenuPrimitive.Trigger className="ds-context-trigger" tabIndex={0} aria-label={label}>{children}</ContextMenuPrimitive.Trigger></span><ContextMenuPrimitive.Portal><ContextMenuPrimitive.Content aria-label={label} collisionPadding={12} className="ds-root ds-menu" data-theme={theme}><MenuItems items={items} context theme={theme} /></ContextMenuPrimitive.Content></ContextMenuPrimitive.Portal></ContextMenuPrimitive.Root>;
}
export type ToggleGroupProps = ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & { label: string; items: Array<{ value: string; label: string; icon?: ReactNode; disabled?: boolean }> };
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup({ label, items, className, ...props }, ref) {
  return <ToggleGroupPrimitive.Root {...props} ref={ref} aria-label={label} className={cx("ds-toggle-group", className)}>{items.map(item => <ToggleGroupPrimitive.Item key={item.value} value={item.value} disabled={item.disabled} className="ds-toggle-group-item"><IconSlot>{item.icon}</IconSlot>{item.label}</ToggleGroupPrimitive.Item>)}</ToggleGroupPrimitive.Root>;
});
export type SegmentedControlProps = Omit<Extract<ToggleGroupProps, { type: "single" }>, "type">;
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl({ onValueChange, value, defaultValue, ...props }, ref) {
  return <ToggleGroup {...props} value={value === undefined ? undefined : value || props.items[0]?.value} defaultValue={defaultValue || props.items[0]?.value} ref={ref} type="single" onValueChange={value => { if (value) onValueChange?.(value); }} />;
});
export type ComboboxOption = { value: string; label: string; icon?: ReactNode; disabled?: boolean; keywords?: string[] };
export type ComboboxProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange" | "onSelect"> & { label: string; options: ComboboxOption[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; placeholder?: string; searchPlaceholder?: string; emptyMessage?: string; name?: string; required?: boolean; invalid?: boolean; startIcon?: ReactNode };
function SearchableSelection({ label, options, selected, onSelect, placeholder, searchPlaceholder, emptyMessage, name, multiple, required, invalid, startIcon, ...props }: Omit<ComboboxProps, "value" | "defaultValue" | "onValueChange"> & { selected: string[]; onSelect: (value: string) => void; multiple?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>();
  const field = useContext(FieldContext);
  const listId = useId();
  const matches = options.filter(option => [option.label, ...(option.keywords ?? [])].join(" ").toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const available = matches.filter(option => !option.disabled);
  const current = available.find(option => option.value === active) ?? available[0];
  const optionId = (value: string) => `${listId}-${options.findIndex(option => option.value === value)}`;
  const title = options.filter(option => selected.includes(option.value)).map(option => option.label).join(", ");
  const choose = (value: string) => { onSelect(value); if (!multiple) setOpen(false); };
  return <><Popover open={open} onOpenChange={next => { setOpen(next); if (next) { setQuery(""); setActive(selected[0]); } }} label={label} className={multiple ? "ds-combobox-popover ds-multiselect-popover" : "ds-combobox-popover"} trigger={<button {...props} type="button" id={props.id ?? field?.id} className={cx("ds-input ds-combobox-trigger", props.className)} role="combobox" aria-label={props["aria-label"] ?? label} aria-expanded={open} aria-controls={listId} aria-haspopup="listbox" aria-required={required ?? field?.required} aria-invalid={invalid ?? field?.invalid} aria-describedby={cx(props["aria-describedby"], field?.describedBy) || undefined}><IconSlot>{startIcon}</IconSlot><span className={title ? undefined : "ds-placeholder"}>{title || placeholder || "Select an option"}</span><img src="/design-system/chevron-down.svg" alt="" width={16} height={16} /></button>}><div className={multiple ? "ds-multiselect-search" : "ds-combobox-search"}><FieldContext.Provider value={null}><SearchInput id={`${listId}-search`} role="combobox" aria-expanded={open} aria-controls={listId} aria-activedescendant={current ? optionId(current.value) : undefined} aria-label={`Search ${label.toLowerCase()}`} value={query} onChange={event => setQuery(event.target.value)} placeholder={searchPlaceholder ?? "Search options…"} onKeyDown={event => {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!available.length) return;
      const index = available.findIndex(option => option.value === current?.value);
      const next = event.key === "Home" ? 0 : event.key === "End" ? available.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + available.length) % available.length;
      const value = available[next].value;
      setActive(value);
      document.getElementById(optionId(value))?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter") { event.preventDefault(); if (current) choose(current.value); }
  }} /></FieldContext.Provider></div><div id={listId} role="listbox" aria-label={label} aria-multiselectable={multiple || undefined} className="ds-command-list">{!matches.length && <div className="ds-command-empty" role="status">{emptyMessage ?? "No options found."}</div>}{matches.map(option => <div key={option.value} id={optionId(option.value)} role="option" tabIndex={-1} onKeyDown={event => { if (!option.disabled && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); choose(option.value); } }} aria-selected={selected.includes(option.value)} aria-disabled={option.disabled || undefined} onPointerMove={() => { if (!option.disabled) setActive(option.value); }} onMouseDown={event => event.preventDefault()} onClick={() => { if (!option.disabled) choose(option.value); }} className="ds-menu-item ds-combobox-option" data-selected={current?.value === option.value} data-checked={selected.includes(option.value)}>{multiple && <span className="ds-multiselect-check" aria-hidden="true">{selected.includes(option.value) && <Check size={16} />}</span>}<IconSlot size={20}>{option.icon}</IconSlot><span className="ds-combobox-option-label">{option.label}</span>{!multiple && <span className="ds-combobox-option-indicator" aria-hidden="true">{selected.includes(option.value) && <Check size={16} />}</span>}</div>)}</div></Popover>{(required ?? field?.required) && <input type="text" tabIndex={-1} aria-hidden="true" className="ds-visually-hidden" required value={selected.join(",")} onChange={() => {}} disabled={props.disabled} onInvalid={event => { event.preventDefault(); setOpen(true); }} />}{name && selected.map(value => <input key={value} type="hidden" name={name} value={value} disabled={props.disabled} />)}</>;
}
export function Combobox({ value, defaultValue = "", onValueChange, ...props }: ComboboxProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  return <SearchableSelection {...props} selected={current ? [current] : []} onSelect={next => { if (value === undefined) setInternal(next); onValueChange?.(next); }} />;
}
export type MultiSelectProps = Omit<ComboboxProps, "value" | "defaultValue" | "onValueChange"> & { value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void };
export function MultiSelect({ value, defaultValue = [], onValueChange, ...props }: MultiSelectProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  return <SearchableSelection {...props} multiple selected={current} onSelect={next => { const result = current.includes(next) ? current.filter(item => item !== next) : [...current, next]; if (value === undefined) setInternal(result); onValueChange?.(result); }} />;
}
function CalendarNavigationButton({ children, className, disabled, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button {...props} size="small" variant="outline" className={cx("ds-calendar-nav-button", className)} disabled={disabled || props["aria-disabled"] === true || props["aria-disabled"] === "true"}>{children}</Button>;
}
function CalendarDayButton(props: ComponentPropsWithoutRef<typeof DayButton>) { return <DayButton {...props} disabled={props.disabled || props.modifiers.outside} />; }
function isCalendarDate(value: Date | DateRange | undefined): value is Date { return Object.prototype.toString.call(value) === "[object Date]" && !Number.isNaN((value as Date).getTime()); }
export type DateRangePreset = { label: string; value: DateRange };
export function defaultDateRangePresets(now = new Date()): DateRangePreset[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const week = new Date(today); week.setDate(today.getDate() - today.getDay());
  const previousWeek = new Date(week); previousWeek.setDate(week.getDate() - 7);
  const weekEnd = new Date(week); weekEnd.setDate(week.getDate() + 6);
  const previousWeekEnd = new Date(previousWeek); previousWeekEnd.setDate(previousWeek.getDate() + 6);
  return [{ label: "This week", value: { from: week, to: weekEnd } }, { label: "Last week", value: { from: previousWeek, to: previousWeekEnd } }, { label: "This month", value: { from: new Date(today.getFullYear(), today.getMonth(), 1), to: new Date(today.getFullYear(), today.getMonth() + 1, 0) } }, { label: "Last month", value: { from: new Date(today.getFullYear(), today.getMonth() - 1, 1), to: new Date(today.getFullYear(), today.getMonth(), 0) } }, ...[30, 60, 90].map(days => { const from = new Date(today); from.setDate(today.getDate() - days + 1); return { label: `Last ${days} days`, value: { from, to: today } }; })];
}
export type DatePickerProps = { label: string; value?: Date; defaultValue?: Date; onValueChange?: (value: Date | undefined) => void; minDate?: Date; maxDate?: Date; disabled?: boolean; placeholder?: string; name?: string; id?: string; required?: boolean; invalid?: boolean };
function CalendarSelection({ label, value, range, onSelect, minDate, maxDate, disabled, placeholder, name, id, required, invalid, presets }: Omit<DatePickerProps, "defaultValue" | "onValueChange" | "value"> & { value?: Date | DateRange; range?: boolean; presets?: DateRangePreset[]; onSelect: (value: Date | DateRange | undefined) => void }) {
  const [open, setOpen] = useState(false);
  const popupId = useId();
  const [anchor, setAnchor] = useState<Date>();
  const [hover, setHover] = useState<Date>();
  const field = useContext(FieldContext);
  const format = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const iso = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const interval = value && !(isCalendarDate(value)) ? value : undefined;
  const text = isCalendarDate(value) ? format(value) : interval?.from ? `${format(interval.from)} – ${interval.to ? format(interval.to) : "End date"}` : placeholder ?? (range ? "Select date range" : "Select a date");
  const disabledDays = [...(minDate ? [{ before: minDate }] : []), ...(maxDate ? [{ after: maxDate }] : [])];
  const pendingEnd = hover ?? anchor;
  const displayedRange = anchor && pendingEnd ? { from: anchor < pendingEnd ? anchor : pendingEnd, to: anchor < pendingEnd ? pendingEnd : anchor } : interval;
  const shortcuts = presets ?? defaultDateRangePresets();
  const shared = { autoFocus: true, components: { DayButton: CalendarDayButton, PreviousMonthButton: CalendarNavigationButton, NextMonthButton: CalendarNavigationButton }, className: "ds-calendar", disabled: disabledDays, defaultMonth: isCalendarDate(value) ? value : interval?.from, startMonth: minDate, endMonth: maxDate };
  return <><Popover contentId={popupId} open={open} onOpenChange={next => { setOpen(next); setAnchor(undefined); setHover(undefined); }} label={label} className={range ? "ds-calendar-popover ds-calendar-popover--range" : "ds-calendar-popover ds-calendar-popover--single"} trigger={<button type="button" id={id ?? field?.id} disabled={disabled} role="combobox" aria-controls={popupId} aria-expanded={open} aria-haspopup="dialog" className="ds-input ds-combobox-trigger" aria-label={`${label}: ${text}`} aria-required={required ?? field?.required} aria-invalid={invalid ?? field?.invalid} aria-describedby={field?.describedBy}>{range && <IconSlot><CalendarDays /></IconSlot>}<span>{text}</span>{range ? <img src="/design-system/chevron-down.svg" alt="" width={16} height={16} /> : <IconSlot><CalendarDays /></IconSlot>}</button>}>{range ? <><div className="ds-calendar-presets">{shortcuts.map(preset => <button type="button" key={preset.label} disabled={!!(minDate && preset.value.from && preset.value.from < minDate) || !!(maxDate && preset.value.to && preset.value.to > maxDate)} aria-pressed={!anchor && !!interval?.from && !!interval.to && !!preset.value.from && !!preset.value.to && iso(interval.from) === iso(preset.value.from) && iso(interval.to) === iso(preset.value.to)} onClick={() => { onSelect(preset.value); setOpen(false); setAnchor(undefined); setHover(undefined); }}>{preset.label}</button>)}</div><div className="ds-range-calendars"><DayPicker {...shared} numberOfMonths={2} showOutsideDays fixedWeeks mode="range" selected={displayedRange} onDayMouseEnter={day => { if (anchor) setHover(day); }} onDayFocus={day => { if (anchor) setHover(day); }} onSelect={(_next, day) => { if (!anchor) { setAnchor(day); setHover(undefined); } else { onSelect({ from: anchor < day ? anchor : day, to: anchor < day ? day : anchor }); setOpen(false); setAnchor(undefined); setHover(undefined); } }} /><p className="ds-calendar-hint" role="status">{anchor ? "Select an end date." : "Select a start date, then an end date."}</p></div></> : <DayPicker {...shared} mode="single" selected={isCalendarDate(value) ? value : undefined} onSelect={next => { onSelect(next); setOpen(false); }} />}</Popover>{(required ?? field?.required) && <input type="text" tabIndex={-1} aria-hidden="true" className="ds-visually-hidden" required value={isCalendarDate(value) ? iso(value) : interval?.from && interval.to ? `${iso(interval.from)}/${iso(interval.to)}` : ""} onChange={() => {}} disabled={disabled} onInvalid={event => { event.preventDefault(); setOpen(true); }} />}{name && (range ? <><input type="hidden" name={`${name}.from`} value={interval?.from ? iso(interval.from) : ""} disabled={disabled} /><input type="hidden" name={`${name}.to`} value={interval?.to ? iso(interval.to) : ""} disabled={disabled} /></> : <input type="hidden" name={name} value={isCalendarDate(value) ? iso(value) : ""} disabled={disabled} />)}</>;
}
export function DatePicker(allProps: DatePickerProps) {
  const { value, defaultValue, onValueChange, ...props } = allProps;
  const controlled = Object.prototype.hasOwnProperty.call(allProps, "value");
  const [internal, setInternal] = useState(defaultValue);
  return <CalendarSelection {...props} value={controlled ? value : internal} onSelect={next => { if (!controlled) setInternal(next as Date | undefined); onValueChange?.(next as Date | undefined); }} />;
}
export type DateRangePickerProps = Omit<DatePickerProps, "value" | "defaultValue" | "onValueChange"> & { value?: DateRange; defaultValue?: DateRange; presets?: DateRangePreset[]; onValueChange?: (value: DateRange | undefined) => void };
export function DateRangePicker(allProps: DateRangePickerProps) {
  const { value, defaultValue, onValueChange, ...props } = allProps;
  const controlled = Object.prototype.hasOwnProperty.call(allProps, "value");
  const [internal, setInternal] = useState(defaultValue);
  return <CalendarSelection {...props} range value={controlled ? value : internal} onSelect={next => { if (!controlled) setInternal(next as DateRange | undefined); onValueChange?.(next as DateRange | undefined); }} />;
}
export type BreadcrumbItem = { label: string; href?: string };
export function Breadcrumb({ items, label = "Breadcrumb" }: { items: BreadcrumbItem[]; label?: string }) {
  return <nav className="ds-breadcrumb" aria-label={label}><ol>{items.map((item, index) => <li key={`${index}-${item.label}`}>{index > 0 && <ChevronRight size={14} aria-hidden="true" />}{index === items.length - 1 ? <span aria-current="page">{item.label}</span> : item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}</li>)}</ol></nav>;
}


export type FilterSelectProps = MultiSelectProps & { loading?: boolean; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; selectedLabel?: string; clearLabel?: string };
export const FilterSelect = forwardRef<HTMLButtonElement, FilterSelectProps>(function FilterSelect({ label, options, value, defaultValue = [], onValueChange, open: controlledOpen, defaultOpen = false, onOpenChange, loading = false, disabled, invalid, required, placeholder = "Select an Option", searchPlaceholder = "Filter", emptyMessage = "No options found.", selectedLabel = "Selected options", clearLabel = "Clean", startIcon, name, className, ...props }, ref) {
  const field = useContext(FieldContext);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>();
  const [keyboardActive, setKeyboardActive] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const selected = value ?? internalValue;
  const blocked = disabled || loading;
  const open = (controlledOpen ?? internalOpen) && !blocked;
  const summary = selected.length ? `${selected.length} selected` : placeholder;
  const matches = options.filter(option => !selected.includes(option.value) && [option.label, ...(option.keywords ?? [])].join(" ").toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const available = matches.filter(option => !option.disabled);
  const current = available.find(option => option.value === active) ?? available[0];
  const optionId = (option: string) => `${listId}-option-${options.findIndex(item => item.value === option)}`;
  function change(next: string[]) { if (blocked) return; if (value === undefined) setInternalValue(next); onValueChange?.(next); }
  function changeOpen(next: boolean) { if (next && blocked) return; if (controlledOpen === undefined) setInternalOpen(next); onOpenChange?.(next); if (next) { setQuery(""); setActive(undefined); setKeyboardActive(false); } }
  function choose(next: string) { change([...selected, next]); searchRef.current?.focus(); }
  return <><Popover label={label} open={open} onOpenChange={changeOpen} contentId={`${listId}-popover`} className="ds-filter-select-popover" onOpenAutoFocus={event => { event.preventDefault(); searchRef.current?.focus(); }} trigger={<button {...props} ref={ref} type="button" id={props.id ?? field?.id} disabled={blocked} data-loading={loading || undefined} onKeyDown={event => { props.onKeyDown?.(event); if (!event.defaultPrevented && (event.key === "ArrowDown" || event.key === "ArrowUp")) { event.preventDefault(); changeOpen(true); } }} role="combobox" aria-controls={`${listId}-popover`} aria-haspopup="dialog" aria-expanded={open} aria-label={props["aria-label"] ?? label} aria-busy={loading || undefined} aria-required={required ?? field?.required} aria-invalid={invalid ?? props["aria-invalid"] ?? field?.invalid} aria-describedby={cx(props["aria-describedby"], field?.describedBy) || undefined} className={cx("ds-input ds-combobox-trigger ds-filter-select", selected.length > 0 && "has-value", className)}>{startIcon === undefined ? <img src="/design-system/filter-search.svg" width={20} height={20} alt="" /> : <IconSlot size={20}>{startIcon}</IconSlot>}<span className={selected.length ? undefined : "ds-placeholder"}>{summary}</span><img className={loading ? "ds-filter-spinner" : undefined} src={loading ? "/design-system/filter-spinner.svg" : "/design-system/filter-chevron.svg"} width={16} height={16} alt="" /></button>}><div className="ds-filter-selected-heading"><span>{selectedLabel}</span><Button size="mini" variant="outline" disabled={!selected.length} onClick={() => { change([]); searchRef.current?.focus(); }}>{clearLabel}</Button></div><div className="ds-filter-tags">{selected.length ? selected.map(item => <span key={item} className="ds-filter-tag"><span>{options.find(option => option.value === item)?.label ?? item}</span><button type="button" aria-label={`Remove ${options.find(option => option.value === item)?.label ?? item}`} onClick={() => { change(selected.filter(value => value !== item)); searchRef.current?.focus(); }}><img src="/design-system/filter-remove.svg" width={12.1182} height={12.1172} alt="" /></button></span>) : <span className="ds-filter-empty-selection">No options selected.</span>}</div><Separator spacing="none" /><FieldContext.Provider value={null}><Input ref={searchRef} id={`${listId}-search`} role="combobox" aria-expanded={open} aria-controls={listId} aria-activedescendant={current ? optionId(current.value) : undefined} aria-label={`Filter ${label.toLowerCase()}`} value={query} placeholder={searchPlaceholder} onChange={event => setQuery(event.target.value)} onKeyDown={event => {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault(); if (!available.length) return;
      const index = available.findIndex(item => item.value === current?.value);
      const next = event.key === "Home" ? 0 : event.key === "End" ? available.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + available.length) % available.length;
      setKeyboardActive(true); setActive(available[next].value); document.getElementById(optionId(available[next].value))?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter") { event.preventDefault(); if (current) choose(current.value); }
  }} /></FieldContext.Provider><div id={listId} role="listbox" aria-label={label} aria-multiselectable="true" className="ds-filter-options">{matches.map(option => <div key={option.value} id={optionId(option.value)} role="option" aria-selected="false" aria-disabled={option.disabled || undefined} tabIndex={-1} data-active={keyboardActive && current?.value === option.value} className="ds-filter-option" onPointerMove={() => { if (!option.disabled) setActive(option.value); }} onMouseDown={event => event.preventDefault()} onClick={() => { if (!option.disabled) choose(option.value); }} onKeyDown={event => { if (!option.disabled && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); choose(option.value); } }}><IconSlot>{option.icon}</IconSlot>{option.label}</div>)}{!matches.length && <div role="status" className="ds-filter-empty-selection">{emptyMessage}</div>}</div><span role="status" className="ds-visually-hidden">{selected.length} selected</span></Popover>{name && selected.map(item => <input key={item} type="hidden" name={name} value={item} disabled={disabled} />)}{(required ?? field?.required) && <input tabIndex={-1} aria-hidden="true" className="ds-visually-hidden" required value={selected.join(",")} disabled={blocked} onChange={() => {}} onInvalid={event => { event.preventDefault(); changeOpen(true); }} />}</>;
});
