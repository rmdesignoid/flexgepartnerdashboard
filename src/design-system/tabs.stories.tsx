import { useState } from "react";
import { BookOpen, ClipboardList, FileText } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from ".";

const items = [{ value: "overview", label: "Overview" }, { value: "details", label: "Details" }, { value: "activity", label: "Activity" }];
const meta = { title: "Components/Core/Tabs", component: Tabs, args: { items, value: "overview", onChange: () => undefined }, tags: ["autodocs"], parameters: { layout: "centered" } } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
function InteractiveTabs({ initial = "overview" }: { initial?: string }) { const [value, setValue] = useState(initial); return <Tabs value={value} onChange={setValue} items={items} />; }
export const Default: Story = { render: () => <InteractiveTabs /> };
export const SecondaryActive: Story = { render: () => <InteractiveTabs initial="details" /> };
export const Disabled: Story = { render: () => <Tabs value="overview" onChange={() => undefined} items={[...items.slice(0, 2), { value: "activity", label: "Activity", disabled: true }]} /> };
export const WithIcons: Story = { render: () => <InteractiveTabsWithIcons /> };
function InteractiveTabsWithIcons() { const [value, setValue] = useState("overview"); return <Tabs value={value} onChange={setValue} items={[{ value: "overview", label: "Overview", startIcon: <ClipboardList size={16} aria-hidden="true" /> }, { value: "details", label: "Details", startIcon: <FileText size={16} aria-hidden="true" /> }, { value: "activity", label: "Activity", startIcon: <BookOpen size={16} aria-hidden="true" /> }]} />; }

export const WithPanels: Story = { render: () => <PanelTabs /> };
function PanelTabs() { const [value, setValue] = useState("first"); return <Tabs value={value} onChange={setValue} items={[{ value: "first", label: "First", content: <p>First panel</p>, counter: 3 }, { value: "second", label: "Second", content: <p>Second panel</p> }]} />; }

export const AnchorNavigation: Story = { render: () => <AnchorTabsExample /> };
function AnchorTabsExample() {
  const [value, setValue] = useState("brand");
  return <div style={{ width: 480, maxWidth: "100%" }}><Tabs label="Palette sections" value={value} onChange={setValue} items={[{ value: "brand", label: "Brand", href: "#story-brand" }, { value: "neutral", label: "Neutrals", href: "#story-neutral" }]} /><section id="story-brand" style={{ padding: 24 }}><h3>Brand palettes</h3><p>Brand content stays visible.</p></section><section id="story-neutral" style={{ padding: 24 }}><h3>Neutral palettes</h3><p>Neutral content stays visible.</p></section></div>;
}
