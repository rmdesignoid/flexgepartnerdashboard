"use client";

import { useId, useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { Button, Dialog, DialogClose, Label, Popover, Progress, Skeleton, Switch, ToggleGroup } from ".";

const timings = [
  ["fast", "120ms", "Hover, focus and selection feedback"],
  ["enter", "160ms", "Menus and popovers opening"],
  ["exit", "120ms", "Menus and popovers closing"],
  ["dialog-enter", "200ms", "Dialog and backdrop opening"],
  ["dialog-exit", "150ms", "Dialog and backdrop closing"],
  ["layout", "200ms", "Sidebar expansion and progress updates"],
] as const;

const curves = [
  { name: "Entrance", token: "ease-enter", duration: "enter", description: "Starts quickly and slows into place.", usage: "Opening a menu or popover" },
  { name: "Exit", token: "ease-exit", duration: "exit", description: "Accelerates as it leaves the screen.", usage: "Closing a menu or popover" },
  { name: "Feedback", token: "ease", duration: "fast", description: "Smoothly connects two control states.", usage: "Hover, selection and focus" },
] as const;

function EasingExamples() {
  const slowId = useId();
  const [atEnd, setAtEnd] = useState(false);
  const [slow, setSlow] = useState(true);
  return <section className="catalog-panel">
    <h3>How movement feels</h3>
    <p>Easing changes the speed during a transition. Play the examples together to compare how each curve starts and finishes.</p>
    <div className="catalog-motion-actions"><Button variant="outline" onClick={() => setAtEnd(value => !value)}>{atEnd ? "Reverse examples" : "Play examples"}</Button><Switch id={slowId} checked={slow} onChange={event => setSlow(event.target.checked)} /><Label htmlFor={slowId}>Slow preview · 600ms</Label></div>
    <p className="catalog-motion-caption">{slow ? "The preview is slowed down to make the curves easier to compare. Production components use the timing tokens above." : "The examples now use the production timing tokens."}</p>
    <div className="catalog-motion-examples">{curves.map(curve => <div className="catalog-motion-example" key={curve.name}>
      <h4>{curve.name}</h4><p>{curve.description}</p>
      <div className="catalog-easing-track" aria-hidden="true"><div className="catalog-easing-runner" data-end={atEnd} style={{ "--preview-duration": slow ? "600ms" : `var(--ds-motion-${curve.duration})`, "--preview-easing": `var(--ds-motion-${curve.token})` } as CSSProperties}><span /></div></div>
      <span className="catalog-motion-caption">{curve.usage}</span><code>--ds-motion-{curve.token}</code>
    </div>)}</div>
    <div className="catalog-motion-limits"><div><strong>4px displacement</strong><span>Floating content moves only a short distance from its trigger.</span><code>--ds-motion-distance</code></div><div><strong>0.98 → 1 scale</strong><span>A subtle size change helps the surface appear without moving the layout.</span><code>--ds-motion-scale</code></div></div>
  </section>;
}

function ReducedMotionExample() {
  const instanceId = useId();
  const [enabled, setEnabled] = useState(false);
  return <section className="catalog-panel">
    <h3>Reduced motion</h3>
    <p>Both examples show the same state. The standard switch slides into position; the reduced-motion switch updates immediately.</p>
    <Button variant="outline" onClick={() => setEnabled(value => !value)}>Toggle both examples</Button>
    <div className="catalog-motion-comparison">{["standard", "reduced"].map(mode => <div key={mode} className="catalog-motion-example" data-motion={mode}>
      <h4>{mode === "standard" ? "Standard motion" : "Reduced motion"}</h4>
      <p>{mode === "standard" ? "The thumb slides for 160ms while the track changes color." : "The thumb and track change immediately. The selected state remains clear."}</p>
      <div className="catalog-motion-actions"><Switch id={`${instanceId}-${mode}`} aria-label={`Receive updates · ${mode} motion`} checked={enabled} onChange={event => setEnabled(event.target.checked)} /><Label htmlFor={`${instanceId}-${mode}`}>Receive updates</Label></div>
    </div>)}</div>
    <p className="catalog-motion-caption" role="status">Updates are {enabled ? "enabled" : "off"} in both examples.</p>
    <p className="catalog-motion-caption">Your system’s motion preference is respected automatically. The right-hand example simulates reduced motion.</p>
    <p className="catalog-motion-preference-note">Your system currently requests reduced motion, so both examples update without animation.</p>
  </section>;
}

export function MotionFoundations() {
  const switchId = useId();
  const [enabled, setEnabled] = useState(false);
  const [progress, setProgress] = useState(30);
  return <>
    <section className="catalog-panel">
      <h3>Purposeful feedback</h3>
      <p>Use short, subtle transitions to connect an action with its result. Floating surfaces emerge from their trigger; controls respond immediately. Slider values follow the pointer without interpolation.</p>
      <div className="catalog-motion-examples">
        <div className="catalog-motion-example"><h4>Floating surfaces</h4><p>Open and close to compare both phases.</p><div className="catalog-motion-actions">
          <Popover label="Motion preview" trigger={<Button variant="outline">Open popover</Button>}><div className="catalog-motion-popover"><strong>Contextual help</strong><p>A short fade and 4px movement connect this surface to its trigger. Press Escape to close.</p><Button size="small" endIcon={<ArrowRight />}>View details</Button></div></Popover>
          <Dialog title="Lesson updated" description="Review the lesson before continuing." trigger={<Button variant="outline">Open dialog</Button>} footer={<DialogClose asChild><Button>Done</Button></DialogClose>}><p>The content and backdrop share a coordinated entrance and a quicker exit.</p></Dialog>
        </div></div>
        <div className="catalog-motion-example"><h4>Control feedback</h4><p>The switch thumb moves while its track changes color.</p><div className="catalog-motion-actions"><Switch id={switchId} checked={enabled} onChange={event => setEnabled(event.target.checked)} /><Label htmlFor={switchId}>Receive updates</Label></div><ToggleGroup label="Preview density" type="single" defaultValue="comfortable" items={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfortable" }]} /></div>
        <div className="catalog-motion-example"><h4>Progress and loading</h4><p>Progress changes smoothly; placeholders use a gentle pulse.</p><Progress label="Lesson completion" value={progress} /><Button variant="outline" size="small" onClick={() => setProgress(value => value === 30 ? 80 : 30)}>Update progress</Button><Skeleton aria-label="Loading lesson" /></div>
      </div>
    </section>
    <section className="catalog-panel"><h3>Timing tokens</h3><p>All examples use the production components and shared tokens.</p><div className="catalog-motion-timings">{timings.map(([token, duration, purpose]) => <div key={token}><code>--ds-motion-{token}</code><strong>{duration}</strong><span>{purpose}</span></div>)}</div></section>
    <EasingExamples />
    <ReducedMotionExample />
  </>;
}
