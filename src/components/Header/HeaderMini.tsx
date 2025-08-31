import { FC, useMemo } from "react";
import { matchPath, useLocation } from "react-router";
import { useSelector } from "react-redux";
import clsx from "clsx";

import { LogoLink } from "../Links";
import Navigation from "./Horizantal-nav";
import routes from "../../routes";
import { RootState } from "../../Redux/store";
import SearchForm from "./SearchForm";
import HorizantalCategories from "../HorizantalCategories";
import { useDrawerCtx } from "../../Hooks/use-modal-drawer";
import { scrollToTop } from "../../lib/helpers";

import { Phone, Send, Search } from "lucide-react";

import type { HeaderProps } from "../../types/Common";
import { WishlistButton, UserInfoButton, CartButton } from "./HeaderActionsSvg"; // (файлын нэрийг өөрт таарахаар)
import { useHistoryNavigate } from "../../Hooks/use-navigate";
import { useWishListCount } from "../../Hooks/use-layout-data";

type SocialLinksProps = { isMobile?: boolean };

const HeaderMini: FC<HeaderProps> = (props) => {
  const { data } = useSelector((state: RootState) => state.layouts);
  const { setLoading, showDrawer, closeDrawer } = useDrawerCtx();
  const { historyNavigate } = useHistoryNavigate();
  const wishList = useWishListCount();

  const handleToggleCategories = () => {
    scrollToTop();
    setLoading(true);
    showDrawer({
      title: "",
      placement: "left",
      width: "320",
      content: <HorizantalCategories />,
    });
    setLoading(false);
  };

  const handleToggleSearch = () => {
    setLoading(true);
    showDrawer({
      title: "Хайлт",
      placement: "top",
      content: (
        <div className="p-4">
          <SearchForm
            onSearch={() => {
              closeDrawer();
            }}
          />
        </div>
      ),
      width: "100%",
    });
    setLoading(false);
  };

  const pathname = useLocation()?.pathname;
  const showNavigation = useMemo(() => {
    if (pathname?.startsWith("/orders")) return false;
    return (
      routes.find((route) => matchPath(route.path, pathname))?.navigationShow ??
      true
    );
  }, [pathname]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 w-full",
        "bg-white/95 backdrop-blur-md border-b border-gray-100",
        "shadow-sm"
      )}
    >
      {/* Top contact bar */}
      <div className="hidden md:block bg-gray-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-2.5 text-xs text-gray-600">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-2 hover:text-gray-900 transition-colors">
                <Phone size={14} className="text-blue-600" />
                <span className="font-medium">8043-1000, 8042-1000</span>
              </span>
              <span className="hidden lg:flex items-center space-x-2 hover:text-gray-900 transition-colors">
                <Send size={14} className="text-blue-600" />
                <span className="font-medium">info@minimally.mn</span>
              </span>
            </div>
            <SocialLinks />
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left side: menu + logo */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <MenuToggle onClick={handleToggleCategories} />

            <LogoLink className="flex-shrink-0">
              <img
                src="/assets/logo.png"
                alt="Minimally Logo"
                className="h-8 md:h-12 w-auto transition-all duration-300 hover:scale-105"
              />
            </LogoLink>
          </div>

          {/* Center: search (desktop >= 580px) */}
          <div className="hidden min-[580px]:flex flex-1 max-w-xl mx-8">
            <SearchForm />
          </div>

          {/* Right side: actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Search icon for screens < 580px */}
            <div className="min-[580px]:hidden">
              <SearchIconButton onClick={handleToggleSearch} />
            </div>

            <div className="flex items-center space-x-1">
              <WishlistButton
                count={wishList?.wishListCount}
                onClick={() => {
                  scrollTo({ top: 0, behavior: "smooth" });
                  historyNavigate("/wishlist");
                }}
              />
              <UserInfoButton
                isAuthenticated={props.isAuthenticated}
                userName={
                  props.userInfo?.userInfo?.userData?.name ??
                  props.userInfo?.userInfo?.userData?.login
                }
                onClick={() => {
                  scrollTo({ top: 0, behavior: "smooth" });
                  historyNavigate(
                    props.isAuthenticated ? "/account/profile" : "/auth/login"
                  );
                }}
              />
              <CartButton
                totalItems={props?.cartTotalItems}
                onClick={() => {
                  scrollTo({ top: 0, behavior: "smooth" });
                  historyNavigate("/checkout");
                }}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        {showNavigation && (
          <div className="border-t border-gray-200/60 mt-1">
            <div className="py-3 overflow-x-auto scrollbar-hide">
              <Navigation menus={data?.websiteBlocks?.menus} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderMini;

const SocialLinks: FC<SocialLinksProps> = ({ isMobile }) => {
  if (isMobile) return null;
  return (
    <div className="flex items-center space-x-2">
      <a
        href="https://www.facebook.com/Minimally.mn"
        className="h-7 w-7 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-200 hover:scale-110"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook хуудас"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.95 0 1.9.17 1.9.17v2.1h-1.1c-1 0-1.3.63-1.3 1.3V12h2.2l-.35 2.9h-1.85v7A10 10 0 0 0 22 12Z" />
        </svg>
      </a>
      <a
        href="https://www.instagram.com/Minimally_official/"
        className="h-7 w-7 flex items-center justify-center rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 hover:text-pink-700 transition-all duration-200 hover:scale-110"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram хуудас"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 17.8 2.8 2.8 0 0 0 12 9.2Zm5.55-1.65a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z" />
        </svg>
      </a>
    </div>
  );
};

const MenuToggle: FC<{
  open?: boolean;
  onClick: () => void;
  className?: string;
}> = ({ open, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Цэс хаах" : "Цэс нээх"}
      aria-pressed={open}
      className={clsx(
        "relative h-10 w-10 flex items-center justify-center rounded-xl",
        "bg-gray-50 hover:bg-gray-100 active:bg-gray-200",
        "transition-all duration-200 active:scale-95",
        className
      )}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <span
          className={clsx(
            "absolute block h-0.5 w-4 bg-gray-700 transition-all duration-300 ease-in-out rounded-full",
            open ? "rotate-45 translate-y-0" : "-translate-y-1"
          )}
        />
        <span
          className={clsx(
            "absolute block h-0.5 w-4 bg-gray-700 transition-all duration-300 ease-in-out rounded-full",
            open ? "opacity-0 scale-x-0" : "scale-x-100"
          )}
        />
        <span
          className={clsx(
            "absolute block h-0.5 w-4 bg-gray-700 transition-all duration-300 ease-in-out rounded-full",
            open ? "-rotate-45 translate-y-0" : "translate-y-1"
          )}
        />
      </div>
    </button>
  );
};

const SearchIconButton: FC<{
  onClick: () => void;
  className?: string;
}> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Хайлт нээх"
      className={clsx(
        "h-10 w-10 flex items-center justify-center rounded-xl",
        "bg-gray-50 hover:bg-gray-100 active:bg-gray-200",
        "border border-gray-200 hover:border-gray-300",
        "transition-all duration-200 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 :ring-offset-1",
        className
      )}
    >
      <Search size={18} className="text-gray-700" />
    </button>
  );
};
