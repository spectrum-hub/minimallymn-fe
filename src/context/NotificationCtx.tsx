import React, { useMemo } from "react";
import { notification } from "antd";
import type { NotificationArgsProps } from "antd";

type NotificationPlacement = NotificationArgsProps["placement"];
export type NotificationType = "success" | "error" | "warning" | "info";

const Context = React.createContext<{
  name: string;
  openNotification: (params: {
    placement?: NotificationPlacement;
    title?: string;
    body: React.ReactNode;
    type?: NotificationType;
  }) => void;
}>({
  name: "Default",
  openNotification: () => {},
});

const NotificationCtx: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = React.useCallback(
    ({
      placement,
      title,
      body,
      type,
      duration = 3
    }: {
      placement?: NotificationPlacement;
      title?: string;
      body: React.ReactNode;
      type?: NotificationType;
      duration?: number;
    }) => {
      api[type ?? "success"]({
        placement: placement ?? "bottomRight",
        message: title, // Set the title of the notification
        description: body, // Set the body of the notification
        duration
      });
    },
    [api]
  );

  const contextValue = useMemo(
    () => ({
      name: "Minimally.mn",
      openNotification, // Expose the function
    }),
    [openNotification]
  );

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      {children}
    </Context.Provider>
  );
};

export { Context };
export default NotificationCtx;
