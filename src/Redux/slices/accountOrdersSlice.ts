// accountOrdersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaymentTypes } from "../../types/Cart";

interface Order {
  id: string;
  name: string;
  state: string;
  amountTotal: number;
  partnerId: number;
  dateOrder: string;
  paymentMethodDesc: PaymentTypes;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Orders {
  orders: Order[];
  pageInfo: PageInfo | null;
  totalCount: number;
  genericdata: unknown;
  message: string | null;
}

interface AccountOrdersState {
  data: Orders | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
}

const initialState: AccountOrdersState = {
  data: null,
  loading: false,
  error: null,
  message: null,
  success: false,
};

const accountOrdersSlice = createSlice({
  name: "accountOrders",
  initialState,
  reducers: {
    setOrdersRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
      state.success = false;
    },
    setOrdersSuccess: (state, action: PayloadAction<Orders>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
      state.message = action.payload.message || "Orders fetched successfully";
      state.success = true;
    },
    setOrdersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.message = action.payload;
      state.success = false;
      state.data = null;
    },
  },
});

export const { setOrdersRequest, setOrdersSuccess, setOrdersFailure } =
  accountOrdersSlice.actions;

export default accountOrdersSlice.reducer;

export type { Order, PageInfo, AccountOrdersState };
