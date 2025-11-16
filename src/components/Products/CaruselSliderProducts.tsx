import { FC } from "react";
import {
  Navigation,
  Pagination,
  Grid,
  Scrollbar,
  Autoplay,
} from "swiper/modules";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";

import ProductItemCard from "./ProductItemCard";
import { GridRow } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import RowTitle from "../RowTitle";

interface BlockProductsProps {
  row?: GridRow;
  isMobile?: boolean;
}

const SliderItems: FC<BlockProductsProps> = ({ row, isMobile }) => {
  const products = useSelector(
    (state: RootState) => state.products?.data?.items
  );

  return (row?.rowItems ?? [])?.map((row) => {
    console.log(row);
    const items = products?.filter?.((r) => r.category.id === row.itemId);

    return (
      <section className={`${row?.className}  mx-auto my-4 `} key={row.itemId}>
        <RowTitle title={row?.itemName} />
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
          {(items ?? [])?.map((item) => (
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
  });
};

export default SliderItems;
