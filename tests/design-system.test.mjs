import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createContext, runInContext } from 'node:vm';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const context = createContext({ exports: {}, require: name => name.endsWith('.css') ? {} : require(name) });
const source = readFileSync(new URL('../src/design-system/index.tsx', import.meta.url), 'utf8');
runInContext(ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
const api = context.exports;
const render = (component, props, children) => renderToStaticMarkup(React.createElement(component, props, children));

test('core registry consumers receive every imported stylesheet, including motion', () => {
  const registry = JSON.parse(readFileSync(new URL('../registry/registry.json', import.meta.url), 'utf8'));
  const importedStyles = [...source.matchAll(/import "\.\/(.+\.css)"/g)].map(match => `src/design-system/${match[1]}`);
  for (const item of registry.items.filter(item => item.files.some(file => file.path === 'src/design-system/index.tsx'))) {
    for (const path of importedStyles) assert.ok(item.files.some(file => file.path === path), `${item.name} is missing ${path}`);
  }
});

test('anchor tabs preserve real links and current-location semantics without hiding sections', () => {
  const html = render(api.Tabs, { label: 'Color sections', value: 'brand', onChange() {}, items: [{ value: 'semantic', label: 'Semantic', href: '#semantic-colors' }, { value: 'brand', label: 'Brand', href: '#brand-palettes' }, { value: 'disabled', label: 'Disabled', href: '#disabled', disabled: true }] });
  assert.match(html, /<nav[^>]*aria-label="Color sections"/);
  assert.match(html, /href="#brand-palettes" aria-current="location"/);
  assert.doesNotMatch(html, /role="tablist"|role="tabpanel"|href="#disabled"/);
  assert.match(html, /aria-disabled="true" tabindex="-1"/);
});

test('sidebar groups have unique disclosure targets and current-page semantics', () => {
  const props = { groups: [{ label: 'Classes', items: [{ id: 'planner', label: 'Planner' }, { id: 'students', label: 'Students', href: '/students' }] }], activeId: 'planner' };
  const html = render(api.SidebarNavigation, props);
  assert.match(html, /aria-label="Main navigation"/);
  assert.match(html, /aria-expanded="true" aria-controls="([^"]+)"/);
  const id = html.match(/aria-controls="([^"]+)"/)[1];
  assert.ok(html.includes(`id="${id}"`));
  assert.match(html, /<button[^>]*aria-label="Planner"[^>]*aria-current="page"/);
  assert.match(html, /<a[^>]*href="\/students"/);
  const hidden = render(api.SidebarNavigation, { ...props, collapsedGroups: new Set(['Classes']) });
  assert.match(hidden, /aria-expanded="false"/);
  assert.match(hidden, /<div[^>]*aria-hidden="true" inert=""/);
  const rail = render(api.SidebarNavigation, { ...props, collapsed: true, collapsedGroups: new Set(['Classes']) });
  assert.doesNotMatch(rail, /inert=""|aria-hidden="true" inert/);
  assert.match(rail, /title="Planner"/);
});

