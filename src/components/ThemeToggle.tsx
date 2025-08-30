"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getIcon = () => {
    return theme === "light" ? "☀️" : "🌙";
  };

  const getLabel = () => {
    return theme === "light" ? "라이트" : "다크";
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-accent/30 hover:bg-accent/10 transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-sm"
      title={`현재: ${getLabel()} 모드 (클릭하여 변경)`}
    >
      <span className="text-xs sm:text-sm">{getIcon()}</span>
      <span className="hidden sm:inline text-xs sm:text-sm">{getLabel()}</span>
    </button>
  );
}
