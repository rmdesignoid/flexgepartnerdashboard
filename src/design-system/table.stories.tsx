import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Avatar, Badge, Button, Input, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from ".";
const meta = { title: "Components/Core/Table", component: Table, parameters: { layout: "centered" }, tags: ["autodocs"] } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;
function Example({ twoLines = false }: { twoLines?: boolean }) {
  const [selected, setSelected] = useState(false);
  const [sort, setSort] = useState<"ascending" | "descending">("ascending");
  const people = sort === "ascending" ? ["Ana Martins", "Lucas Costa"] : ["Lucas Costa", "Ana Martins"];
  return <div style={{ width: 650, maxWidth: "100%" }}><Table><TableCaption>Example students</TableCaption><TableHeader><TableRow><TableHead onSort={() => setSort(sort === "ascending" ? "descending" : "ascending")} sortDirection={sort}>Student</TableHead><TableHead>Level</TableHead><TableHead align="right">Action</TableHead></TableRow></TableHeader><TableBody>{people.map(name => <TableRow key={name} selected={selected}><TableCell description={twoLines ? "Active student" : undefined}><span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><Avatar name={name} size="tiny" />{name}</span></TableCell><TableCell><Badge>A1</Badge></TableCell><TableCell align="right"><Button size="mini" variant="secondary" onClick={() => setSelected(!selected)}>Select</Button></TableCell></TableRow>)}</TableBody><TableFooter><TableRow><TableHead scope="row" colSpan={3}>Total: 2 students</TableHead></TableRow></TableFooter></Table></div>;
}
export const Default: Story = { render: () => <Example /> };
export const TwoLines: Story = { render: () => <Example twoLines /> };
export const CellStates: Story = { render: () => <Table><TableCaption>Cell states and compositions</TableCaption><TableHeader><TableRow><TableHead>State</TableHead><TableHead>Editable value</TableHead></TableRow></TableHeader><TableBody>{(["default", "hover", "active", "selected"] as const).map(state => <TableRow state={state} key={state}><TableCell>{state}</TableCell><TableCell><Input aria-label={`Value for ${state}`} defaultValue="Editable" /></TableCell></TableRow>)}</TableBody></Table> };
