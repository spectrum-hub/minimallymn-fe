import { FC } from "react";
import { ProductItem } from "../../types/Products";
import { cn } from "../../lib/utils";
import { ProductLink } from "../Links";
import style from "./style.module.css";
import IconButton from "./IconButton";
import Badge from "../Badge";
import { useAddWishlist, useRemoveWishlist } from "../../Hooks/use-wishlist";
import { useLocation } from "react-router";
import { baseURL } from "../../lib/configs";

interface ProductItemProps {
  item: ProductItem;
  listType?: "products" | "wishlist";
  action?: (arg?: "products" | "wishlist") => void;
  isMobile?: boolean;
}

const ProductItemCard: FC<ProductItemProps> = ({
  item,
  listType = "products",
  action,
  isMobile,
}) => {
  const discountPrice = Number(item.standardPrice);
  const price = Number(item.listPrice);
  const differnce = discountPrice - price;
  const {
    addWishlist,
    loading: addLoading,
    // error: addError,
  } = useAddWishlist(item.id, item.name);

  const location = useLocation();

  const {
    removeWishlist,
    loading: removeLoading,
    // error: addError,
  } = useRemoveWishlist(item.id, item.name);

  const discount =
    discountPrice > price ? (differnce * 100) / discountPrice : 0;

  const isNew = false; // Consider making this dynamic based on product data
  const brand = undefined; // Dynamic placeholder, can be set via item.brand
  const originalPrice = discountPrice > 0 ? item.standardPrice : undefined;

  const handleAddToWishlist = async () => {
    await addWishlist();
  };

  const handleRemoveFromWishlist = async () => {
    try {
      const w = await removeWishlist();
      if (w) {
        action?.("wishlist");
      }
    } catch (er) {
      console.log(er);
    }
  };

  return (
    <div
      className={` ${isMobile ? "" : " group "} relative bg-white w-full shadow 
          transition-all hover:shadow-lg  rounded-md `}
    >
      <ProductLink
        item={item}
        className="relative rounded
        flex flex-col justify-end h-full w-full "
        returnTo={`${location.pathname}/${location.search}`}
      >
        {(discount > 0 || isNew) && (
          <div className="absolute left-3 top-3 z-10 space-y-2">
            {discount > 0 && (
              <Badge variant="outline" className="font-semibold shadow-sm">
                {discount.toFixed(0)}%
              </Badge>
            )}
            {isNew && (
              <Badge className="bg-emerald-100 text-emerald-700 shadow-sm">
                Шинэ
              </Badge>
            )}
          </div>
        )}

        {brand && <Badge className={style.badge}>{brand}</Badge>}

        <div className="  rounded-t-lg bg-white  overflow-hidden ">
          <img
            src={`${baseURL}${
              item?.indicesCount > 1
                ? item?.variantImageUrl
                : item?.mainImageUrl
            }`}
            alt={item?.name ?? ""}
            className="
            mx-auto w-full object-contain max-h-[180px]
            center-image p-1 h-full
          "
            loading="lazy"
          />
        </div>

        <div className="p-2 h-20 ">
          <h3 className="mt-0 text-black line-clamp-2 font-medium text-xs md:text-[13px]">
            {`${item?.templateName?.mn_MN}-${item?.attValueName?.mn_MN}`}
          </h3>
          <div className="mt-1 flex items-baseline gap-2 text-xs md:text-sm">
            <span className=" font-medium text-black">
              {Number(price) > 0 ? `${price.toLocaleString()}₮` : ""}
            </span>
            {originalPrice && (
              <span className=" text-muted-foreground line-through text-red-600">
                {originalPrice.toLocaleString()} ₮
              </span>
            )}
          </div>
        </div>
      </ProductLink>

      {!isMobile ? (
        <div className={cn(style.hoverButtonsGroup, "group-hover:opacity-100")}>
          {listType === "products" ? (
            <IconButton
              onClick={handleAddToWishlist}
              icon="heart"
              className="text-red-700 bg-white shadow-lg"
              loading={addLoading}
            />
          ) : (
            <IconButton
              onClick={handleRemoveFromWishlist}
              icon={"delete"}
              className="text-red-700 bg-white shadow-lg"
              loading={removeLoading}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ProductItemCard;
