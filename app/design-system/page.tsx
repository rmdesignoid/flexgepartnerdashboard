import { DesignSystemView } from "../../src/design-system/DesignSystemView";

export const metadata = {
  title: "Flexge Design System",
  description: "Flexge components, foundations and interactive examples.",
};

export default async function DesignSystemPage({ searchParams }: { searchParams: Promise<{ component?: string | string[] }> }) {
  const query = await searchParams;
  return <DesignSystemView component={typeof query.component === "string" ? query.component : undefined} />;
}
