import { ChevronRight } from "lucide-react";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { FC, useContext } from "react";
import useWindowWidth from "../Hooks/use-window-width";
import { DrawerContext } from "../context/DrawerContext";

const HorizantalCategories: FC = () => {
  const { isMobile } = useWindowWidth();
  const drawerContext = useContext(DrawerContext);
  const { loading, error, data } = useSelector(
    (state: RootState) => state.category
  );

  if (loading) {
    return Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="h-12 w-full bg-gray-200 
        max-w-20 rounded animate-pulse mb-4"
      />
    ));
  }

  if (error) {
    return (
      <p className="text-red-500 text-xs">Error: {JSON.stringify(error)}</p>
    );
  }

  return (
    <div className={`bg-white `}>
      {data?.categories?.categories?.map(({ id, name }, index) => (
        <NavLink
          key={id || index}
          to={`/products?category=${id}`}
          onClick={() => {
            if (!isMobile) {
              drawerContext.closeDrawer();
            }
          }}
          className="flex flex-row gap-2 items-center py-2
           w-full focus:bg-gray-200 justify-between "
        >
          <span
            className={` 
                text-sm text-gray-900 
              hover:text-blue-600 
                focus:font-blue-700 
              `}
          >
            {name}
          </span>

          <ChevronRight size={18} />
        </NavLink>
      ))}
    </div>
  );
};

export default HorizantalCategories;
