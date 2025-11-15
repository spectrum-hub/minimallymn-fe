import { FC } from "react";
import { Link } from "react-router";

interface LogoProps {
  children: React.ReactNode;
  className?: string;
}

const LogoLink: FC<LogoProps> = ({ children, className }) => {
  return (
    <Link to={"/"} className={className}>
      {children}
    </Link>
  );
};

interface MLinkProps {
  pathname?: string;
  className?: string;
  label: string;
}

export const MLink: FC<MLinkProps> = ({
  className = "",
  pathname = "/",
  label,
}) => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Link to={pathname} className={className} onClick={handleClick}>
      {label}
    </Link>
  );
};
export { LogoLink };
