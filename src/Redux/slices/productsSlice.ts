import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductsQueryResponseData } from "../../types/Products";

interface ProductsState {
  data: ProductsQueryResponseData | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  success?: boolean;
}

const initialState: ProductsState = {
  data: null,
  loading: false,
  error: null,
  message: null,
  success: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProductsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    setProductsSuccess: (
      state,
      action: PayloadAction<ProductsQueryResponseData | null>
    ) => {
      const data = action.payload;
      state.data = data;
      state.loading = false;
    },
    setProductsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.message = action.payload;
    },
  },
});

export const { setProductsRequest, setProductsSuccess, setProductsFailure } =
  productsSlice.actions;
export default productsSlice.reducer;
