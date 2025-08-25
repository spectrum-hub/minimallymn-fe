import { useMutation } from "@apollo/client";
import { ADD_WISHLIST, DELETE_WISHLIST } from "../api/wishlist";
import { useContext } from "react";
import { Context } from "../context/NotificationCtx";
import { useWishListCount } from "./use-layout-data";

export function useAddWishlist(
  itemId: number | undefined,
  itemName: string | undefined
) {
  const { openNotification } = useContext(Context);
  const { refetch } = useWishListCount();

  const [addWishlist, { data, loading, error }] = useMutation(ADD_WISHLIST, {
    variables: {
      userId: 1, // Replace with actual user ID
      productTmplId: itemId, // Replace with actual product template ID
    },
    onCompleted: () => {
      // Show notification when the mutation is successful
      openNotification({
        body: (
          <div>
            Хүслийн жагсаалтанд <b>{itemName}</b> нэмэгдлээ
          </div>
        ),
        title: "Хүслийн жагсаалт",
        type: "success",
      });
      refetch();
    },
    onError: (error) => {
      // Handle errors if needed
      openNotification({
        body: (
          <div>
            Сагсанд нэмэхэд алдаа гарлаа: <b>{error.message}</b>
          </div>
        ),
        title: "Алдаа",
        type: "error",
      });
    },
  });

  return { addWishlist, data, loading, error };
}

export function useRemoveWishlist(
  itemId: number | undefined,
  itemName: string | undefined
) {
  const { openNotification } = useContext(Context);
  const { refetch } = useWishListCount();

  const [removeWishlist, { data, loading, error }] = useMutation(
    DELETE_WISHLIST,
    {
      variables: {
        itemId: itemId,
      },
      onCompleted: () => {
        // Show notification when the mutation is successful
        openNotification({
          body: (
            <div>
              Хүслийн жагсаалтаас <b>{itemName}</b> хаслаа
            </div>
          ),
          title: "Хүслийн жагсаалт",
          type: "success",
        });
        refetch();
      },
      onError: (error) => {
        // Handle errors if needed
        openNotification({
          body: (
            <div>
              Хүслийн жагсаалтаас барааг хасхад алдаа гарлаа:{" "}
              <b>{error.message}</b>
            </div>
          ),
          title: "Алдаа",
          type: "error",
        });
      },
    }
  );

  return { removeWishlist, data, loading, error };
}
