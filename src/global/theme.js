
export const SETTINGS_KEY = "unfiltered.settings.v4";
export const SETTINGS_EVENT = "unfiltered:settings-change";

export const DEFAULT_LOOK = {
  mood: "classic",
  density: 100,
  size: 100,
  font: "inter",
  spacing: "cozy",
  contrast: "normal",
  motion:
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      ? "reduce"
      : "full",
};

export const MOODS = {
  classic: {
    mul: 1,
    tw: 0.4,
    speed: 0,
    big: 1,
    glow: 0.35,
    blur: 14,
    card: 0.72,
    line: 0.14,
    dur: 1,
  },
  calm: {
    mul: 0.55,
    tw: 0.2,
    speed: 0.5,
    big: 1,
    glow: 0.15,
    blur: 22,
    card: 0.62,
    line: 0.1,
    dur: 1.7,
  },
  focus: {
    mul: 0.08,
    tw: 0,
    speed: 0,
    big: 1,
    glow: 0,
    blur: 4,
    card: 0.97,
    line: 0.24,
    dur: 0.7,
  },
  energetic: {
    mul: 1.8,
    tw: 1,
    speed: 4,
    big: 1.35,
    glow: 1,
    blur: 10,
    card: 0.7,
    line: 0.34,
    dur: 0.5,
  },
  dreamy: {
    mul: 0.85,
    tw: 0.6,
    speed: 0.9,
    big: 2.6,
    glow: 0.7,
    blur: 36,
    card: 0.4,
    line: 0.18,
    dur: 2,
  },
};

export function getInitialSettings() {
  if (typeof window === "undefined") {
    return { look: DEFAULT_LOOK };
  }

  try {
    const saved = window.localStorage.getItem(SETTINGS_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      return {
        ...parsed,
        look: {
          ...DEFAULT_LOOK,
          ...(parsed.look || {}),
        },
      };
    }
  } catch (error) {
    console.warn("Could not load saved settings:", error);
  }

  return { look: { ...DEFAULT_LOOK } };
}

export function deriveTheme(look = DEFAULT_LOOK) {
  const mood = MOODS[look.mood] || MOODS.classic;

  // Settings.jsx uses "compact", "cozy", and "roomy".
  const spacing =
    look.spacing === "compact"
      ? 0.78
      : look.spacing === "roomy" || look.spacing === "relaxed"
        ? 1.3
        : 1;

  // Settings.jsx offers Inter, Easy-reading, and Serif.
  const fontMap = {
    inter: '"Inter", sans-serif',
    easy: '"Inter", sans-serif',
    system: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
  };

  const density = Math.max(25, Math.min(look.density ?? 100, 175)) / 100;
  const size = Math.max(75, Math.min(look.size ?? 100, 150)) / 100;
  const reduceMotion = look.motion === "reduce";

  return {
    vars: {
      "--uu-font": fontMap[look.font] || fontMap.inter,
      "--uu-text-zoom": String(size),
      "--uu-space": String(spacing),
      "--uu-card-opacity": String(mood.card),
      "--uu-glass-blur": `${mood.blur}px`,
      "--uu-glow": String(mood.glow),
      "--uu-line-opacity": String(mood.line),
      "--uu-motion-duration": reduceMotion ? "0.01ms" : `${mood.dur}s`,
      "--uu-density": String(density),

      // Compatibility variables used by the existing Settings page.
      "--dur": reduceMotion ? "0.001" : String(mood.dur),
      "--glow": String(mood.glow),
      "--blur": `${mood.blur}px`,
      "--card": `rgba(8, 8, 10, ${mood.card})`,
      "--tz": String(size),
      "--pad": String(spacing),
      "--ls": look.font === "easy" ? ".03em" : "0em",
      "--line": look.contrast === "high"
        ? "rgba(255,255,255,.38)"
        : `rgba(255,255,255,${mood.line})`,
      "--uu-bg": "#000000",
      "--uu-bg-soft": "#050505",
      "--uu-surface": `rgba(8, 8, 10, ${mood.card})`,
      "--uu-surface-hover": "rgba(22, 22, 24, .92)",
      "--uu-text": "#ffffff",
      "--uu-text-muted": look.contrast === "high" ? "#dedede" : "#969696",
      "--uu-text-faint": "#6d6d6d",
      "--uu-border": look.contrast === "high"
        ? "rgba(255,255,255,.38)"
        : `rgba(255,255,255,${mood.line})`,
      "--uu-accent": "#ffffff",
      "--uu-accent-strong": "#ffffff",
      "--uu-accent-soft": "rgba(255,255,255,.08)",
    },

    stars: {
      count: Math.round(110 * density * mood.mul),
      twinkle: mood.tw,
      speed: reduceMotion ? 0 : mood.speed,
      size: mood.big * (look.size / 100),
      glow: mood.glow,
      still: reduceMotion,
    },
  };
}

export function applyTheme(look = DEFAULT_LOOK) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const { vars } = deriveTheme(look);

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.dataset.mood = look.mood || "classic";
  root.dataset.font = look.font || "inter";
  root.dataset.contrast = look.contrast || "normal";
  root.dataset.motion = look.motion || "full";
  root.dataset.spacing = look.spacing || "cozy";
}

export function publishSettings(settings) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(SETTINGS_EVENT, {
      detail: settings,
    })
  );
}
