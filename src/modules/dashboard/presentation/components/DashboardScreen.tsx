"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { DASH_PALETTES } from "@/shared/presentation/palette";
import type { DashboardSummary } from "@/modules/dashboard/domain/summary";
import type { TimelineData } from "@/modules/dashboard/domain/timeline-point";
import type { UpcomingItem } from "@/modules/dashboard/domain/upcoming-item";
import type { ActivityLog } from "@/modules/dashboard/domain/activity-log";
import { StreakHero } from "./StreakHero";
import { SummaryCards } from "./SummaryCards";
import { TimelineChart } from "./TimelineChart";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { UpcomingList } from "./UpcomingList";
import { ActivityFeed } from "./ActivityFeed";

interface DashboardScreenProps {
  summary: DashboardSummary;
  timeline: TimelineData;
  upcoming: UpcomingItem[];
  activity: ActivityLog[];
  userName: string;
}

export function DashboardScreen({
  summary,
  timeline,
  upcoming,
  activity,
  userName,
}: DashboardScreenProps) {
  const { resolvedTheme } = useTheme();
  const palette =
    resolvedTheme === "dark" ? DASH_PALETTES.dark : DASH_PALETTES.light;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <StreakHero summary={summary} palette={palette} userName={userName} />

      <SummaryCards summary={summary} palette={palette} />

      {/* Charts row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.7fr 1fr",
          gap: 16,
        }}
      >
        <TimelineChart data={timeline} palette={palette} />
        <CategoryBreakdown summary={summary} palette={palette} />
      </div>

      {/* Lists row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 16,
        }}
      >
        <UpcomingList items={upcoming} palette={palette} />
        <ActivityFeed items={activity} palette={palette} />
      </div>
    </div>
  );
}
