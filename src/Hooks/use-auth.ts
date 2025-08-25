import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AUTH_SESSION_ID } from "../Constants";
import {
  logout,
} from "../Redux/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();

  const logoutUser = useCallback(() => {
    localStorage.removeItem(AUTH_SESSION_ID);
    dispatch(logout());
  }, [dispatch]);

  return {
    logoutUser,
  };
};
