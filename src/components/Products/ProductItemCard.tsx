"use client";

import React, { FC, useEffect, useState } from "react";
import { ProductAttribute, ProductItem } from "../../types/Products";
import { ProductLink } from "../Links";
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

const ImageSwitcher: FC<{ item: ProductItem }> = ({ item }) => {
  const mainImage =
    item?.variantImageUrl?.main || item?.mainImageUrl?.main || "";
  const additionalImages = item?.templateAdditionalImages ?? [];
  const allImages = [mainImage, ...additionalImages.map((img) => img.main)];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hovering && allImages.length > 1) {
      timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      }, 500); // 2 second delay
    } else if (!hovering) {
      setCurrentIndex(0); // hover дууссан бол үндсэн зураг руу буцах
    }
    return () => clearTimeout(timer);
  }, [hovering, currentIndex, allImages.length]);

  return (
    <div
      className="relative rounded-t-xl bg-gradient-to-br from-gray-50 to-white overflow-hidden aspect-square"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <img
        src={`${baseURL}${allImages[currentIndex]}`}
        alt={item?.productName ?? ""}
        className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>
  );
};

const capitalizeFirst = (s: string) =>
  s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const formatAttrValue = (value: ProductAttribute["value"]) => {
  if (value === null || value === undefined) return "";
  const str = String(value).trim();
  return str ? capitalizeFirst(str) : "";
};

const DEFAULT_TAG_VISIBLE = 3;

const BrandBadge: FC<{ brand?: ProductItem["brand"] }> = ({ brand }) => {
  if (!brand) return null;
  const name = brand.name ?? "";
  const logo = brand.logo ?? "";
  const initials =
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "BR";

  return (
    <div
      className="absolute left-3 top-3 z-20 flex items-center gap-2 px-2 py-0 rounded-lg shadow-sm border border-gray-100 bg-white"
      style={{ backdropFilter: "saturate(120%) blur(4px)" }}
    >
      {logo ? (
        <img
          src={`data:image/png;base64,${brand.logo}`}
          alt={name}
          className="w-11 h-8 object-contain"
          loading="lazy"
        />
      ) : (
        <div className="w-6 h-6 bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-700">
          {initials}
        </div>
      )}
    </div>
  );
};

const TagsBadge: FC<{ tags?: ProductItem["tags"]; maxVisible?: number }> = ({
  tags,
  maxVisible = DEFAULT_TAG_VISIBLE,
}) => {
  if (!Array.isArray(tags) || tags.length === 0) return null;

  const visible = tags.slice(0, maxVisible);
  const extra = tags.length - visible.length;

  return (
    <div className="absolute top-3 right-3 flex flex-wrap gap-1 items-center z-20">
      {visible.map((t, idx) => {
        const key = t.tag_id ?? t.name ?? idx;
        const name = t.name ?? "";
        const color = t.color ?? "";
        const pillStyle = color
          ? {
              backgroundColor: color,
              color: chromaReadableTextColor(color),
              border: `1px solid ${color}`,
            }
          : {};
        return (
          <span
            key={key}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium shadow-sm"
            style={pillStyle}
            title={name}
          >
            <span className="truncate max-w-[5rem]">{name}</span>
          </span>
        );
      })}
      {extra > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 shadow-sm">
          +{extra}
        </span>
      )}
    </div>
  );
};

function chromaReadableTextColor(bg: string) {
  try {
    if (bg.startsWith("#")) {
      const hex = bg.replace("#", "");
      const bigint = Number.parseInt(
        hex.length === 3
          ? hex
              .split("")
              .map((c) => c + c)
              .join("")
          : hex,
        16
      );
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      const l = 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
      return l > 0.5 ? "#111827" : "#ffffff";
    }
    return "#111827";
  } catch (error_) {
    console.warn("Failed to parse color for text readability:", bg, error_);
    return "#111827";
  }
}
function srgb(c: number) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

const RenderItemName: FC<{ item: ProductItem }> = ({ item }) => {
  const name = item?.productName ?? "";
  const attributes = Array.isArray(item?.attributes) ? item.attributes : [];
  const firstThree = attributes.slice(0, 3);

  return (
    <div className="mt-0 text-gray-900 leading-tight">
      {attributes.length > 0 ? (
        <>
          <h5 className="text-xs line-clamp-2 my-1 block leading-[16px]">
            {name}
          </h5>
          <div className="text-gray-700 min-h-8">
            {firstThree.map((attr, index) => {
              const key = attr.value_id ?? attr.attribute_id ?? index;
              const label = attr.attribute ?? "";
              const val = formatAttrValue(attr.value);
              return (
                <div key={key} className="text-xs">
                  <span className="text-gray-600">{label}:</span>{" "}
                  <span className="text-black">
                    {val || <span className="text-gray-400">—</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <h5 className="text-sm line-clamp-2 my-1">{name}</h5>
      )}
    </div>
  );
};

const ProductItemCard: FC<ProductItemProps> = ({
  item,
  listType = "products",
  action,
  isMobile,
}) => {
  const discountPrice = Number(item.discount?.originalPrice || 0);
  const price = Number(item.price?.price || 0);
  const differnce = discountPrice - price;
  const { addWishlist, loading: addLoading } = useAddWishlist(
    Number(item.productId),
    item.productName
  );
  const { removeWishlist, loading: removeLoading } = useRemoveWishlist(
    Number(item.productId),
    item.productName
  );
  const location = useLocation();
  const discount =
    discountPrice > price && discountPrice > 0
      ? (differnce * 100) / discountPrice
      : 0;
  const brand = item.brand;

  const handleAddToWishlist = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    await addWishlist();
  };

  const handleRemoveFromWishlist = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    try {
      const w = await removeWishlist();
      if (w) action?.("wishlist");
    } catch (error_) {
      console.log(error_);
    }
  };

  return (
    <div
      className={`relative bg-white w-full shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 rounded-xl border border-gray-100 hover:border-gray-200 overflow-hidden group`}
    >
      {/* Brand */}
      {brand && <BrandBadge brand={brand} />}

      {/* Tags */}
      <TagsBadge tags={item?.tags} />

      {/* Wishlist / Remove */}
      {!isMobile && (
        <div className="absolute top-12 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
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

      <ProductLink
        item={item}
        className="relative rounded-xl flex flex-col h-full w-full"
        returnTo={`${location.pathname}${
          location.search ? `/${location.search}` : ""
        }`}
      >
        {/* Image */}
        <div className="relative rounded-t-xl bg-gradient-to-br from-gray-50 to-white overflow-hidden aspect-square">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <ImageSwitcher item={item} />
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <RenderItemName item={item} />

          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-sm text-gray-900">
                {price > 0 ? `${item?.price?.formatted ?? ""}` : ""}
              </span>
              {Number(item?.discount?.originalPrice) > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  {item?.discount?.originalPriceFormatted}
                </span>
              )}
            </div>
            {discount > 0 && (
              <Badge
                variant="outline"
                className="font-semibold shadow-md bg-red-500 text-white border-red-500 px-2 py-1 text-xs rounded-lg"
              >
                -{discount.toFixed(0)}%
              </Badge>
            )}
          </div>
        </div>
      </ProductLink>

      {/* Mobile wishlist */}
      {isMobile && (
        <div className="absolute bottom-4 right-4 z-20">
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

// Доторхи Image component-д:

export default ProductItemCard;
