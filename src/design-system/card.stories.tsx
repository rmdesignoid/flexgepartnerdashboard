import { Search } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, EmptyState } from ".";
import { CardExamples, LessonPlanCardExample, LessonResourcesCardExample } from "./card-examples";

const meta = { title: "Components/Core/Card", component: Card, tags: ["autodocs"], parameters: { layout: "centered" } } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: () => <div style={{ width: 400, maxWidth: "100%" }}><LessonPlanCardExample /></div> };
export const Resources: Story = { render: () => <div style={{ width: 400, maxWidth: "100%" }}><LessonResourcesCardExample /></div> };
export const ProductExamples: Story = { render: () => <div style={{ width: 840, maxWidth: "100%" }}><CardExamples /></div> };
export const Empty: Story = { render: () => <Card><EmptyState title="No resources found" description="Try changing the filters or create a new resource." action={<Button><Search size={15} />Search again</Button>} /></Card> };
