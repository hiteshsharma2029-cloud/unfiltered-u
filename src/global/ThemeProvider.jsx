
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  SETTINGS_EVENT,
  applyTheme,
  deriveTheme,
  getInitialSettings,
  publishSettings,
} from "./theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(getInitialSettings);

  const look = settings.look || {};
  const derived = useMemo(() => deriveTheme(look), [look]);

  useEffect(() => {
    applyTheme(look);
  }, [look]);

  useEffect(() => {
    function handleSettingsChange(event) {
      if (!event.detail) return;

      setSettings((previous) => ({
        ...previous,
        ...event.detail,
        look: {
          ...(previous.look || {}),
          ...(event.detail.look || {}),
        },
      }));
    }

    function handleStorage(event) {
      if (event.key !== "unfiltered.settings.v4") return;

      setSettings(getInitialSettings());
    }

    window.addEventListener(SETTINGS_EVENT, handleSettingsChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(SETTINGS_EVENT, handleSettingsChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const updateLook = useCallback((changes) => {
    setSettings((previous) => {
      const next = {
        ...previous,
        look: {
          ...(previous.look || {}),
          ...changes,
        },
      };

      publishSettings(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      settings,
      look,
      stars: derived.stars,
      updateLook,
      setSettings,
    }),
    [settings, look, derived, updateLook]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
