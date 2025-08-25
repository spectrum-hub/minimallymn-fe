import { FC } from "react";
import style from "./style.module.css";
import Badge from "../Badge";
import { MarketplaceItem } from "../../types/Marketplace";
import { NavLink } from "react-router";

interface ProductItemProps {
  item: MarketplaceItem;
  listType?: "products" | "wishlist";
  action?: (arg?: "products" | "wishlist") => void;
  type?: "detail" | "list" | "slider";
  isMobile?: boolean;
}

const USD = 3583;
const calculatePrice = (price: number) => {
  return price > 0 ? Number((price * USD).toFixed(0)) : 0;
};

const MarketplaceItemItemCard: FC<ProductItemProps> = ({ item, isMobile }) => {
  const productItem = item.commerceDescription;

  const discountPrice = Number(productItem.promotionPrice?.originalPrice);
  const price = Number(productItem?.price?.originalPrice || 0);
  const differnce = discountPrice - price;
  // const {
  //   addWishlist,
  //   loading: addLoading,
  //   // error: addError,
  // } = useAddWishlist(item.id, item.name);

  // const {
  //   removeWishlist,
  //   loading: removeLoading,
  //   // error: addError,
  // } = useRemoveWishlist(item.id, item.name);

  const discount =
    discountPrice > price ? (differnce * 100) / discountPrice : 0;

  const isNew = false; // Consider making this dynamic based on product data
  const brand = undefined; // Dynamic placeholder, can be set via item.brand
  const originalPrice =
    discountPrice > 0 ? productItem.price.originalPrice : undefined;

  // const handleAddToWishlist = async () => {
  //   await addWishlist();
  // };

  // const handleRemoveFromWishlist = async () => {
  //   try {
  //     const w = await removeWishlist();
  //     if (w) {
  //       action?.("wishlist");
  //     }
  //   } catch (er) {
  //     console.log(er);
  //   }
  // };

  const linkTo = `/marketplace/${
    item?.commerceDescription?.id
  }?provider=${"AMAZON"}&name=${item?.name}`;

  return (
    <div
      className={` ${
        isMobile ? "" : " group "
      } relative rounded-lg bg-white w-full shadow-md 
          transition-all hover:shadow-lg `}
    >
      <NavLink
        to={linkTo}
        className="relative rounded-lg
        flex flex-col justify-end h-full w-full "
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

        <div className="  rounded-t-lg bg-white md:h-48 h-44 overflow-hidden ">
          <img
            src={productItem?.mainPictureUrl || ""}
            alt={item?.name ?? ""}
            className="
                duration-300 group-hover:scale-105 bg-white 
                rounded-md  cursor-pointer p-0.5
                top-4 left-4 w-full h-full object-contain
                transition-transform ease-in-out
                "
            loading="lazy"
          />
        </div>

        <div className="px-4 py-2">
          <p
            className={` text-xs md:text-[11px] uppercase font-semibold
              text-muted-foreground category-${item?.commerceDescription?.brandName}`}
          >
            {item?.commerceDescription?.brandName}
          </p>
          <h3 className="mt-1 text-black line-clamp-2 font-serif  text-xs md:text-[12px]">
            {item.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2 text-xs md:text-sm">
            <span className=" font-bold text-black">
              {Number(price) > 0
                ? `${calculatePrice(price).toLocaleString()}₮`
                : ""}
            </span>
            {originalPrice && (
              <span className=" text-muted-foreground line-through">
                {calculatePrice(originalPrice).toLocaleString()} ₮
              </span>
            )}
          </div>
        </div>
      </NavLink>
    </div>
  );
};

export default MarketplaceItemItemCard;
