import { Dispatch } from "@reduxjs/toolkit";
import { apolloClient } from "../lib/apolloClient";
import { GET_CARTS } from "../api/cart";
import { setCart, setCartRequest, setCartFailure } from "./slices/cartSlice";

export const getCartAsync =
  () =>
  async (
    dispatch: Dispatch
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    dispatch(setCartRequest());
    try {
      const { data } = await apolloClient.query({
        query: GET_CARTS,
        fetchPolicy: "no-cache",
      });

      if (data) {
        dispatch(setCart(data));
      } else {
        dispatch(setCartFailure("Сагсны мэдээлэл олдсонгүй."));
      }

      return {
        success: true,
        message: "Сагсны мэдээлэл амжилттай татагдлаа.",
      };
    } catch (err) {
      console.error("Cart Fetch Error:", err);
      dispatch(setCartFailure("Сагсны мэдээлэл татахад алдаа гарлаа."));
      return {
        success: false,
        message: "Сагсны мэдээлэл татахад алдаа гарлаа.",
      };
    }
  };
