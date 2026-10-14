"use client";
import { useEffect, useRef, useState } from "react";
import { Tabs } from ".";
import { colorTokens } from "./catalog";
import { colorPalettes } from "./palettes";

const semanticGroups = [
  { name: "Semantic UI colors", description: "Choose tokens by purpose for surfaces, text, actions and feedback. Values adapt to the selected theme.", tokens: [...colorTokens, "danger-hover"] },
  { name: "Interaction colors", description: "Supporting colors for selection, focus and control states.", tokens: ["menu-highlight", "menu-selected", "focus-color", "error-color", "placeholder", "slider-track"] },
  { name: "Status colors", description: "Text and soft-background pairs used by product status indicators.", tokens: ["status-slate", "status-slate-soft", "status-amber", "status-amber-soft", "status-violet", "status-violet-soft", "status-teal", "status-teal-soft"] },
  { name: "Component colors", description: "Existing color decisions scoped to badges and avatars.", tokens: ["badge-neutral", "badge-neutral-strong", "badge-danger", "badge-danger-strong", "badge-danger-border", "badge-success", "badge-success-strong", "badge-success-border", "avatar-foreground"] },
];

const colorSections = [
  { value: "semantic-colors", label: "Semantic colors", href: "#semantic-colors" },
  { value: "brand-palettes", label: "Brand", href: "#brand-palettes" },
  { value: "neutral-palettes", label: "Neutrals", href: "#neutral-palettes" },
  { value: "extended-palettes", label: "Extended palettes", href: "#extended-palettes" },
];

export function ColorFoundations() {
  const [section, setSection] = useState("semantic-colors");
  const tabsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = tabsRef.current?.closest(".catalog-main");
    if (!container) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = (tabsRef.current?.getBoundingClientRect().bottom ?? 0) + 24;
      let active = colorSections[0].value;
      for (const item of colorSections) {
        const target = document.getElementById(item.value);
        if (target && target.getBoundingClientRect().top <= threshold) active = item.value;
      }
      setSection(active);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const followHash = () => {
      const id = window.location.hash.slice(1);
      if (colorSections.some(item => item.value === id)) document.getElementById(id)?.scrollIntoView({ block: "start" });
      schedule();
    };
    followHash();
    container.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("hashchange", followHash);
    window.addEventListener("resize", schedule);
    return () => { container.removeEventListener("scroll", schedule); window.removeEventListener("hashchange", followHash); window.removeEventListener("resize", schedule); window.cancelAnimationFrame(frame); };
  }, []);
  const [notice, setNotice] = useState("");
  async function copyToken(token: string) {
    try { await navigator.clipboard.writeText(`var(${token})`); setNotice(`Copied var(${token}).`); }
    catch { setNotice(`Token: var(${token}). Select its name to copy manually.`); }
  }
  return <>
    <section className="catalog-panel catalog-color-guidance"><h3>Choose a color by its role</h3><div className="catalog-color-levels"><div><h4>Semantic tokens</h4><p>Use for UI meaning: surfaces, text, actions and status. Prefer <code>var(--ds-primary)</code> for a primary action rather than a fixed blue shade.</p><code>Base value → semantic role → component</code></div><div><h4>Base palettes</h4><p>Use exact hues for brand artwork, categorical charts and custom contexts without an existing semantic role. Validate the color pair against its actual background.</p><code>var(--ds-color-flexge-blue-600)</code></div></div><p>Base colors keep the same value in light and dark. Semantic tokens adapt to the theme. Color should support a label, icon or pattern when it communicates meaning.</p></section>
    <div className="catalog-color-tabs" ref={tabsRef}><Tabs label="Color sections" items={colorSections} value={section} onChange={setSection} /></div>
    <section className="catalog-panel" id="semantic-colors"><h3>Semantic colors</h3>{semanticGroups.map(group => <section className="catalog-semantic-group" key={group.name}><h4>{group.name}</h4><p>{group.description}</p><div className="catalog-color-grid">{group.tokens.map(token => <div className="catalog-color" key={token}><span style={{ background: `var(--ds-${token})` }} /><strong>{token}</strong><code>--ds-{token}</code></div>)}</div></section>)}</section>
    {(["Brand", "Neutral", "Extended"] as const).map(group => <section className="catalog-panel catalog-base-palettes" id={group === "Brand" ? "brand-palettes" : group === "Neutral" ? "neutral-palettes" : "extended-palettes"} key={group}><h3>{group === "Brand" ? "Brand palettes" : group === "Neutral" ? "Neutral palettes" : "Extended palettes"}</h3><p>{group === "Brand" ? "Official Flexge Blue and Flexge Violet scales from Figma." : group === "Neutral" ? "White, black and the complete neutral scales available in the design system." : "Supporting hue families available for brand expression, charts and custom color roles."}</p>{colorPalettes.filter(palette => palette.group === group).map(palette => <section className="catalog-palette-family" key={palette.name}><h4>{palette.name}</h4><div className="catalog-palette-scale" style={{ gridTemplateColumns: `repeat(${palette.colors.length}, minmax(64px, 1fr))` }}>{palette.colors.map(color => <div className="catalog-palette-color" key={color.token}><button type="button" style={{ background: `var(${color.token})` }} aria-label={`Copy ${color.token}`} title={`Copy var(${color.token})`} onClick={() => copyToken(color.token)} /><strong>{color.shade}</strong><span>{color.hex.toUpperCase()}</span><code>{color.token}</code></div>)}</div></section>)}</section>)}
    <p className="catalog-color-copy-status" role="status">{notice || "Click a base-color swatch to copy its CSS variable."}</p>
    <section className="catalog-panel catalog-color-references"><h3>Usage and references</h3><ul><li>Prefer semantic tokens when the color expresses a UI role.</li><li>Keep a consistent family for a custom role; create a semantic alias when that role is reused.</li><li>Check foreground and background together: normal text needs at least 4.5:1 contrast; large text needs 3:1.</li></ul><p>Palettes: <a href="https://www.figma.com/design/5sIAwYrLHz2GQnKg7cU9SX/Flexge-Design-System-2.0?node-id=842-44435" target="_blank" rel="noreferrer">Flexge Design System 2.0 — Colors</a>.</p><p>Token guidance: <a href="https://spectrum.adobe.com/page/design-tokens/" target="_blank" rel="noreferrer">Adobe Spectrum</a> · <a href="https://www.designsystem.tech.gov.sg/foundations/colour/primitive-colour" target="_blank" rel="noreferrer">Singapore Government Design System</a> · <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noreferrer">WCAG contrast requirements</a>.</p><p>Base tokens: <code>src/design-system/palette.css</code> · Semantic aliases: <code>src/design-system/tokens.css</code>.</p></section>
  </>;
}
