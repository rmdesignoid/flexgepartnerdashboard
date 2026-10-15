import assert from 'node:assert/strict';
import test from 'node:test';
import server from '../.vercel/output/functions/__server.func/index.mjs';

test('ToggleGroup includes required-selection variation and preserves legacy bookmarks', async () => {
  for (const component of ['togglegroup', 'segmentedcontrol']) {
    const response = await server.fetch(new Request(`https://example.test/design-system?component=${component}`));
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /<h2[^>]*>ToggleGroup<\/h2>/);
    assert.match(html, /<h2[^>]*>SegmentedControl<\/h2>/);
    assert.match(html, /ToggleGroup variation that keeps exactly one option selected/);
    assert.match(html, /href="\/design-system\?component=togglegroup"[^>]*aria-current="page"/);
    assert.doesNotMatch(html, /href="\/design-system\?component=segmentedcontrol"/);
  }
});

test('design system has an independent English page with a route back to Planner', async () => {
  const response = await server.fetch(new Request('https://example.test/design-system'));
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Back to Planner/);
  assert.match(html, /href="\/"/);
  assert.match(html, /Design system index/);
  assert.match(html, /class="catalog-shell ds-root" data-theme="light"/);
  assert.doesNotMatch(html, /Main navigation|Open profile menu/);
  assert.doesNotMatch(html, /Fundamentos|Biblioteca de interface|Salvar alterações|Guia de uso/);
});

for (const [page, title, content] of [['logo', 'Logo', 'Full logo'], ['colors', 'Colors', 'Semantic colors'], ['typography', 'Typography', 'Type scale'], ['icons', 'Icons', 'Icon library'], ['spacing', 'Spacing', 'Spacing scale'], ['radius', 'Radius', 'Corner radii'], ['shadows', 'Shadows', 'Elevation'], ['motion', 'Motion', 'Purposeful feedback']]) {
  test(`foundation ${page} has an independent address and selected navigation`, async () => {
    const response = await server.fetch(new Request(`https://example.test/design-system/foundations/${page}`));
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(`<h2>${title}</h2>`));
    assert.ok(html.includes(content));
    assert.match(html, new RegExp(`(?=[^>]*href="/design-system/foundations/${page}")(?=[^>]*aria-current="page")[^>]*>`));
    if (page !== 'colors') assert.doesNotMatch(html, /<h3>Semantic colors<\/h3>/);
    if (page !== 'icons') assert.doesNotMatch(html, /id="catalog-icon-library"/);
  });
}

test('component links remain addressable from a foundation page', async () => {
  const response = await server.fetch(new Request('https://example.test/design-system?component=slider'));
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<h2[^>]*>Slider<\/h2>/);
  assert.doesNotMatch(html, /<h3>Semantic colors<\/h3>/);
});
