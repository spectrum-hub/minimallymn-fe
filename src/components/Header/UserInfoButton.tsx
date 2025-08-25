import { User } from "lucide-react";
import { FC } from "react";
import { UserInfoType } from "../../types/Auth";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

const UserInfoButton: FC<{
  isAuthenticated?: boolean;
  userInfo?: UserInfoType | null;
  isMobile?: boolean;
}> = ({ isAuthenticated, userInfo, isMobile }) => {
  const { historyNavigate } = useHistoryNavigate();
  const { userData } = userInfo?.userInfo ?? {};

  const renderUserIcon = () => {
    if (isMobile) {
      return (
        <User className=" border-2 rounded-full p-1 w-8 h-8 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-300" />
      );
    }

    return (
      <User className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-300" />
    );
  };

  if (isAuthenticated) {
    return (
      <button
        className="flex items-center space-x-1 text-sm p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 group"
        onClick={() => {
          scrollTo({ top: 0, behavior: "smooth" });
          historyNavigate("/account/profile");
        }}
      >
        {renderUserIcon()}

        <span className="hidden sm:inline text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-300">
          {userData?.name ?? userData?.login}
        </span>
      </button>
    );
  }
  return (
    <button
      className="flex items-center space-x-1 text-sm p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 group"
      onClick={() => {
        scrollTo({ top: 0, behavior: "smooth" });
        historyNavigate("/auth/login");
      }}
    >
      {renderUserIcon()}
      <span className="hidden sm:inline text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-300">
        Нэвтрэх
      </span>
    </button>
  );
};

export default UserInfoButton;
