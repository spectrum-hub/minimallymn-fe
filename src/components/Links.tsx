import { FC } from "react";
import { Link } from "react-router";
import { ProductItem } from "../types/Products";

interface Props {
  item?: ProductItem;
  children: React.ReactNode;
  className?: string;
  returnTo?: string;
}

const ProductLink: FC<Props> = ({ item, children, className, returnTo }) => {
  return (
    <Link
      to={
        "/products/" +
        (item?.productTmplId ?? "") +
        "?name=" +
        (item?.productName
          ? item.productName.toLowerCase().replace(/\s+/g, "-")
          : "") +
        (returnTo ? "&returnTo=" + returnTo : "")
      }
      className={className}
    >
      {children}
    </Link>
  );
};

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
export { ProductLink, LogoLink };
