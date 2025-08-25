// Carousel.tsx
import { FC } from "react";
import {
  Navigation,
  Pagination,
  Grid,
  Scrollbar,
  Autoplay,
} from "swiper/modules";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";

import { BLOCK_PRODUCTS_DEFAULT_TOTAL } from "../../Constants";
import { GET_PRODUCTS } from "../../api";
import { ProductsQuery } from "../../types/Products";
import useGqlQuery from "../../Hooks/Query";
import ProductItemCard from "./ProductItemCard";
import { Block } from "../../types/Blocks";
import { Spin } from "antd";
import useWindowWidth from "../../Hooks/use-window-width";

interface BlockProductsProps {
  block?: Block;
}

const Carousel: FC<BlockProductsProps> = ({ block }) => {
  const catId =
    block?.data_product_category_id !== "all" &&
    Number(block?.data_product_category_id) > 0
      ? Number(block?.data_product_category_id)
      : null;

  const { loading, error, data } = useGqlQuery<ProductsQuery>(GET_PRODUCTS, {
    page: 1,
    pageSize:
      Number(block?.data_number_of_elements) || BLOCK_PRODUCTS_DEFAULT_TOTAL,
    categoryId: catId ?? undefined,
  });

  const items = data?.products?.items;
  const publicCategories = data?.products?.publicCategories;

  const renderCategoryTitle = () => {
    if (block?.data_product_category_id) {
      const category = publicCategories?.find(
        (c) => Number(c.id) === Number(block?.data_product_category_id)
      );
      if (category?.name) {
        return (
          <h2 className="font-bold md:my-8 my-4 text-md md:text-2xl text-gray-700">
            {category?.name}
          </h2>
        );
      }
    }
  };
  const { isMobile } = useWindowWidth();

  if (loading) return <Spin />;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <section className={`${block?.data_name}  mx-auto my-4 `}>
      {/* <p>{block?.data_name}</p> */}
      {renderCategoryTitle()}
      <SwiperComponent
        // install Swiper modules
        modules={[Navigation, Pagination, Scrollbar, Autoplay, Grid]}
        spaceBetween={10}
        // slidesPerView={numberSlide}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        scrollbar={false}
        grid={{
          fill: "row",
          rows: 2,
        }}
        className="  "
        speed={500}
        breakpoints={{
          400: {
            slidesPerView: 2,
            spaceBetween: 10,
            grid: {
              fill: "row",
              rows: 2,
            },
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 10,
            grid: {
              fill: "row",
              rows: 2,
            },
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 10,
            grid: {
              fill: "row",
              rows: 2,
            },
          },
        }}
      >
        {items?.map((item) => (
          <SwiperSlide key={item.id}>
            <ProductItemCard
              item={item}
              key={item.id}
              type={"slider"}
              isMobile={isMobile}
            />
          </SwiperSlide>
        ))}
      </SwiperComponent>
    </section>
  );
};

export default Carousel;
