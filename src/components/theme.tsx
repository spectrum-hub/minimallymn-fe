import React from "react";
import { ConfigProvider, theme } from "antd";
import useWindowWidth from "../Hooks/use-window-width";
interface Props {
  children?: React.ReactNode;
}
const AppTheme: React.FC<Props> = ({ children }) => {
  const { isMobile } = useWindowWidth();
  return (
    <ConfigProvider
      theme={{
        // 1. Use dark algorithm
        algorithm: isMobile ? theme.compactAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#28133f",
          borderRadius: 4,

          // Alias Token
          // colorBgContainer: "#f6ffed",
        },

        // 2. Combine dark algorithm and compact algorithm
        // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
        components: {
          Button: {
            // colorPrimary: "#28133f",
            // colorPrimaryHover: "#3d2058",
            // colorPrimaryActive: "#1b0d2c",
            primaryShadow: "0 2px 0 rgb(10 0 15 / 1%)",
            // colorPrimary: "#1890ff",
            // colorPrimaryHover: "#40a9ff",
            // colorPrimaryActive: "#096dd9",
            // defaultBorderColor: "#1890ff",
            // defaultBg: "transparent",
            // defaultColor: "#1890ff",
            // defaultHoverBorderColor: "#40a9ff",
            // defaultHoverColor: "#40a9ff",
            // defaultActiveBorderColor: "#096dd9",
            // defaultActiveColor: "#096dd9",
            lineWidth: 1,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AppTheme;
