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
    <ul className={`flex items-center space-x-1 `}>
      {(isMobile
        ? moveItemToStart(menus, "Зээлийн хүсэлт илгээх")
        : menus ?? []
      )?.map((item, index) => (
        <li key={index} className="whitespace-nowrap cursor-pointer ">
          <NavLink
            onClick={() => scrollToTop()}
            to={`${item.url === "/shop" ? "/products" : item.url}`}
            className="relative text-gray-700 hover:text-black 
             h-10 leading-10 block transition-colors duration-300              
             after:content-[''] after:absolute after:left-1/2 after:bottom-0 
             after:w-0 after:h-[2px] after:bg-black 
             after:transition-all after:duration-300 
             hover:after:left-0 hover:after:w-full px-2 md-px-4 "
          >
            {item.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default Navigation;
