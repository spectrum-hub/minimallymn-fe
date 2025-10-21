import { NavLink } from "react-router";
import { ProductItem } from "../../types/Products";

const ProductLink = ({
  item,
  children,
}: {
  item?: ProductItem;
  children: React.ReactNode;
}) => {
  return (
    <NavLink className="block" to={`/products/${item?.productId}`}>
      {children}
    </NavLink>
  );
};

export default ProductLink;