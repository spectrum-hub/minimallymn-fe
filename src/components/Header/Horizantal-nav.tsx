import { NavLink } from "react-router";
import { LayoutMenus } from "../../types/Blocks";
import useWindowWidth from "../../Hooks/use-window-width";
import { scrollToTop } from "../../lib/helpers";

function moveItemToStart(
  arr?: LayoutMenus[],
  itemName?: string
): LayoutMenus[] | undefined {
  if (!arr || !itemName) {
    return arr;
  }

  try {
    const index = arr.findIndex((item) => item.name === itemName);
    if (index !== -1) {
      const item = arr[index];
      const newArr = [item, ...arr.slice(0, index), ...arr.slice(index + 1)];
      return newArr;
    }
  } catch (e: unknown) {
    console.log(e);
  }

  return arr;
}

interface NavigationProps {
  menus?: LayoutMenus[];
}

const Navigation: React.FC<NavigationProps> = ({ menus }) => {
  const { isMobile } = useWindowWidth();

  return (
    <nav className="w-full" role="navigation" aria-label="Main navigation">
      <ul className="flex items-center space-x-2 md:space-x-4 overflow-x-auto scrollbar-hide py-1">
        {(isMobile
          ? moveItemToStart(menus, "Зээлийн хүсэлт илгээх")
          : menus ?? []
        )?.map((item, index) => (
          <li key={index} className="flex-shrink-0">
            <NavLink
              onClick={() => scrollToTop()}
              to={`${item.url === "/shop" ? "/products" : item.url}`}
              className={({ isActive }) =>
                `relative inline-flex items-center px-3 md:px-4 py-2 text-sm md:text-base font-medium rounded-lg transition-all duration-300 ease-in-out group whitespace-nowrap ${
                  isActive
                    ? "text-blue-600 bg-blue-50 shadow-sm"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
                }`
              }
            >
              <span className="relative z-10">{item.name}</span>
              
              {/* Animated underline */}
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
              
              {/* Background hover effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg scale-0 transition-transform duration-300 group-hover:scale-100"></span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
