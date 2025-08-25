import { NavLink, useLocation, matchPath } from "react-router";
import { User2, Smartphone } from "lucide-react";
import { motion } from "framer-motion"; // Animation-д зориулсан сан нэмнэ

const UserInfoTab = () => {
  const pathname = useLocation()?.pathname;

  // Табын нийтлэг стилүүд
  const tabBaseStyles = `
    flex items-center space-x-2 max-w-[140px]
    rounded-xl pl-2 pr-3 py-0 text-xs bg-white 
    border border-gray-200 transition-all duration-300 ease-in-out 
    hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-500 
    hover:text-white hover:scale-105 focus:outline-none 
    focus:ring-2 focus:ring-orange-300 font-arial h-12 
  `;

  // Идэвхтэй төлвийн стиль
  const activeTabStyles = `
    bg-gradient-to-r bg-orange-400 bg-gradient-to-r from-orange-400 to-orange-500 
    text-white shadow-orange-200/50 shadow
  `;

  // Animation хувилбарууд
  const tabVariants = {
    hover: { scale: 1.0, rotate: 0, transition: { duration: 0.3 } },
    active: { scale: 1.0, rotate: 1, transition: { duration: 0.2 } },
    initial: { scale: 1, rotate: 0 },
  };

  return (
    <div className="flex gap-1 mb-2 md:mb-4 ">
      <motion.div initial="initial" whileHover="hover" variants={tabVariants}>
        <NavLink
          to="/account/profile"
          className={`${tabBaseStyles} ${
            matchPath(pathname, "/account/profile") ? activeTabStyles : ""
          }`}
        >
          <User2 className="w-5 h-4" />
          <span className="">Хувийн мэдээлэл</span>
        </NavLink>
      </motion.div>

      <motion.div initial="initial" whileHover="hover" variants={tabVariants}>
        <NavLink
          to="/account/phone-update"
          className={`${tabBaseStyles} ${
            matchPath(pathname, "/account/phone-update") ? activeTabStyles : ""
          }`}
        >
          <Smartphone className="w-5 h-5" />
          <span className="">Гар утас</span>
        </NavLink>
      </motion.div>

      <motion.div initial="initial" whileHover="hover" variants={tabVariants}>
        <NavLink
          to="/account/password"
          className={`${tabBaseStyles} ${
            matchPath(pathname, "/account/password") ? activeTabStyles : ""
          }`}
        >
          <Smartphone className="w-5 h-5" />
          <span className="">Нууц үг шинэчлэх</span>
        </NavLink>
      </motion.div>
    </div>
  );
};

export default UserInfoTab;
