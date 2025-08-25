import { Spin } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import { AUTH_SESSION_ID } from "../../Constants";
import { logout } from "../../Redux/slices/authSlice";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

const AccountLogoutScreen = () => {
  const dispatch: AppDispatch = useDispatch();
    const { historyNavigate } = useHistoryNavigate();

  useEffect(() => {
    localStorage.removeItem(AUTH_SESSION_ID);
    dispatch(logout());
    historyNavigate("/"); // Ensure navigation happens after logout
  }, [dispatch, historyNavigate]);

  return <Spin fullscreen />;
};

export default AccountLogoutScreen;
