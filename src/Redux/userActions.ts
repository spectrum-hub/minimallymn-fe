import { Dispatch } from "redux";
import { apolloClient } from "../lib/apolloClient";
import { USER_PROFILE } from "../api/user";
import {
  setUserFailure,
  setUserInfo,
  setUserRequest,
} from "./slices/userInfoSlice";
import { gql } from "@apollo/client";

export const getUserProfile = () => async (dispatch: Dispatch) => {
  try {
    dispatch(setUserRequest());

    const response = await apolloClient.query({
      query: USER_PROFILE,
      // fetchPolicy: "no-cache",
    });
    dispatch(setUserInfo(response?.data));
    return {
      success: true,
      message: response?.data.message,
    };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    dispatch(setUserFailure(errorMessage));
    console.error("User Info Fetch Error:", err);
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const USER_PHONE_UPDATE = gql`
  mutation updatePhone($phone: String!, $otp: String, $action: String!) {
    updatePhone(phone: $phone, otp: $otp, action: $action) {
      success
      message
      userId
      userData
      pdata
      expiresIn
    }
  }
`;

// Redux Action
export const userPhoneUpdateAsync =
  (userData: {
    phone: string;
    otp?: string;
    action: "request_otp" | "verify_otp";
  }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(setUserRequest());

      const response = await apolloClient.mutate({
        mutation: USER_PHONE_UPDATE,
        variables: {
          phone: userData.phone,
          otp: userData.otp,
          action: userData.action,
        },
      });

      const userInfo = response.data?.updatePhone;

      if (!userInfo?.success) {
        dispatch(
          setUserFailure(
            userInfo?.message ?? "Failed to process phone update request"
          )
        );
        return userInfo?.message ?? "Failed to process phone update request";
      } else {
        dispatch(setUserInfo(userInfo));
      }

      return {
        success: true,
        message: userInfo.message,
        expiresIn: userInfo.expiresIn,
      };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      dispatch(setUserFailure(errorMessage));
      console.error("Phone Update Error:", err);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };
