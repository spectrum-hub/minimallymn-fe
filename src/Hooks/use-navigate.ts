// src/hooks/useFromNavigation.ts
import { useLocation, useNavigate } from "react-router";

export function useHistoryNavigate() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const historyNavigate = (url: string, opts?: { replace?: boolean }) => {
    navigate(url, {
      replace: opts?.replace ?? false,
      state: { from: currentPath },
    });
  };

  return { historyNavigate, from: currentPath };
}
