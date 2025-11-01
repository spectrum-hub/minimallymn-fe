import { FC } from "react";
import { baseURL } from "../../lib/configs";
import {
  Navigation,
  Pagination,
  Thumbs,
  Scrollbar,
  A11y,
} from "swiper/modules";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import { RowItem } from "../../types";

interface Props {
  rowItems?: RowItem[];
}

const BlockImageGallery: FC<Props> = ({ rowItems }) => {
 

  return (
    <section className={` mx-auto `}>
      <div
        className="absolute left-1 top-[50%] z-10
          bg-gray-400  
        "
      />
      <SwiperComponent
        modules={[Navigation, Pagination, Scrollbar, A11y, Thumbs]}
        spaceBetween={1}
        slidesPerView={1}
        navigation
        pagination
        className=" h-full max-h-[600px] shadow"
      >
        {(rowItems ?? []).map((image, index) => (
          <SwiperSlide key={index}>
            <img
              key={index}
              src={`${baseURL}${image?.itemImage?.large}`}
              alt={image?.itemTitle || ""}
              className="h-full object-cover w-full rounded-md "
            />
          </SwiperSlide>
        ))}
      </SwiperComponent>
    </section>
  );
};

export default BlockImageGallery;
 