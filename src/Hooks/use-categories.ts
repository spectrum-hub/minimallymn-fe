// src/hooks/useFromNavigation.ts

import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { Category } from "../types/Products";
import { useMemo } from "react";

export function useCategories() {
  const items = useSelector((state: RootState) => state.products?.data?.items);

  const categories = useMemo((): Category[] => {
    if (!items?.length) return [];
    const map = new Map<number, Category>();
    for (const it of items) {
      const cat = it?.category;
      if (cat?.id) map.set(cat.id, cat);
    }
    const arr = Array.from(map.values());
    arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return arr;
  }, [items]);

  return categories ?? [];
}
