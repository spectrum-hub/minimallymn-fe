import React, { FC } from "react";
import { Home, Search, Heart, User, LayoutGrid } from "lucide-react";
import { useLocation } from "react-router";
import { useWishListCount } from "../../Hooks/use-layout-data";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

type NavItemDef = {
  icon: React.ReactNode;
  label: string;
  link: string;
  notification?: number | null | undefined;
};

const ICON_SIZE = 18;

const BottomNavbar: FC = () => {
  const wishList = useWishListCount();
  const { pathname } = useLocation();

  const items: NavItemDef[] = [
    { icon: <Home size={ICON_SIZE} />, label: "Нүүр", link: "/" },
    {
      icon: <Search size={ICON_SIZE} />,
      label: "Ангилал",
      link: "/mobileCategories",
    },
    {
      icon: <LayoutGrid size={ICON_SIZE} />,
      label: "Бараанууд",
      link: "/products",
    },
    {
      icon: <Heart size={ICON_SIZE} />,
      label: "Хадгалсан",
      link: "/wishlist",
      notification: wishList?.wishListCount,
    },
    { icon: <User size={ICON_SIZE} />, label: "Профайл", link: "/auth/login" },
  ];

  const isActive = (link: string) => {
    if (!pathname) return false;
    if (link === "/") return pathname === "/";
    return pathname === link || pathname.startsWith(link + "/");
  };

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed bottom-3 left-3 right-3 z-50 bg-white/25
       backdrop-blur-sm border border-white/20 shadow-md rounded-full"
      style={{ boxShadow: "0 6px 24px rgba(16,24,40,0.08)" }}
    >
      <div className="max-w-3xl mx-auto px-2 py-2 flex items-center justify-between">
        {items.map((it) => (
          <NavItem
            key={it.link}
            icon={it.icon}
            label={it.label}
            link={it.link}
            notification={it.notification}
            active={isActive(it.link)}
          />
        ))}
      </div>
    </nav>
  );
};

function NavItem({
  icon,
  label,
  link,
  notification,
  active,
}: NavItemDef & { active?: boolean }) {
  const { historyNavigate } = useHistoryNavigate();

  return (
    <button
      onClick={() => historyNavigate(link)}
      aria-current={active ? "page" : undefined}
      aria-label={label}
      className={`flex relative flex-col items-center justify-center gap-0.5 
        focus:outline-none transition-all group`}
      style={{ minWidth: 44 }}
    >
      <div
        className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-transform transform ${
          active ? "scale-105 bg-white/30" : "bg-transparent"
        }`}
      >
        {notification && Number(notification) > 0 ? (
          <span
            className={`
              absolute -top-2 -right-2 inline-flex items-center 
              justify-center rounded-full text-[10px] font-semibold 
              px-1.5 py-0.5 leading-none shadow-sm animate-pop bg-red-600 
              text-white`}
          >
            {notification > 99 ? "99+" : notification}
          </span>
        ) : null}

        {/* Icon - allow icon to inherit currentColor */}
        <span
          className={`group-focus:scale-105 transition-colors ${
            active ? "text-blue-600" : "text-gray-700"
          }`}
        >
          {icon}
        </span>
      </div>

      <span
        className={`text-[10px] font-medium ${
          active ? "text-black" : "text-black/70"
        }`}
      >
        {label}
      </span>

      {/* Active indicator (subtle) */}
      <span
        className={`absolute -top-1 hidden md:block h-0.5 w-5 rounded-full transition-all ${
          active ? "bg-black/80 opacity-100 translate-y-7" : "opacity-0"
        }`}
      />
    </button>
  );
}

export default BottomNavbar;
