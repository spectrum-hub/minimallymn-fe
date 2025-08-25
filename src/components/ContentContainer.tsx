import { FC } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}
const ContentContainer: FC<Props> = ({ children, className }) => {
  return (
    <div
      className={`
        min-h-screen transition-colors duration-300 dark:bg-gray-900 
        bg-gray-50  mx-auto px-4 sm:px-6 lg:px-8 py-16
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ContentContainer;
