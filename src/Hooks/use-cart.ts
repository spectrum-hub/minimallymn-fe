import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { getCartAsync } from "../Redux/cartActions";
import { useEffect, useState } from "react";
import { CartResponse } from "../types/Cart";

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const getCart = useSelector((state: RootState) => state.cart);

  const [cart, setCart] = useState<CartResponse | null>();
  const refetchCart = () => dispatch(getCartAsync());

  useEffect(() => {
    setCart(getCart.cart);
  }, [getCart]);

  const loading = getCart.loading;

  return { cart, loading, refetchCart };
};
