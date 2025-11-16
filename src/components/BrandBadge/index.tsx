import { FC } from "react";
import style from "./style.module.css";
import { Brand } from "../../types/Products";
import { baseURL } from "../../lib/configs";

interface Props {
  brand?: Brand;
  isViewBrand?: boolean;
}
const BrandBadge: FC<Props> = ({ brand, isViewBrand = false }) => {
  if (isViewBrand || !brand?.name) {
    return null;
  }

  if (brand?.logo && brand.logo?.main?.length > 10) {
    return (
      <img
        src={`${baseURL}${brand?.logo?.main}`}
        alt={`${brand?.name} Logo`}
        className={style.brandLogo}
      />
    );
  }
  return <h2 className={style.brandName}>{brand?.name}</h2>;
};

export default BrandBadge;
