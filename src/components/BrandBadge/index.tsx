import { FC } from "react";
import { ProductBrand } from "../../types/Products";
import style from "./style.module.css";

interface Props {
  brand?: ProductBrand;
  isViewBrand: boolean;
}
const BrandBadge: FC<Props> = ({ brand, isViewBrand }) => {
  if (isViewBrand) {
    return null;
  }

  if (brand?.logo && brand.logo.length > 10) {
    return (
      <img
        src={`data:image/png;base64,${brand?.logo}`}
        alt={`${brand?.name} Logo`}
        className={style.brandLogo}
      />
    );
  }
  return <h2 className={style.brandName}>{brand?.name}</h2>;
};

export default BrandBadge;
