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

  if (
    data?.categories?.categories &&
    data?.categories?.categories?.length < 7
  ) {
    return (
      <div className="w-full">
        <h2 className="text-lg py-4 ">Ангилалууд</h2>

        <div
          className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-3 justify-center"
        >
          {data?.categories?.categories?.map(({ id, name }, index) => (
            <NavLink
              key={id || index}
              to={{ search: `category=${id}` }}
              className={`
                border border-gray-200 rounded-xl h-9 px-4 w-36 text-center my-1 max-w-36 mx-1 line-clamp-1
                transition-all duration-200 ease-in-out transform hover:scale-105 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md
                ${Number(categoryId) === id ? "bg-blue-100 shadow-lg scale-105" : "bg-white text-gray-900"}
              `}
            >
              <span
                className="text-sm text-inherit text-center leading-9 line-clamp-1 "
              >
                {name}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-lg py-4 uppercase">Ангилалууд</h2>

      <div className="bg-white rounded-xl shadow-md p-4">
        <Swiper
          modules={[Virtual, Navigation]}
          navigation
          slidesPerView={slidesPerView}
          className="categories-swiper"
          grid={{
            rows: 2,
            fill: "row",
          }}
        >
          {data?.categories?.categories?.map(({ id, name }, index) => (
            <SwiperSlide key={id || index}>
              <NavLink
                to={{ search: `category=${id}` }}
                className={`
                  border border-gray-200 rounded-xl h-9 px-4 w-36 text-center my-1 mx-1 line-clamp-1
                  transition-all duration-200 ease-in-out transform hover:scale-105 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md
                  ${Number(categoryId) === id ? "bg-blue-100 border-blue-500 text-blue-700 shadow-lg scale-105" : "bg-white text-gray-900"}
                `}
              >
                <span
                  className="text-sm text-inherit text-center leading-9 line-clamp-1 font-medium"
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
