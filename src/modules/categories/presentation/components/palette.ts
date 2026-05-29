export type DashPalette = {
  bg: string;
  surface: string;
  surface2: string;
  ink: string;
  inkDim: string;
  inkSubtle: string;
  line: string;
  lineSoft: string;
  lineSofter: string;
  primary: string;
  primaryInk: string;
  primarySoft: string;
  magenta: string;
  lime: string;
  yellow: string;
  purple: string;
  sky: string;
  grid: string;
};

export const DASH_PALETTES: { light: DashPalette; dark: DashPalette } = {
  light: {
    bg: "#f4f4ef",
    surface: "#ffffff",
    surface2: "#fafaf6",
    ink: "#0e0e0e",
    inkDim: "#5f5f5f",
    inkSubtle: "#9d9d9d",
    line: "#0e0e0e",
    lineSoft: "rgba(14,14,14,0.16)",
    lineSofter: "rgba(14,14,14,0.08)",
    primary: "#2E5BFF",
    primaryInk: "#ffffff",
    primarySoft: "rgba(46,91,255,0.10)",
    magenta: "#FF3D6E",
    lime: "#C8FF1F",
    yellow: "#FFB400",
    purple: "#7C5CFF",
    sky: "#1FD1F9",
    grid: "rgba(14,14,14,0.06)",
  },
  dark: {
    bg: "#0c0c0c",
    surface: "#161616",
    surface2: "#1d1d1d",
    ink: "#f4f4ef",
    inkDim: "#9a9a9a",
    inkSubtle: "#666666",
    line: "#f4f4ef",
    lineSoft: "rgba(244,244,239,0.18)",
    lineSofter: "rgba(244,244,239,0.08)",
    primary: "#5C84FF",
    primaryInk: "#0c0c0c",
    primarySoft: "rgba(92,132,255,0.14)",
    magenta: "#FF6691",
    lime: "#D4FF4D",
    yellow: "#FFCC4D",
    purple: "#9B7FFF",
    sky: "#5DDFFA",
    grid: "rgba(244,244,239,0.05)",
  },
};

export function useDashPalette(): DashPalette {
  if (typeof window === "undefined") return DASH_PALETTES.light;
  const isDark = document.documentElement.classList.contains("dark");
  return isDark ? DASH_PALETTES.dark : DASH_PALETTES.light;
}
