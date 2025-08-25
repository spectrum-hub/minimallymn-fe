import { useContext } from "react";
import { Context } from "../context/NotificationCtx";

export const useNotification = () => useContext(Context);
