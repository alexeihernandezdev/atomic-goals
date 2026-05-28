import * as React from "react";
import { AppShell } from "@/shared/presentation/layout/AppShell";
import { UserMenu } from "@/modules/auth/presentation/components/UserMenu";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell topbarTrailing={<UserMenu />}>
      {children}
    </AppShell>
  );
}
