import { LOGIN_USER, RESET_PASSWORD, VALIDATE_OTP } from "../api/auth";
import {
  authRequest,
  loginFailure,
  loginSuccess,
  notRegistered,
  otpLoginRequestFailure,
} from "./slices/authSlice";
import { Dispatch } from "redux";
import { AUTH_SESSION_ID, NOT_REGISTERED_STATUS_TXT } from "../Constants";
import { encryptData } from "../lib/helpers";
import { apiApolloMutateAsync } from "../api";

export const mobileLoginAsync = async (
  phone: string
): Promise<{
  success: boolean;
  message: string;
  status: string;
}> => {
  try {
    const response = await apiApolloMutateAsync({
      mutation: RESET_PASSWORD,
      variables: {
        name: phone,
        username: phone,
        action: "reset_password_request",
      },
    });
    const { message, success, status } = response?.data.mobileLogin ?? {};

  
    return { success, message, status };
  } catch (err) {
    console.error("Reset Password Error:", err);
    return {
      success: false,
      message: "Нууц үг сэргээхэд алдаа гарлаа.",
      status: "Error",
    };
  }
};

export const validateOTPAsync =
  (phone: string, otpCode: string) => async (dispatch: Dispatch) => {
    dispatch(authRequest());
    try {
      const response = await apiApolloMutateAsync({
        mutation: VALIDATE_OTP,
        variables: {
          username: phone,
          smsPassword: String(otpCode),
          action: "reset_password_otp",
        },
      });
      const responce = response?.data.mobileLogin;

      if (responce.success) {
        localStorage.setItem(AUTH_SESSION_ID, encryptData(responce?.sessionId));
        dispatch(loginSuccess({ user: { phone }, token: responce?.sessionId }));
      } else {
        dispatch(otpLoginRequestFailure(responce?.message));
      }

      return {
        success: responce?.success,
        message: responce?.message,
      };
    } catch (err) {
      console.error("Reset Password Error:", err);
      dispatch(loginFailure("Нууц үг сэргээхэд алдаа гарлаа."));
      return { success: false, message: "Нууц үг сэргээхэд алдаа гарлаа." };
    }
  };

export const loginAsync =
  (phone: string, password: string) => async (dispatch: Dispatch) => {
    dispatch(authRequest());

    try {
      const r = await apiApolloMutateAsync({
        mutation: LOGIN_USER,
        variables: {
          username: phone,
          password: String(password),
        },
      });
      const l = r?.data?.login;
      if (l.type === NOT_REGISTERED_STATUS_TXT) {
        dispatch(notRegistered(l.type));
      }
      if (l.type !== NOT_REGISTERED_STATUS_TXT) {
        if (l.success) {
          localStorage.setItem(AUTH_SESSION_ID, encryptData(l?.sessionId));
          dispatch(loginSuccess({ user: { phone }, token: l?.sessionId }));
        } else {
          dispatch(loginFailure(l?.message));
        }
      }

      return {
        success: l?.success,
        message: l?.message,
        type: l.type,
      };
    } catch (err) {
      console.error("Reset Password Error:", err);
      dispatch(loginFailure("Нэвтрэхэд алдаа гарлаа."));
      return { success: false, message: "Нэвтрэхэд алдаа гарлаа." };
    }
  };
