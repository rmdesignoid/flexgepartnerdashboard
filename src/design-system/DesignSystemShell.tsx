"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { IconButton, LinkButton } from ".";
import { componentFamilies, foundationPages, resolveComponentFamily } from "./catalog";
import "./catalog.css";

/** Persistent frame: navigation only replaces the page content. */
export function DesignSystemShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const foundation = pathname?.split("/foundations/")[1];
  const component = searchParams?.get("component") ?? "button";
  const family = resolveComponentFamily(component);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return <div className="catalog-shell ds-root" data-theme={theme}><main className="catalog catalog-standalone ds-root" lang="en" data-theme={theme}>
    <header className="catalog-header">
      <div className="catalog-header-leading"><LinkButton className="catalog-back" href="/" size="small" aria-label="Back to Planner" title="Back to Planner" startIcon={<ArrowLeft />} /><div><div className="catalog-title-row"><h1>Design System <span>v0.5</span></h1></div><p>Flexge 2.0 components and foundations.</p></div></div>
      <div className="catalog-theme-buttons" role="group" aria-label="Catalog theme">
        <IconButton label="Light theme" title="Light theme" size="small" variant={theme === "light" ? "secondary" : "ghost"} aria-pressed={theme === "light"} icon={<Sun />} onClick={() => setTheme("light")} />
        <IconButton label="Dark theme" title="Dark theme" size="small" variant={theme === "dark" ? "secondary" : "ghost"} aria-pressed={theme === "dark"} icon={<Moon />} onClick={() => setTheme("dark")} />
      </div>
    </header>
    <div className="catalog-layout">
      <nav className="catalog-nav" aria-label="Design system index">
        <div className="catalog-nav-family"><span className="catalog-nav-label">Foundations</span>{foundationPages.map(entry => <Link key={entry.id} href={`/design-system/foundations/${entry.id}`} scroll={false} aria-current={foundation === entry.id ? "page" : undefined}>{entry.label}</Link>)}</div>
        <div className="catalog-nav-family"><span className="catalog-nav-label">Components</span>{componentFamilies.map(entry => <Link key={entry.id} href={`/design-system?component=${entry.id}`} scroll={false} aria-current={!foundation && family.id === entry.id ? "page" : undefined}>{entry.label}</Link>)}</div>
      </nav>
      {children}
    </div>
  </main></div>;
}
