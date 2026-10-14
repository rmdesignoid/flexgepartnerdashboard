import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const context = createContext({ exports: {} });
runInContext(ts.transpileModule(readFileSync(new URL('../src/design-system/palettes.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context);
const palettes = context.exports.colorPalettes;
const css = readFileSync(new URL('../src/design-system/palette.css', import.meta.url), 'utf8');
const variables = new Map([...css.matchAll(/(--ds-color-[\w-]+):\s*(#[\da-f]+);/g)].map(match => [match[1], match[2]]));
const tokens = readFileSync(new URL('../src/design-system/tokens.css', import.meta.url), 'utf8');

test('all Figma base-color swatches resolve to their distributed CSS values', () => {
  const colors = palettes.flatMap(palette => palette.colors);
  assert.equal(palettes.length, 25);
  assert.equal(colors.length, 255);
  assert.equal(variables.size, 255);
  for (const color of colors) assert.equal(variables.get(color.token), color.hex, color.token);
  assert.equal(variables.get('--ds-color-flexge-blue-600'), '#285d8d');
  assert.equal(variables.get('--ds-color-flexge-violet-600'), '#753fe5');
  assert.equal(variables.get('--ds-color-red-100'), '#ffe2e2');
});

test('semantic aliases reference real primitives and preserve existing UI colors', () => {
  assert.match(tokens, /@import "\.\/palette\.css"/);
  for (const match of tokens.matchAll(/var\((--ds-color-[\w-]+)\)/g)) assert.ok(variables.has(match[1]), match[1]);
  for (const [role, value] of [['primary', '#285d8d'], ['accent', '#753fe5'], ['border', '#d1d5db'], ['foreground', '#374151'], ['danger', '#dc2626']]) {
    const variable = tokens.match(new RegExp(`--ds-${role}: var\\((--ds-color-[\\w-]+)\\)`))[1];
    assert.equal(variables.get(variable), value);
  }
  assert.match(tokens, /--ds-primary: #4f86b5;/);
});

test('every reusable registry bundle includes the base palette stylesheet', () => {
  const registry = JSON.parse(readFileSync(new URL('../registry/registry.json', import.meta.url), 'utf8'));
  for (const item of registry.items) assert.ok(item.files.some(file => file.path === 'src/design-system/palette.css'), item.name);
});
