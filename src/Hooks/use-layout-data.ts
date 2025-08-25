import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWishListCount } from "../Redux/slices/wishlistSlice";
import { GET_WISHLIST_COUNT } from "../api/wishlist";
import useGqlQuery from "./Query";
import { RootState } from "../Redux/store";

// Hook for Wishlist
export const useWishListCount = () => {
  const dispatch = useDispatch();
  const wishListCount = useSelector((state: RootState) => state.wishlist.count);
  const { loading, error, data, refetch } = useGqlQuery<{
    wishlistCount?: number;
  }>(GET_WISHLIST_COUNT);

  useEffect(() => {
    if (data?.wishlistCount) {
      dispatch(setWishListCount(data.wishlistCount));
    }
  }, [data, dispatch]);

  return { loading, error, wishListCount, refetch };
};
