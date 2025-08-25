import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.amall.shopping",
  appName: "antmall.mn",
  webDir: "dist",
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "DARK",
      backgroundColor: "#28133f",
    },
  },
};

export default config;
