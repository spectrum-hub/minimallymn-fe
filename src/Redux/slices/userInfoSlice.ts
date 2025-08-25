/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfoType } from "../../types/Auth";
import { apolloClient } from "../../lib/apolloClient";
import { gql } from "@apollo/client";

export const UPDATE_PASSWORD = gql`
  mutation updatePassword(
    $username: String!
    $oldPassword: String!
    $password: String!
    $confirmPassword: String!
    $action: String
    $smsPassword: String
  ) {
    updatePassword(
      username: $username
      oldPassword: $oldPassword
      password: $password
      confirmPassword: $confirmPassword
      action: $action
      smsPassword: $smsPassword
    ) {
      success
      message
      userId
      sessionId
      desc
    }
  }
`;

interface UserInfoState {
  data: UserInfoType | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  success?: boolean;
}

const initialState: UserInfoState = {
  data: null,
  loading: false,
  error: null,
  message: null,
  success: false,
};

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (
    {
      username,
      oldPassword,
      newPassword,
    }: {
      username: string;
      oldPassword: string;
      newPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // First request OTP
      const otpRequest = await apolloClient.mutate({
        mutation: UPDATE_PASSWORD,
        variables: {
          username: username, // Added explicit username
          oldPassword: oldPassword, // Added explicit oldPassword
          password: newPassword,
          confirmPassword: newPassword,
          action: "request_otp",
        },
      });

      if (!otpRequest.data?.updatePassword?.success) {
        return rejectWithValue(otpRequest.data?.updatePassword?.message);
      }

      // Note: In a real implementation, you'd need to:
      // 1. Return from here and wait for user to input OTP
      // 2. Then call a separate thunk with the OTP
      // For this example, I'll show the full flow assuming we have the OTP

      const smsPassword = "USER_ENTERED_OTP"; // This should come from user input in practice
      const response = await apolloClient.mutate({
        mutation: UPDATE_PASSWORD,
        variables: {
          username: username, // Added explicit username
          oldPassword: oldPassword, // Added explicit oldPassword
          password: newPassword,
          confirmPassword: newPassword,
          action: "update_password",
          smsPassword: smsPassword,
        },
      });

      const result = response.data?.updatePassword;
      if (!result?.success) {
        return rejectWithValue(result?.message || "Password update failed");
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update password");
    }
  }
);

export const requestPasswordOtp = createAsyncThunk(
  "user/requestPasswordOtp",
  async (
    {
      username,
      oldPassword,
      newPassword,
    }: { username: string; oldPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apolloClient.mutate({
        mutation: UPDATE_PASSWORD,
        variables: {
          username,
          oldPassword,
          password: newPassword,
          confirmPassword: newPassword,
          action: "request_otp",
        },
      });
      const result = response.data?.updatePassword;
      if (!result?.success) {
        return rejectWithValue(result?.message || "OTP request failed");
      }
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to request OTP");
    }
  }
);

export const confirmPasswordUpdate = createAsyncThunk(
  "user/confirmPasswordUpdate",
  async (
    {
      username,
      oldPassword,
      newPassword,
      smsPassword,
    }: {
      username: string;
      oldPassword: string;
      newPassword: string;
      smsPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apolloClient.mutate({
        mutation: UPDATE_PASSWORD,
        variables: {
          username,
          oldPassword,
          password: newPassword,
          confirmPassword: newPassword,
          action: "update_password",
          smsPassword,
        },
      });
      const result = response.data?.updatePassword;
      if (!result?.success) {
        return rejectWithValue(result?.message || "Password update failed");
      }
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update password");
    }
  }
);

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    setUserInfo: (state, action: PayloadAction<UserInfoType | null>) => {
      state.data = action.payload;
      state.loading = false;
    },
    setUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = false;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = action.payload as string;
        state.success = false;
      });
  },
});

export const { setUserInfo, setUserRequest, setUserFailure } =
  userInfoSlice.actions;
export default userInfoSlice.reducer;
