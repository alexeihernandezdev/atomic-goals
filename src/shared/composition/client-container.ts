"use client";

/**
 * Client Composition Root.
 * Used by Client Components.
 * Uses the browser-side API client (with auth interceptors).
 *
 * ⚠️  This is a stub — use cases will be wired in their respective phases.
 */

// TODO (Phase 1): import openapi-fetch client, BrowserSessionGateway, HttpAuthGateway, etc.

export interface ClientContainer {
  // auth:       AuthUseCases     — wired in Phase 1
  // categories: CategoryUseCases — wired in Phase 2
  // goals:      GoalUseCases     — wired in Phase 3
  // steps:      StepUseCases     — wired in Phase 4
}

let _container: ClientContainer | null = null;

export function clientContainer(): ClientContainer {
  if (!_container) {
    _container = {};
  }
  return _container;
}
