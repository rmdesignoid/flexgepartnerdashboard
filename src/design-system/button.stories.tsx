import { ArrowRight, Check, Settings, UserPlus } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingButton, Button, IconButton } from ".";

const meta = {
  title: "Components/Core/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "outline", "ghost", "destructive", "accent"] },
    size: { control: "select", options: ["mini", "small", "regular", "large"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: { variant: "primary", size: "regular", children: "Primary action", loading: false, disabled: false },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: "secondary", children: "Secondary" } };
export const Ghost: Story = { args: { variant: "ghost", children: "Ghost" } };
export const Danger: Story = { args: { variant: "destructive", children: "Delete" } };
export const Loading: Story = { args: { variant: "outline", loading: true, children: "Loading…" } };
export const Disabled: Story = { args: { disabled: true } };
export const WithIcon: Story = { render: (args) => <Button {...args}><UserPlus size={15} />Add resource</Button>, args: { variant: "secondary" } };
export const IconOnly: Story = { render: () => <IconButton label="Settings"><Settings size={16} /></IconButton> };

export const Accent: Story = { args: { variant: "accent", children: "Accent" } };
export const Outline: Story = { args: { variant: "outline", children: "Outline" } };
export const Sizes: Story = { render: () => <div style={{ display: "flex", gap: 12, alignItems: "center" }}>{(["mini", "small", "regular", "large"] as const).map(size => <Button key={size} size={size}>{size}</Button>)}</div> };

export const WithIcons: Story = { args: { startIcon: <Check />, endIcon: <ArrowRight />, children: "Save changes" } };
export const LoadingWithIcons: Story = { args: { startIcon: <Check />, endIcon: <ArrowRight />, loading: true, children: "Saving changes" } };

export const LoadingButtonWrapper: Story = { render: () => <LoadingButton>Saving</LoadingButton> };
