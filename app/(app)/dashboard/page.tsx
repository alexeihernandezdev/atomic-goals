import { serverContainer } from "@/shared/composition/server-container";
import { DashboardScreen } from "@/modules/dashboard";
import type { TimelineRange, DashboardSummary, TimelineData } from "@/modules/dashboard";
import { redirectIfUnauthorized } from "@/shared/presentation/auth/session-expired";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — Atomic Goals" };

const EMPTY_SUMMARY: DashboardSummary = {
  streak: { current: 0, record: 0, weekActivity: [false, false, false, false, false, false, false] },
  stats: { activeGoals: 0, completedThisMonth: 0, totalGoalsThisMonth: 0, stepsToday: 0, stepsTodayTotal: 0 },
  categories: [],
};

function emptyTimeline(range: TimelineRange): TimelineData {
  return { range, points: [], totalCompleted: 0, growthPercent: null, activeDays: 0, totalDays: 0 };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const timelineRange: TimelineRange =
    range === "week" || range === "year" ? range : "month";

  const container = await serverContainer();

  const handleFetchError = async (source: string, e: unknown) => {
    await redirectIfUnauthorized(e, "/dashboard");
    console.error(`[dashboard] ${source} failed:`, e);
    return null;
  };

  const [user, summary, timeline, upcoming, activity] = await Promise.all([
    container.auth.getCurrentUser.execute().catch(() => null),
    container.dashboard.getSummary
      .execute()
      .catch((e: unknown) => handleFetchError("summary", e)),
    container.dashboard.getTimeline
      .execute(timelineRange)
      .catch((e: unknown) => handleFetchError("timeline", e)),
    container.dashboard.getUpcoming
      .execute()
      .catch(async (e: unknown) => {
        await redirectIfUnauthorized(e, "/dashboard");
        console.error("[dashboard] upcoming failed:", e);
        return [];
      }),
    container.dashboard.getActivity
      .execute()
      .catch(async (e: unknown) => {
        await redirectIfUnauthorized(e, "/dashboard");
        console.error("[dashboard] activity failed:", e);
        return { items: [], nextCursor: null };
      }),
  ]);

  return (
    <DashboardScreen
      summary={summary ?? EMPTY_SUMMARY}
      timeline={timeline ?? emptyTimeline(timelineRange)}
      upcoming={Array.isArray(upcoming) ? upcoming : []}
      activity={activity.items ?? []}
      userName={user?.name ?? ""}
    />
  );
}
