import { Dispatch } from "redux";
import { apolloClient } from "../lib/apolloClient";
import { USER_INFO, USER_INFO_UPDATE } from "../api/user";
import { UserInfoType } from "../types/Auth";
import {
  setUserFailure,
  setUserInfo,
  setUserRequest,
} from "./slices/userInfoSlice";
import { gql } from "@apollo/client";

export const userInfoAsync = () => async (dispatch: Dispatch) => {
  try {
    dispatch(setUserRequest());

    const response = await apolloClient.mutate({
      mutation: USER_INFO,
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

interface UserData {
  cityId: string;
  districtId: string;
  baghorooId: string;
  street?: string;
  name: string;
  email?: string;
}

interface UserDataNew {
  name: string;
  email?: string;
}



export const userInfoUpdateAsync =
  (userData: UserData) => async (dispatch: Dispatch) => {
    try {
      dispatch(setUserRequest());

      const response = await apolloClient.mutate({
        mutation: USER_INFO_UPDATE,
        variables: {
          cityId: userData.cityId,
          districtId: userData.districtId,
          baghorooId: userData.baghorooId,
          street: userData.street,
          name: userData.name,
          email: userData.email,
        },
      });

      const userInfo: UserInfoType = response.data?.userInfo;

      if (!userInfo?.success) {
        throw new Error(
          userInfo?.message ??
            "Хэрэглэгчийн мэдээллийг шинэчлэхэд алдаа гарлаа."
        );
      }

      dispatch(setUserInfo(userInfo));
      return {
        success: true,
        message: userInfo.message,
      };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      dispatch(setUserFailure(errorMessage));
      console.error("User Info Update Error:", err);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

export const userInfoUpdateAsyncNew =
  (userData: UserDataNew) => async (dispatch: Dispatch) => {
    try {
      dispatch(setUserRequest());

      const response = await apolloClient.mutate({
        mutation: USER_INFO_UPDATE,
        variables: {
          // cityId: userData.cityId,
          // districtId: userData.districtId,
          // baghorooId: userData.baghorooId,
          // street: userData.street,
          name: userData.name,
          email: userData.email,
        },
      });

      const userInfo: UserInfoType = response.data?.userInfo;

      if (!userInfo?.success) {
        throw new Error(
          userInfo?.message ??
            "Хэрэглэгчийн мэдээллийг шинэчлэхэд алдаа гарлаа."
        );
      }

      dispatch(setUserInfo(userInfo));
      return {
        success: true,
        message: userInfo.message,
      };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      dispatch(setUserFailure(errorMessage));
      console.error("User Info Update Error:", err);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

// GraphQL Mutation
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
        dispatch(setUserFailure(userInfo?.message ?? "Failed to process phone update request"));
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