test('sidebar disabled items do not expose live links and instances avoid duplicate ids', () => {
  const props = { groups: [{ label: 'Classes', items: [{ id: 'students', label: 'Students', href: '/students', disabled: true }] }] };
  const html = render(api.SidebarNavigation, props);
  assert.doesNotMatch(html, /href="\/students"/);
  assert.match(html, /<button[^>]*disabled=""/);
  const siblings = render('div', {}, [React.createElement(api.SidebarNavigation, { ...props, key: 'one' }), React.createElement(api.SidebarNavigation, { ...props, key: 'two' })]);
  const ids = [...siblings.matchAll(/aria-controls="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, 2);
});

test('pagination identifies the current page and disables only boundary navigation', () => {
  const first = render(api.Pagination, { pageCount: 10 });
  assert.match(first, /<nav[^>]*aria-label="Pagination"/);
  assert.match(first, /<button[^>]*disabled=""[^>]*>[\s\S]*?Previous/);
  assert.match(first, /aria-label="Page 1" aria-current="page"/);
  const last = render(api.Pagination, { pageCount: 10, page: 10 });
  assert.match(last, /aria-label="Page 10" aria-current="page"/);
  assert.match(last, /<button[^>]*disabled=""[^>]*>Next/);
  assert.equal((first.match(/disabled=""/g) ?? []).length, 1);
  assert.equal((last.match(/disabled=""/g) ?? []).length, 1);
});

test('pagination preserves both endpoints and neighboring pages around ellipses', () => {
  const middle = render(api.Pagination, { pageCount: 20, page: 10 });
  for (const page of [1, 9, 10, 11, 20]) assert.match(middle, new RegExp(`aria-label="Page ${page}"`));
  assert.equal((middle.match(/aria-label="More pages"/g) ?? []).length, 2);
  assert.doesNotMatch(middle, /aria-label="Page 2"/);
  assert.doesNotMatch(render(api.Pagination, { pageCount: 3 }), /aria-label="More pages"/);
});

test('pagination handles a single page, changed bounds, disabled and localized labels', () => {
  const single = render(api.Pagination, { pageCount: 1, page: 8 });
  assert.match(single, /aria-label="Page 1" aria-current="page"/);
  assert.equal((single.match(/disabled=""/g) ?? []).length, 2);
  const bounded = render(api.Pagination, { pageCount: 3, page: 10 });
  assert.match(bounded, /aria-label="Page 3" aria-current="page"/);
  const localized = render(api.Pagination, { pageCount: 3, disabled: true, previousLabel: 'Anterior', nextLabel: 'Próxima', pageLabel: page => `Página ${page}` });
  assert.equal((localized.match(/disabled=""/g) ?? []).length, 5);
  assert.match(localized, /Anterior/);
  assert.match(localized, /Próxima/);
  assert.match(localized, /aria-label="Página 1"/);
});

test('loading retains the action name and blocks duplicate submission', () => {
  const html = render(api.Button, { loading: true }, 'Save changes');
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /Save changes/);
  assert.match(html, /spinner\.svg/);
});
test('buttons default to non-submit actions but allow explicit form submission', () => {
  assert.match(render(api.Button, {}, 'Cancel'), /type="button"/);
  assert.match(render(api.Button, { type: 'submit' }, 'Save'), /type="submit"/);
});
test('field associates label, required and error with the real control', () => {
  const html = render(api.FormField, { id: 'student-name', label: 'Name', required: true, error: 'Enter a name' }, React.createElement(api.Input));
  assert.match(html, /for="student-name"/);
  assert.match(html, /<input[^>]*id="student-name"/);
  assert.match(html, /required=""/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /aria-describedby="student-name-message"/);
  assert.match(html, /id="student-name-message"/);
});
test('select keeps its name and native options while loading', () => {
  const html = render(api.Select, { 'aria-label': 'Level', loading: true }, React.createElement('option', { value: 'A1' }, 'A1'));
  assert.match(html, /<select[^>]*aria-label="Level"/);
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /<option value="A1"[^>]*>A1<\/option>/);
  assert.match(html, /disabled=""/);
});
test('tab panels are associated and inactive content is hidden', () => {
  const html = render(api.Tabs, { value: 'first', onChange() {}, items: [{ value: 'first', label: 'First', content: 'First panel' }, { value: 'second', label: 'Second', content: 'Second panel' }] });
  assert.equal((html.match(/role="tabpanel"/g) ?? []).length, 2);
  assert.match(html, /aria-controls="[^"]+"/);
  assert.match(html, /aria-labelledby="[^"]+"/);
  assert.match(html, /hidden=""[^>]*>Second panel/);
  assert.equal((html.match(/tabindex="-1"/g) ?? []).length, 1);
});
test('repeated participant names and overflow render without losing participants', () => {
  const html = render(api.AvatarStack, { items: [{ id: 'a', name: 'Ana' }, { id: 'b', name: 'Ana' }, { id: 'c', name: 'Lucas' }], max: 2 });
  assert.match(html, /aria-label="3 people"/);
  assert.match(html, /aria-label="1 more people"/);
  assert.equal((html.match(/aria-label="Ana"/g) ?? []).length, 2);
});

