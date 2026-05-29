import { serverContainer } from "@/shared/composition/server-container";
import { BrandLogo } from "@/shared/ui-kit/molecules/BrandLogo";
import { Badge } from "@/shared/ui-kit/atoms/Badge";
import { StreakWeek } from "@/shared/ui-kit/molecules/StreakWeek";
import { QuoteCard } from "@/shared/ui-kit/molecules/QuoteCard";
import type { StreakDotState } from "@/shared/ui-kit/atoms/StreakDot";

export default async function HomePage() {
  const health = await serverContainer().health.check();

  const demoWeek = [
    { state: "done" as StreakDotState, label: "L" },
    { state: "done" as StreakDotState, label: "M" },
    { state: "done" as StreakDotState, label: "X" },
    { state: "today" as StreakDotState, label: "J" },
    { state: "future" as StreakDotState, label: "V" },
    { state: "future" as StreakDotState, label: "S" },
    { state: "future" as StreakDotState, label: "D" },
  ];

  return (
    <main className="min-h-screen bg-[--ag-bg] flex flex-col items-center justify-center p-8 gap-8">
      <div className="w-full max-w-md flex flex-col gap-6 animate-[vibe-fade_0.3s_ease-out]">
        <div className="flex items-center justify-between">
          <BrandLogo size="lg" stacked />
          <Badge variant="success">
            {health.ok ? "sistema ok" : "sin conexión"}
          </Badge>
        </div>

        <div className="rounded-[--ag-radius-lg] border border-[--ag-border] bg-[--ag-surface] p-5 flex flex-col gap-3">
          <p className="text-xs font-mono uppercase tracking-[0.12em] text-[--ag-fg-muted]">
            fase 0 completada
          </p>
          <ul className="text-sm font-mono text-[--ag-fg] space-y-1.5">
            {[
              "deps instaladas",
              "shadcn inicializado",
              "screaming / clean structure",
              "domain errors",
              "eslint-plugin-boundaries",
              "design tokens (vibrante)",
              "ui-kit atoms + molecules",
              "next-themes provider",
              "composition root stubs",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-[--ag-lime]">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <StreakWeek days={demoWeek} currentStreak={23} record={47} />

        <QuoteCard
          quote="El éxito es la suma de pequeños esfuerzos repetidos día tras día."
          author="Robert Collier"
        />

        <p className="text-xs font-mono text-center text-[--ag-fg-subtle]">
          {health.timestamp}
        </p>
      </div>
    </main>
  );
}
