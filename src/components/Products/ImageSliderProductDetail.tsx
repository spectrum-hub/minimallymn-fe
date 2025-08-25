import { FC, Suspense, useMemo, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import { Image } from "antd";
import { imageBaseUrl, productAdditionalImage } from "../../lib/configs";

import {
  A11y,
  Navigation,
  Scrollbar,
  Thumbs,
  Pagination,
} from "swiper/modules";
import { NProductDetail } from "../../types/ProductDetail";

interface Props {
  item?: NProductDetail;
  selectedProductId?: number;
}

const ImageSlider: FC<Props> = ({ item, selectedProductId }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const imagesArray = useMemo(() => {
    // Хэрэв selectedProductId байхгүй бол бүх зургуудыг буцаана
    if (!selectedProductId) {
      return item?.productImages ?? [];
    }

    // productImages байхгүй бол хоосон массив буцаана
    const productImages = item?.productImages ?? [];

    // Сонгогдсон variant-тай таарсан зургуудыг эхэнд тавина
    const primaryImages = productImages.filter(
      (image) => Number(image.productVariantId) === Number(selectedProductId)
    );
    const otherImages = productImages.filter(
      (image) => Number(image.productVariantId) !== Number(selectedProductId)
    );

    const firstImage = [
      selectedProductId
        ? {
            selectedProductId: selectedProductId,
            id: Number(selectedProductId),
            name: item?.name,
            alt: item?.name ?? "",
            img_type: "first_image",
          }
        : {},
    ];

    return [...firstImage, ...primaryImages, ...otherImages];
  }, [item, selectedProductId]);

  return (
    <Suspense fallback={<></>}>
      <SwiperComponent
        modules={[Navigation, Pagination, Scrollbar, A11y, Thumbs]}
        spaceBetween={1}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={false}
        className="h-full max-h-[480px] bg-white rounded-md"
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        nested={true}
      >
        {(imagesArray ?? [])?.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={
                image.img_type === "first_image"
                  ? imageBaseUrl(selectedProductId, "image_1920")
                  : productAdditionalImage(image?.id, "image_1920") ?? ""
              }
              alt={item?.name ?? ""}
              className="mx-auto w-full object-contain p-8 rounded-md"
              height="100%"
              loading="lazy"
              preview={true}
            />
          </SwiperSlide>
        ))}
      </SwiperComponent>

      {(imagesArray ?? [])?.length > 1 && (
        <SwiperComponent
          modules={[Thumbs]}
          watchSlidesProgress
          onSwiper={(swiper) => setThumbsSwiper(swiper)}
          spaceBetween={0}
          slidesPerView={8}
          className="my-4"
        >
          {(imagesArray ?? []).map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={
                  image.img_type === "first_image"
                    ? imageBaseUrl(selectedProductId, "image_512")
                    : productAdditionalImage(image?.id, "image_512") ?? ""
                }
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