test('select labels the visible trigger and preserves the native form contract', () => {
  const html = render(api.FormField, { id: 'level', label: 'Level', required: true, error: 'Choose a level' }, React.createElement(api.Select, { name: 'level', defaultValue: '' }, [React.createElement('option', { key: '', value: '' }, 'Choose'), React.createElement('option', { key: 'A1', value: 'A1' }, 'A1')]));
  assert.match(html, /<button[^>]*role="combobox"[^>]*id="level"/);
  assert.match(html, /aria-describedby="level-message"/);
  assert.match(html, /<select[^>]*name="level"[^>]*aria-hidden="true"[^>]*required=""/);
  assert.equal((html.match(/id="level"/g) ?? []).length, 1);
  assert.ok(html.indexOf('<button') < html.indexOf('name="level"'));
});

test('table uses semantic headers, sorting metadata and full-width empty cells', () => {
  const html = render(api.Table, { 'aria-label': 'Students' }, [React.createElement(api.TableCaption, { key: 'caption' }, 'Students'), React.createElement(api.TableHeader, { key: 'head' }, React.createElement(api.TableRow, {}, React.createElement(api.TableHead, { onSort() {}, sortDirection: 'ascending' }, 'Name'))), React.createElement(api.TableBody, { key: 'body' }, React.createElement(api.TableRow, { selected: true }, React.createElement(api.TableCell, { colSpan: 3, description: 'Active student' }, 'Ana')))]);
  assert.match(html, /<table[^>]*aria-label="Students"/);
  assert.match(html, /<caption/);
  assert.match(html, /<th[^>]*scope="col"[^>]*aria-sort="ascending"/);
  assert.match(html, /<button[^>]*type="button"/);
  assert.match(html, /data-state="selected"/);
  assert.match(html, /colSpan="3"|colspan="3"/);
  assert.match(html, /Active student/);
});
test('toast preserves action semantics and excludes decorative stack layers', () => {
  const html = render(api.ToastStack, { levels: 3, title: 'Saved', description: 'Changes saved', action: { label: 'Undo', onClick() {} } });
  assert.equal((html.match(/ds-toast-backdrop/g) ?? []).length, 2);
  assert.match(html, /ds-toast-backdrop" aria-hidden="true"/);
  assert.match(html, /<button type="button"[^>]*>Undo/);
  assert.match(html, /Changes saved/);
  assert.match(render(api.ToastCard, { title: 'Loading', loading: true }), /toast-loader.svg/);
});

test('button loading replaces only its start icon and keeps the action label', () => {
  const start = React.createElement('svg', { 'data-test': 'start' });
  const end = React.createElement('svg', { 'data-test': 'end' });
  const html = render(api.Button, { loading: true, startIcon: start, endIcon: end }, 'Save');
  assert.doesNotMatch(html, /data-test="start"/);
  assert.match(html, /data-test="end"/);
  assert.match(html, /Save/);
  assert.doesNotMatch(html, /startIcon=|endIcon=/);
});
test('input icon action is labelled, non-submit and disabled with the field', () => {
  const html = render(api.Input, { disabled: true, startIcon: React.createElement('svg'), endIcon: React.createElement('svg'), endAction: { label: 'Clear name', icon: React.createElement('svg'), onClick() {} } });
  assert.match(html, /has-leading has-trailing has-action/);
  assert.match(html, /<button(?=[^>]*type="button")(?=[^>]*aria-label="Clear name")(?=[^>]*disabled="")[^>]*>/);
  assert.doesNotMatch(html, /endAction=|startIcon=|endIcon=/);
});
test('explicit null icons remove decorations while legacy leading and trailing remain supported', () => {
  assert.doesNotMatch(render(api.Select, { startIcon: null }, React.createElement('option', { value: 'A1' }, 'A1')), /has-leading/);
  assert.match(render(api.Input, { leading: 'USD', trailing: '%' }), /USD/);
  assert.match(render(api.SearchInput, { startIcon: undefined }), /ds-icon-slot/);
  assert.doesNotMatch(render(api.SearchInput, { startIcon: null }), /ds-icon-slot/);
});
test('tab icons do not alter the accessible label or tab associations', () => {
  const html = render(api.Tabs, { value: 'a', onChange() {}, items: [{ value: 'a', label: 'Overview', startIcon: React.createElement('svg'), endIcon: React.createElement('svg'), content: 'Panel' }] });
  assert.match(html, /Overview/);
  assert.equal((html.match(/class="ds-icon-slot ds-icon-slot--16" aria-hidden="true"/g) ?? []).length, 2);
  assert.match(html, /aria-controls=/);
});

test('checkbox exposes mixed state, invalid messages and form association', () => {
  const html = render(api.Checkbox, { checked: 'indeterminate', 'aria-label': 'Select students', invalid: true, 'aria-describedby': 'selection-error', name: 'students' });
  assert.match(html, /role="checkbox"/);
  assert.match(html, /aria-checked="mixed"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /aria-describedby="selection-error"/);
});
test('radio and switch preserve native form controls and labels', () => {
  const radio = render(api.Radio, { name: 'channel', value: 'email', defaultChecked: true });
  assert.match(radio, /type="radio"/);
  assert.match(radio, /name="channel"/);
  assert.match(radio, /checked=""/);
  const toggle = render(api.Switch, { name: 'updates', disabled: true });
  assert.match(toggle, /role="switch"/);
  assert.match(toggle, /disabled=""/);
});
test('progress clamps numeric values and omits unknown progress', () => {
  assert.match(render(api.Progress, { label: 'Upload', value: 200, max: 100 }), /aria-valuenow="100"/);
  assert.match(render(api.Progress, { label: 'Upload', value: -1 }), /aria-valuenow="0"/);
  assert.doesNotMatch(render(api.Progress, { label: 'Upload' }), /aria-valuenow/);
});
test('toggle exposes its state and a disabled navigation link cannot navigate', () => {
  assert.match(render(api.Toggle, { defaultPressed: true }, 'Favorite'), /aria-pressed="true"/);
  const html = render(api.LinkButton, { href: '/students', disabled: true }, 'Students');
  assert.match(html, /aria-disabled="true"/);
  assert.doesNotMatch(html, /href=/);
});
test('separator and loading placeholders have appropriate accessibility semantics', () => {
  assert.match(render(api.Separator, { decorative: false, orientation: 'vertical' }), /role="separator" aria-orientation="vertical"/);
  assert.match(render(api.Skeleton, {}), /aria-hidden="true"/);
  assert.match(render(api.Spinner, { label: 'Loading' }), /role="status" aria-label="Loading"/);
});


test('searchable selections preserve values, names, disabled state and field messages', () => {
  const options = [{ value: 'ana', label: 'Ana' }, { value: 'lucas', label: 'Lucas' }];
  const html = render(api.FormField, { id: 'student', label: 'Student', required: true, error: 'Choose a student' }, React.createElement(api.Combobox, { label: 'Student', name: 'student', options, defaultValue: 'ana' }));
  assert.match(html, /role="combobox"/);
  assert.match(html, /id="student"/);
  assert.match(html, /aria-describedby="student-message"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /aria-required="true"/);
  assert.match(html, /type="hidden" name="student" value="ana"/);
  const multi = render(api.MultiSelect, { label: 'Students', name: 'students', options, defaultValue: ['ana', 'lucas'], disabled: true });
  assert.equal((multi.match(/name="students"/g) ?? []).length, 2);
  assert.match(multi, /Ana, Lucas/);
  assert.match(multi, /disabled=""/);
});
test('date fields submit local dates and a range has separate endpoints', () => {
  const date = new Date(2026, 9, 14);
  assert.match(render(api.DatePicker, { label: 'Date', defaultValue: date, name: 'date' }), /name="date" value="2026-10-14"/);
  const html = render(api.DateRangePicker, { label: 'Period', name: 'period', defaultValue: { from: date, to: new Date(2026, 9, 21) } });
  assert.match(html, /name="period.from" value="2026-10-14"/);
  assert.match(html, /name="period.to" value="2026-10-21"/);
  const cleared = render(api.DatePicker, { label: 'Date', value: undefined, defaultValue: date, name: 'date' });
  assert.match(cleared, /name="date" value=""/);
});
test('segmented selection defaults to one radio and multiple toggles expose pressed states', () => {
  const items = [{ value: 'small', label: 'Small' }, { value: 'regular', label: 'Regular' }];
  const html = render(api.SegmentedControl, { label: 'Size', items });
  assert.match(html, /role="radiogroup"/);
  assert.equal((html.match(/aria-checked="true"/g) ?? []).length, 1);
  const multi = render(api.ToggleGroup, { type: 'multiple', label: 'Options', items, defaultValue: ['small', 'regular'] });
  assert.equal((multi.match(/aria-pressed="true"/g) ?? []).length, 2);
});
test('breadcrumb preserves navigation and current page semantics', () => {
  const html = render(api.Breadcrumb, { items: [{ label: 'Planner', href: '/' }, { label: 'Current', href: '/current' }] });
  assert.match(html, /aria-label="Breadcrumb"/);
  assert.match(html, /href="\/"/);
  assert.match(html, /aria-current="page">Current/);
  assert.doesNotMatch(html, /href="\/current"/);
});

test('period presets match the product local-date rules', () => {
  const presets = api.defaultDateRangePresets(new Date(2026, 9, 14));
  const iso = date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  assert.equal(presets.length, 7);
  assert.equal(iso(presets.find(item => item.label === 'Last 30 days').value.from), '2026-9-15');
  assert.equal(iso(presets.find(item => item.label === 'This week').value.from), '2026-10-11');
  assert.equal(iso(presets.find(item => item.label === 'Last month').value.to), '2026-9-30');
});

test('filter select shows a count, preserves form values and isolates loading', () => {
  const options = [{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }];
  const html = render(api.FilterSelect, { label: 'Options', name: 'filters', defaultValue: ['a', 'b'], options });
  assert.match(html, /2 selected/);
  assert.equal((html.match(/name="filters"/g) ?? []).length, 2);
  assert.match(html, /role="combobox"/);
  assert.match(html, /filter-search.svg/);
  const loading = render(api.FilterSelect, { label: 'Options', options, loading: true });
  assert.match(loading, /aria-busy="true"/);
  assert.match(loading, /disabled=""/);
  assert.match(loading, /filter-spinner.svg/);
  assert.doesNotMatch(loading, /filter-chevron.svg/);
});
test('filter select inherits required and error associations from a field', () => {
  const html = render(api.FormField, { id: 'levels-filter', label: 'Levels', required: true, error: 'Choose a level' }, React.createElement(api.FilterSelect, { label: 'Levels', options: [] }));
  assert.match(html, /id="levels-filter"/);
  assert.match(html, /aria-describedby="levels-filter-message"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /aria-required="true"/);
  assert.match(html, /Select an Option/);
});

test('link button variants preserve real navigation and hide internal styling props', () => {
  const html = render(api.LinkButton, { href: '/design-system', variant: 'outline', size: 'mini', target: '_blank', rel: 'noreferrer' }, 'Reference');
  assert.match(html, /href="\/design-system"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /ds-button--outline/);
  assert.doesNotMatch(html, /variant="|size="/);
});
