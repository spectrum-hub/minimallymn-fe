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
          colorPrimary: "#3a3a3a",
          borderRadius: 4,
        },

        // 2. Combine dark algorithm and compact algorithm
        // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
        components: {
          Button: {
            primaryShadow: "0 2px 0 rgb(10 0 15 / 1%)",
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
