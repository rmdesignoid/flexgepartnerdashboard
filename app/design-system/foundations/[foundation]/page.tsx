import { notFound } from "next/navigation";
import { foundationPages } from "../../../../src/design-system/catalog";
import { DesignSystemView } from "../../../../src/design-system/DesignSystemView";

export async function generateMetadata({ params }: { params: Promise<{ foundation: string }> }) {
  const { foundation } = await params;
  const page = foundationPages.find(entry => entry.id === foundation);
  return { title: `${page?.label ?? "Foundations"} | Flexge Design System` };
}

export default async function FoundationPage({ params }: { params: Promise<{ foundation: string }> }) {
  const { foundation } = await params;
  const page = foundationPages.find(entry => entry.id === foundation);
  if (!page) notFound();
  return <DesignSystemView foundation={page.id} />;
}
