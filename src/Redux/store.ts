import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import authReducer from "./slices/authSlice";
import userInfoSlice from "./slices/userInfoSlice";
import accountOrdersSlice from "./slices/accountOrdersSlice";
import layoutSlice from "./slices/layoutSlice";
import categorySlice from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    userInfo: userInfoSlice,
    accountOrders: accountOrdersSlice,
    layouts: layoutSlice,
    category: categorySlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
