import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination, type PaginationProps } from ".";

const meta = { title: "Components/Core/Pagination", component: Pagination, tags: ["autodocs"], parameters: { layout: "centered" }, args: { pageCount: 10 } } satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;
export const FirstPage: Story = {};
export const MiddlePage: Story = { args: { defaultPage: 5 } };
export const LastPage: Story = { args: { defaultPage: 10 } };
export const ShortCollection: Story = { args: { pageCount: 3 } };
export const SinglePage: Story = { args: { pageCount: 1 } };
export const Disabled: Story = { args: { disabled: true, defaultPage: 5 } };
export const Localized: Story = { args: { previousLabel: "Anterior", nextLabel: "Próxima", pageLabel: page => `Página ${page}`, ellipsisLabel: "Mais páginas", "aria-label": "Paginação" } };
function ControlledExample(args: PaginationProps) {
  const [page, setPage] = useState(1);
  return <div style={{ display: "grid", gap: 16, justifyItems: "center" }}><p role="status">Page {page} of {args.pageCount}</p><Pagination {...args} page={page} onPageChange={setPage} /></div>;
}
export const Controlled: Story = { render: args => <ControlledExample {...args} /> };
