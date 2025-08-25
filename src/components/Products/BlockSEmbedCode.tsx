import { FC } from "react";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { gql } from "@apollo/client";
import { Spin } from "antd";
import Iframe from "react-iframe";
import useGqlQuery from "../../Hooks/Query";
import { Block } from "../../types/Blocks";
import { websiteId } from "../../lib/configs";

// Define the GraphQL query
export const FacebookLiveListQuery = gql`
  query FacebookLiveList(
    $page: Int! = 1
    $pageSize: Int! = 200
    $orderBy: String = "name desc"
    $websiteId: Int
  ) {
    facebookLiveList(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      websiteId: $websiteId
    ) {
      pageInfo {
        totalCount
        pageCount
        currentPage
        pageSize
      }
      facebookLiveList {
        id
        name
        link
        description
        image
        active
      }
    }
  }
`;

// Type definitions for the GraphQL response
interface FacebookLiveItem {
  id: number;
  name: string;
  link: string;
  description: string | null;
  image: string | null;
  active: boolean;
}

interface PageInfo {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}

interface FacebookLiveListResponse {
  facebookLiveList: {
    pageInfo: PageInfo;
    facebookLiveList: FacebookLiveItem[];
  };
}

interface BlockProductsProps {
  block?: Block;
}

const BlockSEmbedCode: FC<BlockProductsProps> = ({ block }) => {
  const { loading, error, data } = useGqlQuery<FacebookLiveListResponse>(
    FacebookLiveListQuery,
    {
      page: 1,
      pageSize: 200,
      orderBy: "name desc",
      websiteId: Number(websiteId),
    }
  );

  const reelWidth = "100%";
  const reelHeight = "382px";

  // Handle error state
  if (error) {
    console.error("GraphQL Error:", error);
    return (
      <div className="max-w-7xl mx-auto my-4 text-red-500">
        Error loading Facebook Live data: {error.message}
      </div>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto my-4 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const facebookLiveList = data?.facebookLiveList?.facebookLiveList;

  return (
    <section
      className={`${
        block?.data_name ?? "facebook-live"
      } max-w-7xl mx-auto my-4`}
    >
      {(facebookLiveList?.length ?? 0) > 0 ? (
        <SwiperComponent
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={4}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            400: {
              slidesPerView: 2,
              spaceBetween: 4,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 4,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 4,
            },
          }}
          className="facebook-live-swiper"
        >
          {facebookLiveList?.map((item) => (
            <SwiperSlide key={item.id} className="">
              <Iframe
                id="frame_Id"
                src={`https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/${item.link}&autoplay=true&muted`}
                width={reelWidth}
                height={reelHeight}
                allow="autoplay"
                allowFullScreen
                url={`https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/${item.link}&autoplay=true&muted`}
                styles={{
                  borderRadius: 10,
                }}
              />
            </SwiperSlide>
          ))}
        </SwiperComponent>
      ) : (
        <div className="text-center text-gray-500"></div>
      )}
    </section>
  );
};

export default BlockSEmbedCode;
