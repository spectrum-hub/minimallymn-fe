import { Spin } from "antd";
import { Heart } from "lucide-react";
import { FC } from "react";
import { useAddWishlist } from "../Hooks/use-wishlist";

interface Props {
  itemId: number | undefined
  itemName: string | undefined
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
      ml-[-12px] flex items-center gap-2 p-2 px-4
      rounded-md bg-white hover:bg-gray-100 
      transition-all duration-300 ease-in-out shadow
      mb-2 group
    `}
      disabled={addLoading}
      onClick={() => addWishlist()}
    >
      {addLoading ? (
        <Spin />
      ) : (
        <>
          <Heart className="h-4 w-4 hover:text-red-600" />
          <span className="text-sm">Хадгалах</span>
        </>
      )}
    </button>
  );
};
