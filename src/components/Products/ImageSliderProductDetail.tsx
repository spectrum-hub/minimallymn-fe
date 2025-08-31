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

type ImageType = "main" | "variant" | "additional";
interface VImage {
  id?: number;
  img_type: string;
}

interface Props {
  item?: NProductDetail;
  selectedProductId?: number;
}

const ImageSlider: FC<Props> = ({ item, selectedProductId }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const imagesArray: VImage[] = useMemo(() => {
    const mainImage = {
      id: item?.id,
      img_type: "main",
    };

    const mainAdditionalImage =
      item?.productImages?.flatMap((image) => ({
        id: image.id,
        img_type: "additional",
      })) ?? [];

    const variantImages =
      item?.parentProducts.flatMap((parent) => ({
        id: parent.id,
        img_type: "variant",
      })) ?? [];

    const variantAdditionalImages = selectedProductId
      ? item?.parentProducts
          .filter((parent) => parent.id === selectedProductId)
          .flatMap((parent) =>
            (parent.productVariantImageIds ?? []).map((img) => ({
              id: img.id,
              img_type: "additional",
            }))
          )
      : item?.parentProducts.flatMap((parent) =>
          (parent.productVariantImageIds ?? []).map((img) => ({
            id: img.id,
            img_type: "additional",
          }))
        ) ?? [];

    if (selectedProductId) {
      return [
        ...variantImages.filter((v) => v.id === selectedProductId),
        ...(variantAdditionalImages ?? []),
      ];
    }

    // Return the images in the desired order
    return [
      mainImage,
      ...mainAdditionalImage,
      ...variantImages,
      ...(variantAdditionalImages ?? []),
    ];
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
        autoHeight={true} // ⬅️ нэмэв
        className="bg-white rounded-md" // ⬅️ h-full, max-h-ыг авлаа
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        nested
      >
        {(imagesArray ?? []).map((image, index) => (
          <SwiperSlide key={index} className="flex items-center justify-center">
            <div
              className="max-h-[480px] overflow-auto flex items-center justify-center
            h-96
            "
            >
              <Image
                src={
                  ["main", "variant"].includes(image.img_type)
                    ? imageBaseUrl(image?.id, "image_1920")
                    : productAdditionalImage(image?.id, "image_1920") ?? ""
                }
                alt={item?.name ?? ""}
                className="mx-auto w-full h-auto object-contain p-8 rounded-md" // ⬅️ h-auto
                // height="100%"  ⬅️ авч хаясан
                loading="lazy"
                preview
              />
            </div>
          </SwiperSlide>
        ))}
      </SwiperComponent>

      {(imagesArray ?? [])?.length > 1 && (
        <SwiperComponent
          modules={[Thumbs]}
          watchSlidesProgress
          onSwiper={(swiper) => setThumbsSwiper(swiper)}
          spaceBetween={4}
          slidesPerView={8}
          className="my-4"
        >
          {(imagesArray ?? []).map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={
                  ["main", "variant"].includes(image.img_type as ImageType)
                    ? imageBaseUrl(image?.id, "image_512")
                    : productAdditionalImage(image?.id, "image_512") ?? ""
                }
                alt={item?.name ?? ""}
                className="
                h-[54px] w-[48px] 
                md:h-[70px] md:w-[64px] 
                object-cover transition-transform 
                duration-300 group-hover:scale-105 bg-white 
                ml-1 cursor-pointer p-0.5
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
