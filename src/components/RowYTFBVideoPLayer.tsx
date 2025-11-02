import { FC } from "react";
import { GridRow } from "../types";
import {
  Navigation,
  Pagination,
  Grid,
  Scrollbar,
  Autoplay,
} from "swiper/modules";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";

interface Props {
  row?: GridRow;
  isMobile?: boolean;
}

const RowYTFBVideoPLayer: FC<Props> = ({ row, isMobile }) => {
  // Check if this is a video row
  if (row?.rowType !== "video") {
    return null;
  }

  // Extract video items from row data
  const videoItems = row?.rowItems || [];

  if (videoItems.length === 0) {
    return null;
  }

  // Multiple videos - show in swiper
  return (
    <section className={`mx-auto my-4  --${isMobile}`} >
      {/* Section Title */}
      {row?.sectionTitle && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {row.sectionTitle}
          </h2>
          {row?.sectionSubtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              {row.sectionSubtitle}
            </p>
          )}
          {row?.sectionDescription && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {row.sectionDescription}
            </p>
          )}
        </div>
      )}

      <SwiperComponent
        modules={[Navigation, Pagination, Scrollbar, Autoplay, Grid]}
        spaceBetween={0}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        speed={1000}
        scrollbar={false}
        className="video-swiper mx-auto w-full"
      >
        {videoItems.map((videoItem, index) => {
          const videoType = videoItem?.itemType;
          const videoId = videoItem?.itemLink;
          if (!videoId) {
            return;
          }
          return (
            <SwiperSlide key={videoItem.itemId || index} className="w-full  ">
              <div
                className=" 
                  aspect-video mx-auto
                rounded-xl overflow-hidden shadow-lg bg-black w-full"
              >
                {videoType === "facebook" ? (
                  <iframe
                    src={videoItem?.itemLink ?? ""}
                    width="100%"
                    height="100%"
                    title={`Facebook Video ${index + 1}`}
                    style={{
                      border: "none",
                      overflow: "hidden",
                    }}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen={true}
                  />
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?controls=1`}
                    width="100%"
                    height="100%"
                    title={`YouTube Video ${index + 1}`}
                    style={{
                      border: "none",
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen={true}
                  />
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </SwiperComponent>
    </section>
  );
};

export default RowYTFBVideoPLayer;
