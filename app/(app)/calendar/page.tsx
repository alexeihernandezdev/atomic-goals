import { serverContainer } from "@/shared/composition/server-container";
import { CalendarScreen } from "@/modules/calendar";
import { redirectIfUnauthorized } from "@/shared/presentation/auth/session-expired";
import {
  scheduleNewStepAction,
  assignStepDateAction,
  listInstanceStepsAction,
} from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Calendario — Atomic Goals" };

export default async function CalendarPage() {
  const container = await serverContainer();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const from = new Date(year, month, 1).toISOString();
  const to = new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString();

  const events = await container.calendar.getEvents
    .execute({ from, to })
    .catch(async (e: unknown) => {
      await redirectIfUnauthorized(e, "/calendar");
      console.error("[calendar] getEvents failed:", e);
      return [];
    });

  return (
    <CalendarScreen
      initialEvents={events}
      initialYear={year}
      initialMonth={month}
      scheduleActions={{
        scheduleNew: scheduleNewStepAction,
        assignDate: assignStepDateAction,
        listSteps: listInstanceStepsAction,
      }}
    />
  );
}
