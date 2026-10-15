import type { ReactNode } from "react";
import { DesignSystemShell } from "../../src/design-system/DesignSystemShell";

export default function DesignSystemLayout({ children }: { children: ReactNode }) {
  return <DesignSystemShell>{children}</DesignSystemShell>;
}
