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
      className="px-3 py-2 rounded-lg border border-accent/30 hover:bg-accent/10 transition-colors flex items-center gap-2 text-sm"
      title={`현재: ${getLabel()} 모드 (클릭하여 변경)`}
    >
      <span className="text-sm">{getIcon()}</span>
      <span className="hidden sm:inline">{getLabel()}</span>
    </button>
  );
}
