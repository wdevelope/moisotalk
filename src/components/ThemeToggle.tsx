"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return "☀️";
      case "dark":
        return "🌙";
      default:
        return "💻";
    }
  };

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "라이트";
      case "dark":
        return "다크";
      default:
        return "시스템";
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-lg border border-accent/30 hover:bg-accent/10 transition-colors flex items-center gap-2 text-sm"
      title={`현재: ${getLabel()} 모드 (클릭하여 변경)`}
    >
      <span className="text-sm">{getIcon()}</span>
      <span className="hidden sm:inline">{getLabel()}</span>
    </button>
  );
}
