import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WebBlocksResponse } from "../../types/Blocks";

interface LayoutState {
  data: WebBlocksResponse | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  success?: boolean;
}

const initialState: LayoutState = {
  data: null,
  loading: false,
  error: null,
  message: null,
  success: false,
};

const layoutSlice = createSlice({
  name: "layouts",
  initialState,
  reducers: {
    setLayoutRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    setLayoutSuccess: (
      state,
      action: PayloadAction<WebBlocksResponse | null>
    ) => {
      state.data = action.payload;
      state.loading = false;
    },
    setLayoutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.message = action.payload;
    },
  },
});

export const { setLayoutSuccess, setLayoutRequest, setLayoutFailure } =
  layoutSlice.actions;
export default layoutSlice.reducer;
