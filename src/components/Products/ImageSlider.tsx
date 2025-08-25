import { FC, Suspense, useState, useMemo } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import { Image } from "antd";
import {
  baseURL,
  imageBaseUrl,
  productAdditionalImage,
} from "../../lib/configs";
import { ProductItem } from "../../types/Products";
import { PropSelectedProduct } from "../../Hooks/useProducts";
import { isVariantActive } from "./helpers";
import {
  A11y,
  Navigation,
  Scrollbar,
  Thumbs,
  Pagination,
} from "swiper/modules";

interface Props {
  item?: ProductItem;
  type?: "detail" | "list" | "slider";
  selectedProduct?: PropSelectedProduct;
}

const ImageSlider: FC<Props> = ({ item, type = "list", selectedProduct }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const s = selectedProduct?.selectedCombination;

  // selectedProductImages-ийг тусад нь тодорхой тооцоолно
  const selectedProductImages = useMemo(() => {
    if (type !== "detail" || !selectedProduct) return [];
    const productId = Number(selectedProduct.productId);
    const baseImage = imageBaseUrl(productId, "image_1920");
    const templateImages =
      s?.productTemplateImageIds?.map((id) =>
        productAdditionalImage(Number(id), "image_1920")
      ) ?? [];
    const variantImages =
      s?.productVariantImageIds?.map((id) =>
        productAdditionalImage(Number(id), "image_1920")
      ) ?? [];
    return [baseImage, ...templateImages, ...variantImages].filter(Boolean);
  }, [
    selectedProduct,
    s?.productTemplateImageIds,
    s?.productVariantImageIds,
    type,
  ]);

  const defaultAndAllImages = useMemo(() => {
    const templateImages =
      item?.productTemplateImageIds?.map((id) =>
        productAdditionalImage(
          Number(id),
          type === "list" ? "image_512" : "image_1920"
        )
      ) ?? [];
    const itemImages =
      item?.images?.map((img) => `${baseURL}/${img.url}`) ?? [];
    const variantImages =
      item?.productVariants?.combinationIndicesValues?.flatMap((product) =>
        product?.productVariantImageIds?.map((v_item) =>
          productAdditionalImage(
            Number(v_item),
            type === "list" ? "image_512" : "image_1920"
          )
        )
      ) ?? [];
    return [...templateImages, ...itemImages, ...variantImages].filter(Boolean);
  }, [item, type]);

  const imagesArray = useMemo(() => {
    const isActiveVariant =
      selectedProduct && isVariantActive(selectedProduct) && type === "detail";
    return isActiveVariant && selectedProductImages.length > 0
      ? selectedProductImages
      : defaultAndAllImages;
  }, [selectedProduct, selectedProductImages, defaultAndAllImages, type]);

  if (type === "slider") {
    return (
      <div
        className="w-full h-full text-center pt-1 shadow-sm rounded-md      
                  flex items-center justify-center      "
      >
        <Image
          src={imagesArray?.[0]}
          alt={item?.name ?? ""}
          className="
            mx-auto w-full object-contain max-h-[200px]
            center-image p-1 h-full
          "
          loading="lazy"
          preview={false}
        />
      </div>
    );
  }

  return (
    <Suspense fallback={<></>}>
      <SwiperComponent
        modules={[Navigation, Pagination, Scrollbar, A11y, Thumbs]}
        spaceBetween={1}
        slidesPerView={1}
        navigation
        pagination={{ clickable: type === "list" }}
        scrollbar={type === "list"}
        className="h-full max-h-[480px] bg-white rounded-md"
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        nested={type === "list"}
      >
        {imagesArray.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image}
              alt={item?.name ?? ""}
              className="mx-auto w-full object-contain p-8 rounded-md"
              height="100%"
              loading="lazy"
              preview={type === "detail"}
            />
          </SwiperSlide>
        ))}
      </SwiperComponent>

      {type === "detail" && imagesArray.length > 1 && (
        <SwiperComponent
          modules={[Thumbs]}
          watchSlidesProgress
          onSwiper={(swiper) => setThumbsSwiper(swiper)}
          spaceBetween={0}
          slidesPerView={8}
          className="my-4"
        >
          {imagesArray.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={item?.name ?? ""}
                className="
                h-[54px] w-[48px] 
                md:h-[70px] md:w-[64px] 
                object-cover transition-transform 
                duration-300 group-hover:scale-105 bg-white 
                rounded-md ml-2 cursor-pointer p-0.5
                "
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </SwiperComponent>
      )}
    </Suspense>
  );
};

export default ImageSlider;
