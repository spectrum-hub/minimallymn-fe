import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apolloClient } from "../../lib/apolloClient";
import { RESET_PASSWORD, VALIDATE_SESSION } from "../../api/auth";
import {
  AUTH_CHECK_STATUS,
  AUTH_MOBILE_LOGIN,
  AUTH_SESSION_ID,
} from "../../Constants";
import { UserInfoType } from "../../types/Auth";

type NOT_REGISTERED_TYPE = "NOT_REGISTERED" | "REGISTERED" | "";
type FormNameType =
  | "login"
  | "reset_password_request"
  | "otp_validate"
  | "register";

interface AuthState {
  user: UserInfoType;
  token: string | null;
  message: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isOTPformShow: boolean;
  formName: FormNameType;
  type?: NOT_REGISTERED_TYPE;
}

const initialState: AuthState = {
  user: {},
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null,
  isOTPformShow: false,
  formName: "login",
  type: "",
};

export const checkAuthStatus = createAsyncThunk(
  AUTH_CHECK_STATUS,
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await apolloClient.mutate({
        mutation: VALIDATE_SESSION,
        variables: { sessionId: token }, // Adjust to match server
      });

      const isAuth = response?.data?.validateSession;

      if (!isAuth?.valid) {
        localStorage.removeItem(AUTH_SESSION_ID);
      }
      return isAuth;
    } catch (error) {
      localStorage.removeItem(AUTH_SESSION_ID);
      return rejectWithValue(
        (error as Error)?.message || "Authentication failed"
      );
    }
  }
);

export const otpLogin = createAsyncThunk(
  AUTH_MOBILE_LOGIN,
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await apolloClient.mutate({
        mutation: RESET_PASSWORD,
        variables: { email },
      });
      return response.data.mobileLogin;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Password reset failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.type = "";
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: UserInfoType; token: string }>
    ) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.type = "";
    },
    notRegistered: (state, action: PayloadAction<NOT_REGISTERED_TYPE>) => {
      state.loading = false;
      state.message = action.payload;
      state.type = action.payload;
    },
    otpLoginRequestSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.message = action.payload;
      state.isOTPformShow = true;
      state.type = "";
    },
    otpLoginRequestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.message = action.payload;
      state.isOTPformShow = true;
      state.error = action.payload;
      state.type = "";
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isOTPformShow = false;
      state.error = action.payload;
      state.message = action.payload;
      state.type = "";
    },
    logout: (state) => {
      state.user = {};
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.type = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.type = "";
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.valid) {
          state.isAuthenticated = true;
          state.user = { id: action.payload.user_id }; // Store user_id if needed
        } else {
          state.isAuthenticated = false;
          state.error = action.payload.message; // e.g., "Invalid or expired session"
        }
        state.type = "";
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.type = "";
      })
      .addCase(otpLogin.pending, (state) => {
        state.loading = true;
        state.type = "";
      })
      .addCase(otpLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.type = "";
      })
      .addCase(otpLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.type = "";
      });
  },
});

export const {
  authRequest,
  loginSuccess,
  loginFailure,
  logout,
  otpLoginRequestSuccess,
  otpLoginRequestFailure,
  notRegistered,
} = authSlice.actions;

export default authSlice.reducer;
