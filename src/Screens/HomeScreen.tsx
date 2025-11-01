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
import BlockSEmbedCode from "../components/Products/BlockSEmbedCode";
import ReactPlayer from "react-player";
import useWindowWidth from "../Hooks/use-window-width";
import { GridRow } from "../types";

const RenderRow = ({
  row,
  isMobile,
}: {
  isMobile?: boolean;
  row?: GridRow;
}) => {


  if(row?.rowType === "banner"){
    return <>banner </>
  }

  return <></>
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
    <RenderRow row={row} key={index} />
  ));
};

export default HomeScreen;
