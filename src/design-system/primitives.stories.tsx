import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox, Input, Label, LinkButton, Progress, Radio, Separator, Skeleton, Slider, Spinner, Switch, Toggle } from ".";
const meta = { title: "Components/Core/Primitives", tags: ["autodocs"], parameters: { layout: "centered" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const CheckboxStates: Story = { render: () => <div style={{ display: "flex", gap: 24 }}><Checkbox aria-label="Unchecked" /><Checkbox defaultChecked aria-label="Checked" /><Checkbox defaultChecked="indeterminate" aria-label="Mixed" /><Checkbox disabled defaultChecked aria-label="Disabled" /><Checkbox invalid aria-label="Invalid" /></div> };
export const RadioGroup: Story = { render: () => <fieldset><legend>Notification channel</legend><Label htmlFor="radio-email" layout="inline"><Radio id="radio-email" name="channel" value="email" defaultChecked /> Email</Label><Label htmlFor="radio-push" layout="inline"><Radio id="radio-push" name="channel" value="push" /> Push</Label></fieldset> };
export const SwitchStates: Story = { render: () => <div style={{ display: "flex", gap: 24 }}><Switch aria-label="Off" /><Switch defaultChecked aria-label="On" /><Switch disabled defaultChecked aria-label="Disabled" /></div> };
export const SliderRange: Story = { render: () => <Slider label="Price" thumbLabels={["Minimum price", "Maximum price"]} defaultValue={[25, 75]} minStepsBetweenThumbs={1} /> };
export const SliderVertical: Story = { render: () => <Slider label="Volume" orientation="vertical" defaultValue={[50]} /> };
export const ProgressStates: Story = { render: () => <div style={{ display: "grid", gap: 16 }}><Progress label="Upload" value={50} /><Progress label="Loading" /></div> };
export const Separators: Story = { render: () => <div style={{ width: 240 }}><span>Above</span><Separator decorative={false} /><span>Below</span></div> };
export const SkeletonContent: Story = { render: () => <div role="status" aria-label="Loading content" style={{ display: "flex", gap: 12 }}><Skeleton variant="avatar" /><div style={{ display: "grid", gap: 12 }}><Skeleton /><Skeleton variant="object" /></div></div> };
export const Spinners: Story = { render: () => <div style={{ display: "flex", gap: 16 }}><Spinner label="Loading" /><Spinner mirrored label="Loading, mirrored" /></div> };
export const FieldLabel: Story = { render: () => <div><Label htmlFor="label-name" required>Name</Label><Input id="label-name" required /></div> };
export const ToggleButton: Story = { render: () => <Toggle>Favorite</Toggle> };
export const NavigationLink: Story = { render: () => <LinkButton href="#example">Resources</LinkButton> };
function SelectionForm() {
  const [result, setResult] = useState("");
  return <form onSubmit={event => { event.preventDefault(); setResult(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget)))); }} style={{ display: "grid", gap: 16 }}><Label htmlFor="form-agreement"><Checkbox id="form-agreement" name="agreement" value="accepted" required /> Accept terms (demo)</Label><Label htmlFor="form-updates"><Switch id="form-updates" name="updates" /> Updates</Label><fieldset><legend>Channel</legend><Label htmlFor="form-email"><Radio id="form-email" name="channel" value="email" defaultChecked /> Email</Label><Label htmlFor="form-push"><Radio id="form-push" name="channel" value="push" /> Push</Label></fieldset><Slider label="Volume" name="volume" defaultValue={[50]} /><button type="submit">Submit</button><button type="reset">Reset</button><output>{result}</output></form>;
}
export const FormIntegration: Story = { render: () => <SelectionForm /> };
