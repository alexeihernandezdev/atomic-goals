// next-themes renders an inline <script> to set the theme before hydration (FOUC
// prevention). React 19 warns that this script won't re-execute on the client,
// which is intentional — the script only needs to run once during SSR.
// This suppresses that dev-only false-positive warning until next-themes ships
// a React 19-native solution.
if (process.env.NODE_ENV === "development") {
  const _consoleError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("script tag while rendering React component")
    ) {
      return;
    }
    _consoleError(...args);
  };
}
