/**
 * Server Composition Root.
 * Used by Server Components and Server Actions.
 * Reads cookies from the request context for auth forwarding.
 *
 * ⚠️  This is a stub — use cases will be wired in their respective phases.
 */

// TODO (Phase 1): import HttpAuthGateway, NextCookieSessionGateway, LoginUseCase, etc.
// TODO (Phase 2-8): import and wire remaining gateways + use cases.

export interface ServerContainer {
  health: {
    check: () => Promise<{ ok: boolean; timestamp: string }>;
  };
  // auth:       AuthUseCases     — wired in Phase 1
  // categories: CategoryUseCases — wired in Phase 2
  // goals:      GoalUseCases     — wired in Phase 3
  // steps:      StepUseCases     — wired in Phase 4
  // dashboard:  DashboardUseCases — wired in Phase 5
}

function createServerContainer(): ServerContainer {
  return {
    health: {
      check: async () => ({
        ok: true,
        timestamp: new Date().toISOString(),
      }),
    },
  };
}

let _container: ServerContainer | null = null;

export function serverContainer(): ServerContainer {
  if (!_container) {
    _container = createServerContainer();
  }
  return _container;
}
