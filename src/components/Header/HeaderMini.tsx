import { FC, useMemo, useState } from "react";
import { matchPath, useLocation } from "react-router";
import { useSelector } from "react-redux";
import clsx from "clsx";

import { LogoLink } from "../Links";
import Navigation from "./Horizantal-nav";
import routes from "../../routes";
import styles from "@/main.module.css";
import { RootState } from "../../Redux/store";
import SearchForm from "./SearchForm";
import HorizantalCategories from "../HorizantalCategories";
import { useDrawerCtx } from "../../Hooks/use-modal-drawer";
import { scrollToTop } from "../../lib/helpers";

import { Phone, Send } from "lucide-react";

import type { HeaderProps } from "../../types/Common";
import { WishlistButton, UserInfoButton, CartButton } from "./HeaderActionsSvg"; // (файлын нэрийг өөрт таарахаар)
import { useHistoryNavigate } from "../../Hooks/use-navigate";
import { useWishListCount } from "../../Hooks/use-layout-data";

type SocialLinksProps = { isMobile?: boolean };

const HeaderMini: FC<HeaderProps> = (props) => {
  const { isMobile } = props;
  const { data } = useSelector((state: RootState) => state.layouts);
  const { setLoading, showDrawer } = useDrawerCtx();
  const { historyNavigate } = useHistoryNavigate();
  const wishList = useWishListCount();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleCategories = () => {
    scrollToTop();
    setMenuOpen(true);
    setLoading(true);
    showDrawer({
      title: "",
      placement: "left",
      width: "320",
      content: <HorizantalCategories />,
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
        "sticky top-0 z-50 w-full text-sm",
        "bg-white"
      )}
    >
      <div
        className={
          "hidden md:flex items-center justify-between py-2 text-[13px] text-gray-600 dark:text-gray-300"
        }
      >
        <span></span>
        <div className="flex items-center gap-4">
          <span className="flex items-center">
            <Phone size={14} />
            <b className="ml-1">77777-77777</b>
          </span>
          <span className="hidden lg:flex items-center">
            <Send size={14} />
            <b className="ml-1">info@minimally.mn</b>
          </span>
          <SocialLinks />
        </div>
      </div>

      {/* Main row */}
      <div className={clsx(styles.headerContainer, isMobile ? "px-2" : "")}>
        <div className="flex items-center justify-between py-2 md:py-3">
          {/* Left side: burger + logo + search */}
          <div className="flex items-center gap-3 md:gap-6">
            <MenuToggle open={menuOpen} onClick={handleToggleCategories} />

            <LogoLink>
              <img
                src="/assets/logo.png"
                alt="Minimally Logo"
                className="h-10 md:h-16 transition-transform duration-300 hover:scale-[1.05]"
              />
            </LogoLink>
          </div>

          {/* Right side: actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <SearchForm />
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

        {/* Nav */}
        {showNavigation ? (
          <div className="pt-1 pb-2 overflow-auto custom-overflow">
            <div className="border-t border-black/10 dark:border-white/10 pt-2">
              <Navigation menus={data?.websiteBlocks?.menus} />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default HeaderMini;

const SocialLinks: FC<SocialLinksProps> = ({ isMobile }) => {
  if (isMobile) return null;
  return (
    <div className="flex gap-2">
      <a
        href="https://www.facebook.com/Minimally.mn"
        className="h-5 w-5 grid place-items-center rounded-full hover:bg-black/5"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="facebook"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.95 0 1.9.17 1.9.17v2.1h-1.1c-1 0-1.3.63-1.3 1.3V12h2.2l-.35 2.9h-1.85v7A10 10 0 0 0 22 12Z" />
        </svg>
      </a>
      <a
        href="https://www.instagram.com/Minimally_official/"
        className="h-5 w-5 grid place-items-center rounded-full hover:bg-black/5"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="instagram"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 17.8 2.8 2.8 0 0 0 12 9.2Zm5.55-1.65a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z" />
        </svg>
      </a>
    </div>
  );
};

const MenuToggle: FC<{
  open: boolean;
  onClick: () => void;
  className?: string;
}> = ({ open, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-pressed={open}
      className={clsx(
        "relative h-9 w-9 grid place-items-center rounded-full",
        "outline-none ring-0 hover:bg-black/5 active:scale-95 transition",
        className
      )}
    >
      <span
        className={clsx(
          "absolute block h-[2px] w-6 bg-current transition-transform duration-300 ease-in-out",
          "-translate-y-2 rotate-0"
        )}
      />
      <span
        className={clsx(
          "absolute block h-[2px] w-6 bg-current transition-all duration-300 ease-in-out",
          "opacity-100 scale-x-100"
        )}
      />
      <span
        className={clsx(
          "absolute block h-[2px] w-6 bg-current transition-transform duration-300 ease-in-out",
          "translate-y-2 rotate-0"
        )}
      />
    </button>
  );
};
