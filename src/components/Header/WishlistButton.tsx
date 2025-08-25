import { Heart } from "lucide-react";
import { FC } from "react";
import { useWishListCount } from "../../Hooks/use-layout-data";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

const WishlistButton: FC<{
  isMobile?: boolean;
}> = ({ isMobile }) => {
  const wishList = useWishListCount();
  const { historyNavigate } = useHistoryNavigate();

  return (
    <button
      className="relative flex items-center space-x-1 text-sm p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 group"
      onClick={() => {
        scrollTo({ top: 0, behavior: "smooth" });
        historyNavigate("/wishlist");
      }}
    >
      {isMobile ? (
        <Heart className=" border-2 rounded-full p-1 w-8 h-8 text-red-500 group-hover:text-red-500 transition-colors duration-300 " />
      ) : (
        <Heart className="w-5 h-5 text-red-500   group-hover:text-red-500 transition-colors duration-300" />
      )}

      {wishList?.wishListCount > 0 ? (
        <span
          className={` absolute -top-[-0px] -right-[1px] bg-red-500 text-white text-[11px] font-bold w-4 h-4  rounded-full flex items-center justify-center `}
        >
          {wishList?.wishListCount}
        </span>
      ) : null}

      <span className="hidden sm:inline text-gray-600 dark:text-gray-300 group-hover:text-purple-600 transition-colors duration-300">
        Хадгалсан
      </span>
    </button>
  );
};

export default WishlistButton;
