/**
 * Typed localStorage wrapper.
 * Handles SSR (localStorage is undefined on the server).
 */

export function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or private mode
  }
}

export function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}
