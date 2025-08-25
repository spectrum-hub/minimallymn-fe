import { FC } from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
  variant?: "outline" | "primary";
}
const Badge: FC<Props> = ({ className, children }) => {
  return (
    <div className={`px-2 py-1 m-1 text-white bg-red-500 opacity-80 font-normal rounded text-xs ${className} `}>
      {children}
    </div>
  );
};

export default Badge;
