import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { FC, useContext, useMemo } from "react";
import useWindowWidth from "../Hooks/use-window-width";
import { DrawerContext } from "../context/DrawerContext";

// Tiny inline chevron for consistency (currentColor)
const ChevronRight: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <path fill="currentColor" d="M9 6l6 6-6 6" />
  </svg>
);

const SkeletonItem: FC = () => (
  <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
);

const HorizantalCategories: FC = () => {
  const { isMobile } = useWindowWidth();
  const drawerContext = useContext(DrawerContext);
  const { loading, error, data } = useSelector((state: RootState) => state.category);

  const categories = useMemo(() => data?.categories?.categories ?? [], [data]);

  if (loading) {
    return (
      <div className="p-3 space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonItem key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3">
        <p className="text-red-500 text-xs">Error: {JSON.stringify(error)}</p>
      </div>
    );
  }

  return (
    <nav
      aria-label="Ангиллууд"
      className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100"
    >
      <div className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-[11px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
          Ангилал
        </h2>
      </div>

      {/* 1 багана → md-с 2 багана */}
      <ul className="grid grid-cols-1 md:grid-cols-1 gap-1 p-2">
        {categories.map(({ id, name }, idx) => (
          <li key={id ?? idx}>
            <NavLink
              to={`/products?category=${id}`}
              onClick={() => {
                if (!isMobile) {
                  drawerContext.closeDrawer();
                }
              }}
              className={({ isActive }) => [
                "group flex items-center justify-between w-full",
                "rounded-md px-3 py-2 text-sm",
                "transition-colors hover:text-black",
                isActive
                  ? "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
              ].join(" ")}
            >
              <span className="truncate hover:text-black">{name}</span>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-transform duration-150 group-hover:translate-x-0.5" />
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HorizantalCategories;
