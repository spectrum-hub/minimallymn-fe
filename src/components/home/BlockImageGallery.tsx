import { FC } from "react";
import { Block } from "../../types/Blocks";
import { baseURL } from "../../lib/configs";
import {
  Navigation,
  Pagination,
  Thumbs,
  Scrollbar,
  A11y,
} from "swiper/modules";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";

interface Props {
  block: Block;
}

const BlockImageGallery: FC<Props> = ({ block }) => {
  const images = imageFinder(block);

  return (
    <section className={`${block.attributes.class} max-w-7xl mx-auto`}>
      <div
        className="absolute left-1 top-[50%] z-10
          bg-gray-400  
        "
      />
      <SwiperComponent
        // install Swiper modules
        modules={[Navigation, Pagination, Scrollbar, A11y, Thumbs]}
        spaceBetween={1}
        slidesPerView={1}
        navigation
        pagination
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log("slide change")}
        className=" h-full max-h-[600px] rounded-2xl shadow-xl"
      >
        {(images ?? []).map((image, index) => (
          <SwiperSlide key={index}>
            <img
              key={index}
              src={`${baseURL}${image?.attributes?.src}`}
              alt={image.attributes.alt || ""}
              className="h-full object-cover w-full"
            />
          </SwiperSlide>
        ))}
      </SwiperComponent>
    </section>
  );
};

export default BlockImageGallery;

const imageFinder = (block?: Block): Block[] => {
  const images: Block[] = [];

  if (block?.tag === "img") {
    images.push(block);
  }

  if (block?.children && block?.children.length > 0) {
    block.children.forEach((child) => {
      images.push(...imageFinder(child)); // Collect images from children recursively
    });
  }

  return images;
};
