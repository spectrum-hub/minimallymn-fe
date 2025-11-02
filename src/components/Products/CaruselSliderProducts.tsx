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
import { Spin } from "antd";
import { GridRow } from "../../types";

interface BlockProductsProps {
  row?: GridRow;
  isMobile?: boolean;
}

const CaruselSliderProducts: FC<BlockProductsProps> = ({ row, isMobile }) => {
  const cidIds =
    row?.itemViewType === "item_products"
      ? (row?.rowItems ?? [])
          .flatMap((item) => item.itemId)
          .filter((id): id is number => typeof id === "number")
      : [];
  const { loading, error, data } = useGqlQuery<ProductsQuery>(
    GET_PRODUCTS,
    {
      page: 1,
      pageSize: BLOCK_PRODUCTS_DEFAULT_TOTAL,
      orderBy: "create_date desc",
      ...(cidIds.length > 0 && { cids: cidIds }), // Use cidIds array
    },
    {
      context: {
        api: "minimally",
      },
      // Only run query when itemViewType is "item_products" and cidIds exist
      skip: row?.itemViewType !== "item_products" || cidIds.length === 0,
    }
  );

  const items = data?.products?.items;

  const renderCategoryTitle = () => {
    if (row?.sectionTitle) {
      return (
        <h2 className="font-bold md:my-8 my-4 text-md md:text-2xl text-gray-700">
          {row?.sectionTitle}
        </h2>
      );
    }
  };

  if (loading) return <Spin />;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <section className={`${row?.sectionTitle}  mx-auto my-4 `}>
      {/* <p>{block?.data_name}</p> */}
      {renderCategoryTitle()}
      <SwiperComponent
        // install Swiper modules
        modules={[Navigation, Pagination, Scrollbar, Autoplay, Grid]}
        spaceBetween={10}
        // slidesPerView={numberSlide}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        speed={1000}
        scrollbar={false}
        grid={{
          fill: "row",
          rows: 2,
        }}
        className="  "
        // speed={4000}
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
          <SwiperSlide key={item.productId}>
            <ProductItemCard
              item={item}
              key={item.productId}
              isMobile={isMobile}
            />
          </SwiperSlide>
        ))}
      </SwiperComponent>
    </section>
  );
};

export default CaruselSliderProducts;
