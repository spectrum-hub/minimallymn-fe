import React, { FC } from "react";
import { Home, Search, Heart, User, LayoutGrid } from "lucide-react";
import { matchPath, useLocation } from "react-router";
import styles from "./mobile.module.css";
import { useWishListCount } from "../../Hooks/use-layout-data";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

interface NavItemProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly link: string;
  readonly active?: boolean;
  notification?: number;
}

type Props = object;
const BottomNavbar: FC<Props> = () => {
  const wishList = useWishListCount();
  const pathname = useLocation()?.pathname;

  const iconSize = {
    size: 24,
  };
  return (
    <nav
      className={`
      fixed bottom-0 left-0 right-0 bg-white border-t 
      border-gray-200 z-50 shadow-xl flex py-4 pb-5
    `}
    >
      <NavItem
        icon={<Home {...iconSize} />}
        label="Нүүр"
        active={!!matchPath("/", pathname)}
        link="/"
      />
      <NavItem
        icon={<Search {...iconSize} />}
        label="Ангилал"
        link="/mobileCategories"
        active={!!matchPath("/mobileCategories", pathname)}
      />
      <NavItem
        icon={<LayoutGrid {...iconSize} />}
        label="Бараанууд"
        link="/products"
        active={!!matchPath("/products", pathname)}
      />
      <NavItem
        icon={<Heart {...iconSize} />}
        label="Хадгалсан"
        link="/wishlist"
        notification={wishList?.wishListCount}
        active={!!matchPath("/wishlist", pathname)}
      />
      <NavItem
        icon={<User {...iconSize} />}
        label="Профайл"
        link="/auth/login"
        active={!!matchPath("/auth/login", pathname)}
      />
    </nav>
  );
};

function NavItem({
  icon,
  label,
  active,
  link,
  notification,
}: Readonly<NavItemProps>) {
  const { historyNavigate } = useHistoryNavigate();
  return (
    <button
      onClick={() => historyNavigate(link)}
      className={`
        ${styles.button}
        ${
          active
            ? "text-blue-600"
            : "text-gray-600 hover:text-blue-600 active:text-blue-700"
        }`}
    >
      {Number?.(notification) > 0 ? (
        <span className={styles.navNotification}>{notification}</span>
      ) : null}
      {icon}
      <span className="text-[11px] font-semibold">{label}</span>
    </button>
  );
}

export default BottomNavbar;
