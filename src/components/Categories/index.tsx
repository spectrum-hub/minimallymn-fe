import React, { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual, Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import useWindowWidth from "../../Hooks/use-window-width";
import { RootState } from "../../Redux/store";

const RenderCategories: React.FC = () => {
  const { windowWidth } = useWindowWidth();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category") ?? "";

  const { loading, error, data } = useSelector(
    (state: RootState) => state.category
  );

  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const getSlidesPerView = () => {
      if (windowWidth > 1200) return 10;
      if (windowWidth > 1000) return 9;
      if (windowWidth > 900) return 7;
      if (windowWidth > 800) return 7;
      if (windowWidth > 600) return 5;
      return 3;
    };
    setSlidesPerView(getSlidesPerView());
  }, [windowWidth]);

  if (loading) {
    return (
      <div className="h-12 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {JSON.stringify(error)}</p>;
  }

  return (
    <div className="w-full">
      <h2 className="text-lg py-4 uppercase">Ангилалууд</h2>

      <div className="bg-white rounded-lg shadow-sm p-4 categories-container">
        <Swiper
          modules={[Virtual, Navigation]}
          navigation
          slidesPerView={slidesPerView}
          className=""
        >
          {data?.categories?.categories?.map(({ id, name }, index) => (
            <SwiperSlide key={id || index}>
              <NavLink
                to={{ search: `category=${id}` }}
                className={`
                  border rounded-lg h-10 px-2 py-1 w-28 text-center
                hover:bg-gray-300 ${
                  Number(categoryId) === id ? "bg-gray-300 text-black" : ""
                }
                `}
              >
                {/* <img
                  src={categoryImageUrl(id)}
                  alt={name}
                  className="object-cover h-12 md:h-20 rounded-xl max-w-20 bg-gray-400"
                  loading="lazy"
                /> */}
                <span
                  className={`
                    text-xs text-gray-900
                    text-center leading-8
                  `}
                >
                  {name}
                </span>
              </NavLink>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RenderCategories;
