import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartResponse } from "../../types/Cart";

interface CartState {
  cart: CartResponse | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  message: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCart: (state, action: PayloadAction<CartResponse | null>) => {
      state.cart = action.payload;
      state.loading = false;
    },
    setCartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.message = action.payload;
    },
  },
});

export const { setCart, setCartRequest, setCartFailure } = cartSlice.actions;
export default cartSlice.reducer;
