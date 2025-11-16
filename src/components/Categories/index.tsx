import React, { useMemo } from "react";
import { NavLink, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { Category } from "../../types/Products";

/**
 * Minimal, responsive, accessible categories component.
 * - Desktop: compact grid with subtle hover and focus styles
 * - Mobile: single-row horizontal scroller (touch-friendly)
 * - Uses only native scrolling (no heavy swiper dependency)
 */

const RenderCategories: React.FC = () => {
  const items = useSelector((s: RootState) => s.products?.data?.items || []);
  const [searchParams] = useSearchParams();
  const activeCategoryId = Number(searchParams.get("category") || 0);

  const categories = useMemo((): Category[] => {
    if (!items.length) return [];
    const map = new Map<number, Category>();
    for (const it of items) {
      const cat = it?.category;
      if (cat?.id) map.set(cat.id, cat);
    }
    const arr = Array.from(map.values());
    arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return arr;
  }, [items]);

  if (!categories.length) return null;

  // Small-screen: horizontal, touch friendly
  // Large-screen: grid of pills
  return (
    <section aria-labelledby="categories-heading" className="w-full my-4">
      <h2
        id="categories-heading"
        className="text-lg font-semibold mb-3 text-gray-800"
      >
        Ангилалууд
      </h2>

      {/* Mobile / narrow: horizontal scroller */}
      <div className="sm:hidden">
        <div className="flex flex-wrap gap-1 py-1 px-1 scrollbar overflow-scroll">
          {categories.map((c) => (
            <NavLink
              key={c.id}
              to={{ search: `category=${c.id}` }}
              className={() =>
                `text-xs
                flex-shrink-0 px-2 leading-6 rounded-full whitespace-nowrap border 
                transition-transform transform-gpu hover:scale-105 focus:scale-105 
                focus:outline-none focus:ring-2 focus:ring-gray-300 " +
                ${
                  activeCategoryId === c.id
                    ? "bg-gray-600 text-white "
                    : "bg-white text-gray-900 "
                }`
              }
              aria-current={activeCategoryId === c.id ? "page" : undefined}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              {c.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Desktop / wide: grid with two rows if many items */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm p-3">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((c) => (
            <NavLink
              key={c.id}
              to={{ search: `category=${c.id}` }}
              className={() =>
                `block text-center py-2 px-3 rounded-lg transition transform border border-gray-300
                hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-300 " +
                ${
                  activeCategoryId === c.id
                    ? "bg-gray-500 border shadow-sm text-white"
                    : "bg-white  text-gray-800"
                }`
              }
              aria-current={activeCategoryId === c.id ? "page" : undefined}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <span className="truncate block text-xs">{c.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RenderCategories;
