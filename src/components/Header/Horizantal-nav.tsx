import { NavLink } from "react-router";
import { scrollToTop } from "../../lib/helpers";
import { GridMainMenu } from "../../types";

interface NavigationProps {
  menus?: GridMainMenu[];
}

const Navigation: React.FC<NavigationProps> = ({ menus }) => {
  return (
    <nav className="w-full" role="navigation" aria-label="Main navigation">
      <ul className="flex items-center space-x-2 md:space-x-4 overflow-x-auto scrollbar-hide py-1">
        {(menus ?? [])?.map((item, index) => (
          <li key={index} className="flex-shrink-0">
            <NavLink
              onClick={() => scrollToTop()}
              to={item?.menuLink ?? "/"}
              className={({ isActive }) =>
                `relative inline-flex items-center px-3 md:px-4 py-2 text-sm 
                 md:text-base font-medium rounded-lg transition-all duration-300 
                 ease-in-out group whitespace-nowrap 
                 ${
                   isActive
                     ? "text-black-600 bg-blue-50 shadow-sm"
                     : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
                 }`
              }
            >
              <span className="relative z-10">{item.menuTitle}</span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-black-500 to-purple-500 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg scale-0 transition-transform duration-300 group-hover:scale-100"></span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
