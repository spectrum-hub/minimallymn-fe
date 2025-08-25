import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = window.localStorage.getItem("theme") as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        setTheme(preferredTheme);
      }
    }
  }, []);


  useEffect(() => {
    if (theme === "dark") {
      document.documentElement?.classList?.add("dark");
    } else {
      document.documentElement?.classList?.remove("dark");
    }
  }, [theme]);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root?.classList?.remove("light", "dark");
    root?.classList?.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}
