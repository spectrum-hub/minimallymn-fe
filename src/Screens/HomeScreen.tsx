/* eslint-disable @typescript-eslint/no-explicit-any */

import { Spin } from "antd";
import { Fragment } from "react";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";

/**
 *
 *
 *
 * Components
 *
 *
 */

import BlockSliderProducts from "../components/Products/BlockSliderProducts";
import BlockImageGallery from "../components/home/BlockImageGallery";
import { Block, FooterBlock } from "../types/Blocks";
import { RootState } from "../Redux/store";
import { baseURL } from "../lib/configs";
import useWindowWidth from "../Hooks/use-window-width";
import { GridRow } from "../types";
import CaruselSliderProducts from "../components/Products/CaruselSliderProducts";
import RowYTFBVideoPLayer from "../components/RowYTFBVideoPLayer";

const RenderRow = ({
  row,
  isMobile,
}: {
  isMobile?: boolean;
  row?: GridRow;
}) => {
  const rowType = row?.rowType ?? "";
  if (rowType === "banner") {
    return <BlockImageGallery row={row} />;
  } else if (rowType === "category") {
    if (row?.itemViewType === "item_products") {
      console.log("rowrowrow", row);
      return <CaruselSliderProducts row={row} isMobile={isMobile} />;
    }
  } else if (rowType === "video") {
    return <RowYTFBVideoPLayer row={row} isMobile={isMobile} />;
  }

  return <></>;
};

const HomeScreen = () => {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.layouts
  );

  console.log("data?.themeGriddata?.themeGrid", data?.themeGrid);

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
