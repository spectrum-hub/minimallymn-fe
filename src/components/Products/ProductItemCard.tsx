import { FC } from "react";
import { ProductItem } from "../../types/Products";
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
  const discountPrice = Number(item.discount?.originalPrice || 0);
  const price = Number(item.price?.price);
  const differnce = discountPrice - price;
  const {
    addWishlist,
    loading: addLoading,
    // error: addError,
  } = useAddWishlist(Number(item.productId), item.productName);

  const location = useLocation();

  const {
    removeWishlist,
    loading: removeLoading,
    // error: addError,
  } = useRemoveWishlist(Number(item.productId), item.productName);

  const discount =
    discountPrice > price ? (differnce * 100) / discountPrice : 0;

  const isNew = false; // Consider making this dynamic based on product data
  const brand = item.brand?.name; // Use brand from GraphQL
  const originalPrice = discountPrice > 0 ? item.discount?.originalPrice : undefined;

  const handleAddToWishlist = async () => {
    await addWishlist();
  };

  const handleRemoveFromWishlist = async () => {
    try {
      const w = await removeWishlist();
      if (w) {
        action?.("wishlist");
      }
    } catch (error_) {
      console.log(error_);
    }
  };

  return (
    <div
      className={`${isMobile ? "" : "group"} relative bg-white w-full shadow-sm hover:shadow-xl 
          transition-all duration-300 ease-in-out transform hover:-translate-y-1 rounded-xl border border-gray-100 hover:border-gray-200 overflow-hidden`}
    >
      <ProductLink
        item={item}
        className="relative rounded-xl flex flex-col h-full w-full"
        returnTo={`${location.pathname}/${location.search}`}
      >
        {/* Badge Container */}
        {(discount > 0 || isNew) && (
          <div className="absolute left-3 top-3 z-10 space-y-2">
            {discount > 0 && (
              <Badge variant="outline" className="font-semibold shadow-md bg-red-500 text-white border-red-500 px-2 py-1 text-xs rounded-lg">
                -{discount.toFixed(0)}%
              </Badge>
            )}
            {isNew && (
              <Badge className="bg-emerald-500 text-white shadow-md px-2 py-1 text-xs rounded-lg">
                Шинэ
              </Badge>
            )}
          </div>
        )}

        {brand && <Badge className={`${style.badge} bg-blue-500 text-white`}>{brand}</Badge>}

        {/* Image Container with improved styling */}
        <div className="relative rounded-t-xl bg-gradient-to-br from-gray-50 to-white overflow-hidden aspect-square">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img
            src={`${baseURL}${
              item?.variantImageUrl?.main || item?.mainImageUrl?.main
            }`}
            alt={item?.productName ?? ""}
            className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Content Container with better spacing */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          {/* <RenderItemName item={item} /> */}
          <h3>{item?.productName}</h3>
          
          {/* Price Section with improved styling */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg text-gray-900">
                {Number(price) > 0 ? `${price.toLocaleString()}₮` : ""}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {originalPrice.toLocaleString()}₮
                </span>
              )}
            </div>
          </div>
        </div>
      </ProductLink>

      {/* Wishlist/Remove Button with improved positioning */}
      {!isMobile && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {listType === "products" ? (
            <IconButton
              onClick={handleAddToWishlist}
              icon="heart"
              className="text-red-600 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 rounded-full w-10 h-10"
              loading={addLoading}
            />
          ) : (
            <IconButton
              onClick={handleRemoveFromWishlist}
              icon="delete"
              className="text-red-600 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 rounded-full w-10 h-10"
              loading={removeLoading}
            />
          )}
        </div>
      )}

      {/* Mobile action button */}
      {isMobile && (
        <div className="absolute bottom-4 right-4">
          {listType === "products" ? (
            <IconButton
              onClick={handleAddToWishlist}
              icon="heart"
              className="text-red-600 bg-white shadow-md rounded-full w-8 h-8 text-sm"
              loading={addLoading}
            />
          ) : (
            <IconButton
              onClick={handleRemoveFromWishlist}
              icon="delete"
              className="text-red-600 bg-white shadow-md rounded-full w-8 h-8 text-sm"
              loading={removeLoading}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProductItemCard;

const RenderItemName: FC<{ item: ProductItem }> = ({ item }) => {
  const name = item?.productName || "";
  const attributes = item?.attributes ? JSON.parse(item.attributes) : null;

  return (
    <h3 className="mt-0 text-gray-900 line-clamp-2 font-medium text-sm leading-tight">
      {attributes ? (
        <>
          {name} - <span className="font-semibold text-gray-700">{attributes}</span>
        </>
      ) : (
        name
      )}
    </h3>
  );
};
