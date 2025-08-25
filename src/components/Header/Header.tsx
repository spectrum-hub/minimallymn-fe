import { LogoLink } from "../Links";
import { matchPath, useLocation } from "react-router";
import { FC, useMemo } from "react";
import Navigation from "./Horizantal-nav";
import { HeaderProps } from "../../types/Common";
import WishlistButton from "./WishlistButton";
import UserInfoButton from "./UserInfoButton";
import CartButton from "./CartButton";
import routes from "../../routes";
import styles from "@/main.module.css";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";

import SearchForm from "./SearchForm";
// import SearchForm from "./SearchForm-amazon";
import { Phone, Send } from "lucide-react";

const Header: FC<HeaderProps> = (props) => {
  const isMobile = props?.isMobile;

  const { data } = useSelector((state: RootState) => state.layouts);

  const pathname = useLocation()?.pathname;
  const showNavigation = useMemo(() => {
    if (pathname?.startsWith("/orders")) return false;
    return (
      routes.find((route) => matchPath(route.path, pathname))?.navigationShow ??
      true
    );
  }, [pathname]);

  return (
    <div
      className={`sticky top-0 w-full shadow-sm z-50 text-sm bg-white ${
        isMobile ? "px-0" : "px-4 "
      } `}
    >
      <div
        className={`
          py-2 flex justify-between items-center 
          text-sm text-gray-600 dark:text-gray-300 
          dark:bg-gray-800  ${styles.} 
          ${
            isMobile
              ? "pt-6 px-4 w-full bg-[#28133f] text-white"
              : "bg-gray-50 "
          }`}
      >
        <span className="text-xs md:font-medium ">
          Antmall.mn-д тавтай морил!
        </span>

        <div className="flex gap-4 ">
          <span className="flex  items-center">
            <Phone size={14} />
            <b className="ml-1  text-sm ">7200-5588</b>
          </span>
          <span className=" hidden md:flex  items-center">
            <Send size={14} />
            <b className="ml-1  text-sm ">info@antmall.mn</b>
          </span>
          <SocialLinks isMobile={isMobile} />
        </div>
      </div>

      {/* Main Header */}

      <div
        className={`${styles.} ${
          isMobile ? "px-1 w-full bg-white " : "bg-white "
        }`}
      >
        <div className="py-4 flex items-center justify-between gap-6">
          {/* Logo */}
          <LogoLink>
            <img
              src="/antmall.svg"
              alt="Antmall Logo"
              className={` h-8 md:h-10 transition-transform duration-300 hover:scale-105 ${
                isMobile ? "pl-4" : ""
              } `}
            />
          </LogoLink>

          {/* Search Form */}
          {!isMobile ? <SearchForm /> : null}

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <WishlistButton isMobile={isMobile} />
            <UserInfoButton
              isAuthenticated={props.isAuthenticated}
              userInfo={props.userInfo}
              isMobile={isMobile}
            />
            <CartButton {...props} isMobile={isMobile} />
          </div>
        </div>

        {/* Navigation */}
        {showNavigation ? (
          <div className=" border-t border-gray-200 dark:border-gray-700 pt-2 overflow-auto custom-overflow ">
            <Navigation menus={data?.websiteBlocks?.menus} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Header;

type SocialLinksProps = {
  isMobile?: boolean;
};

const SocialLinks: FC<SocialLinksProps> = ({ isMobile }) => {
  if (isMobile) {
    return;
  }
  return (
    <div className="flex gap-1">
      <a
        href="https://www.facebook.com/AntMall.mn"
        className="h-5 w-5 hover:shadow-md  p-0 m-0"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={"/images/facebook.png"} alt="facebook.com" className="h-5" />
      </a>
      <a
        href="https://www.instagram.com/antmall_official/"
        target="_blank"
        rel="noopener noreferrer"
        className="h-5 w-5 hover:shadow-md p-0 m-0"
      >
        <img
          src={"/images/instagram.png"}
          alt="instagram.com"
          className="h-5"
        />
      </a>
    </div>
  );
};
