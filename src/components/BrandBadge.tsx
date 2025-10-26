import { FC } from "react";
import { ProductBrand } from "../types/Products";

const BrandBadge: FC<{ brand?: ProductBrand; isViewBrand: boolean }> = ({
  brand,
  isViewBrand,
}) => {
  if (isViewBrand) {
    return null;
  }

  if (brand?.logo && brand.logo.length > 10) {
    return (
      <img
        src={`data:image/png;base64,${brand?.logo}`}
        alt={`${brand?.name} Logo`}
        className="
            w-20 md:w-24 min-h-14 object-contain 
            border border-gray-200 rounded-lg
            p-2 mb-2
        "
      />
    );
  }
  return (
    <h2 className="text-lg 
      border border-gray-100 rounded-lg max-w-28 text-center
      font-semibold text-gray-900 font-sans ">
      {brand?.name}
    </h2>
  );
};

export default BrandBadge;
