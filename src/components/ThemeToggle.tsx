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
      className="px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-accent/30 hover:bg-accent/10 transition-all flex items-center gap-1 md:gap-2 text-xs md:text-sm shadow-sm"
      title={`현재: ${getLabel()} 모드 (클릭하여 변경)`}
    >
      <span className="text-xs md:text-sm">{getIcon()}</span>
      <span className="hidden md:inline text-xs md:text-sm">{getLabel()}</span>
    </button>
  );
}
