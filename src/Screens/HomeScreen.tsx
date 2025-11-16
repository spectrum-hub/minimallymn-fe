import { Spin } from "antd";
import { useSelector } from "react-redux";
import BlockImageGallery from "../components/home/BlockImageGallery";
import { RootState } from "../Redux/store";
import useWindowWidth from "../Hooks/use-window-width";
import { GridRow } from "../types";
import CaruselSliderProducts from "../components/Products/CaruselSliderProducts";
import RowYTFBVideoPLayer from "../components/RowYTFBVideoPLayer";
import RowTextDescription from "../components/RowTextDescription";
import RowBrands from "../components/RowBrands";

const RenderRow = ({
  row,
  isMobile,
}: {
  isMobile?: boolean;
  row?: GridRow;
}) => {
  const rowType = row?.rowType ?? "";

  switch (rowType) {
    case "banner":
      return <BlockImageGallery row={row} />;

    case "category":
      // category-д нэмэлт нөхцөл шалгах хэрэгтэй тул энд шалгана
      if (row?.itemViewType === "item_products") {
        return <CaruselSliderProducts row={row} isMobile={isMobile} />;
      }
      return <></>;

    case "video":
      return <RowYTFBVideoPLayer row={row} isMobile={isMobile} />;

    case "text_description":
      return <RowTextDescription row={row} isMobile={isMobile} />;

    case "brand":
      return <RowBrands row={row} isMobile={isMobile} />;

    default:
      return <></>;
  }
};

const HomeScreen = () => {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.layouts
  );

  const isMobile = useWindowWidth().isMobile;

  if (error) return <div>{error?.toString()}</div>;

  if (loading) {
    return <Spin fullscreen />;
  }

  return (data?.themeGrid?.rows ?? [])?.map((row, index) => (
    <RenderRow row={row} key={index} isMobile={isMobile} />
  ));
};

export default HomeScreen;
