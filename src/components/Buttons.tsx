import { Spin } from "antd";
import { Heart } from "lucide-react";
import { FC } from "react";
import { useAddWishlist } from "../Hooks/use-wishlist";

interface Props {
  itemId: number | undefined;
  itemName: string | undefined;
}

export const SaveWishList: FC<Props> = ({ itemId, itemName }) => {
  const {
    addWishlist,
    loading: addLoading,
    // error: addError,
  } = useAddWishlist(itemId, itemName);

  return (
    <button
      className={`
        flex items-center justify-center gap-2 px-4 py-2.5
        rounded-xl bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200
        transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
        shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        group
      `}
      disabled={addLoading}
      onClick={() => addWishlist()}
      aria-label="Add to wishlist"
    >
      {addLoading ? (
        <Spin size="small" />
      ) : (
        <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
      )}
      <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors duration-200">
        Хадгалах
      </span>
    </button>
  );
};
