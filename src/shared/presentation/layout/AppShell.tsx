import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps {
  children: React.ReactNode;
  topbarTrailing?: React.ReactNode;
}

export function AppShell({ children, topbarTrailing }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[--ag-bg]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar trailing={topbarTrailing} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
