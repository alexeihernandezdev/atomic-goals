import * as React from "react";
import { AppShell } from "@/shared/presentation/layout/AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
