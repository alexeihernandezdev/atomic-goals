import * as React from "react";
import { AppShell } from "@/shared/presentation/layout/AppShell";
import { UserMenu } from "@/modules/auth/presentation/components/UserMenu";
import { ensureAuthenticated } from "@/shared/presentation/auth/ensure-authenticated";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureAuthenticated();

  return (
    <AppShell topbarTrailing={<UserMenu />}>
      {children}
    </AppShell>
  );
}
