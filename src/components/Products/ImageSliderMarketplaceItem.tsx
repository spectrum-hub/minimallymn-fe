import { FC, Suspense, useMemo, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import { Image } from "antd";

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
}

const ImageSliderMarketplaceItem: FC<Props> = ({ item }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const imagesArray = useMemo(() => {
    return item?.productPlatformImages;
  }, [item]);

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
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {(imagesArray ?? [])?.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image.url}
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
                src={image.smallUrl}
                alt={item?.name ?? ""}
                className={`
                  h-[54px] w-[48px] 
                  md:h-[70px] md:w-[64px] 
                  object-cover transition-transform 
                  duration-300 group-hover:scale-105 bg-white 
                  rounded-md ml-2 cursor-pointer p-0.5
                  ${activeIndex === index ? "border-2 border-black" : ""}
                  `}
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </SwiperComponent>
      )}
    </Suspense>
  );
};

export default ImageSliderMarketplaceItem;
