import { NavLink } from "react-router";
import { useDrawerCtx } from "../../Hooks/use-modal-drawer";
import { AlignRightOutlined, AlignLeftOutlined } from "@ant-design/icons";
import { Suspense, useState } from "react";
import { LayoutMenus } from "../../types/Blocks";
import useWindowWidth from "../../Hooks/use-window-width";
import HorizantalCategories from "../HorizantalCategories";
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
  const { setLoading, showDrawer } = useDrawerCtx();
  const [isHovered, setIsHovered] = useState(false);
  const { isMobile } = useWindowWidth();

  const handleShowCategories = () => {
    scrollToTop();
    setLoading(true);
    showDrawer({
      title: "",
      placement: "left",
      width: "300",
      content: (
        <Suspense>
          <HorizantalCategories />
        </Suspense>
      ),
    });
    setLoading(false);
  };

  return (
    <ul className={`flex items-center space-x-1 `}>
      {!isMobile ? (
        <li>
          <button
            onClick={handleShowCategories}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="
              rounded-md flex gap-2 items-center px-4 py-2 transition-all duration-300
              hover:border-black bg-gradient-to-r from-orange-300 to-orange-500
              hover:shadow-lg text-white active:bg-blue-900 
              shadow-md uppercase text-xs md:text-[12px] mr-2 
            "
          >
            {isHovered ? (
              <AlignLeftOutlined className="text-lg" />
            ) : (
              <AlignRightOutlined className="text-lg" />
            )}
            <span className="font-semibold text-white">Ангилал</span>
          </button>
        </li>
      ) : null}

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
