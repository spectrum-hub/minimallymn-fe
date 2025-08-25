import { FC } from "react";
import { NavLink } from "react-router";

type NLinkProps = {
  to?: string | number;
  label?: string;
  type?: "category" | "product" | "brand";
};

const NLink: FC<NLinkProps> = ({ to, label, type }) => {

  if (!label || label === "false") return null;

  let link = `/${to}`;

  if (type === "category") link = `/products?category=${to}`;
  if (type === "brand") link = `/products?brand=${to}`;

  return (
    <NavLink
      to={link}
      className={`
        mt-2 mb-4 block text-gray-600  
        ${type === "brand" ? " px-4 py-2 bg-white !mt-1 !mb-0 " : ""}
      `}
    >
      {type === "brand" ? (
        <>
          <span className="text-gray-500 pr-2">Бренд:</span>
          <span className="text-black hover:text-blue-700 font-bold">{label}</span>
        </>
      ) : (
        label
      )}
    </NavLink>
  );
};

export default NLink;

