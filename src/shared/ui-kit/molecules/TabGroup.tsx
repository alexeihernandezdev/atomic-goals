"use client";

import * as React from "react";
import { cn } from "@/shared/presentation/utils/cn";
import { Tab } from "@/shared/ui-kit/atoms/Tab";

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface TabGroupProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function TabGroup({
  tabs,
  activeId,
  onChange,
  className,
}: TabGroupProps) {
  return (
    <div
      role="tablist"
      className={cn("flex gap-0 border-b border-[--ag-border]", className)}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          active={tab.id === activeId}
          disabled={tab.disabled}
          onClick={() => !tab.disabled && onChange(tab.id)}
        >
          {tab.label}
        </Tab>
      ))}
    </div>
  );
}
