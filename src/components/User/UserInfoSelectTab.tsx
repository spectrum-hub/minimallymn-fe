import { NavLink, useLocation, matchPath } from "react-router";
import { User2, Smartphone, KeyRound } from "lucide-react";
import { motion } from "framer-motion";

const UserInfoTab = () => {
  const pathname = useLocation()?.pathname;

  // Minimal clean tab styles
  const tabBaseStyles = `
    flex items-center gap-2 px-4 py-3 text-sm font-medium
    rounded-lg transition-all duration-200 ease-out
    text-gray-600 hover:text-gray-900 hover:bg-gray-50
    border border-transparent hover:border-gray-200
    min-w-[120px] justify-center
  `;

  // Active state - subtle and clean
  const activeTabStyles = `
    bg-gray-900 text-white border-gray-900
    hover:bg-gray-800 hover:text-white
  `;

  // Smooth animations
  const tabVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
    initial: { scale: 1 },
  };

  return (
    <div className="flex gap-3 mb-6 p-1 bg-gray-50 rounded-xl">
      <motion.div
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={tabVariants}
      >
        <NavLink
          to="/account/profile"
          className={`${tabBaseStyles} ${
            matchPath(pathname, "/account/profile") ? activeTabStyles : ""
          }`}
        >
          <User2 className="w-4 h-4" />
          <span className="text-sm">Хувийн мэдээлэл</span>
        </NavLink>
      </motion.div>

      <motion.div
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={tabVariants}
      >
        <NavLink
          to="/account/phone-update"
          className={`${tabBaseStyles} ${
            matchPath(pathname, "/account/phone-update") ? activeTabStyles : ""
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span className="text-sm">Гар утас</span>
        </NavLink>
      </motion.div>

      <motion.div
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={tabVariants}
      >
        <NavLink
          to="/account/password"
          className={`${tabBaseStyles} ${
            matchPath(pathname, "/account/password") ? activeTabStyles : ""
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span className="text-xs">Нууц үг</span>
        </NavLink>
      </motion.div>
    </div>
  );
};

export default UserInfoTab;
