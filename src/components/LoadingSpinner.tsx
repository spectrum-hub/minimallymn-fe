import React from "react";
import { Spin } from "antd";

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-16">
    <Spin size="large" />
  </div>
);

export default LoadingSpinner;
