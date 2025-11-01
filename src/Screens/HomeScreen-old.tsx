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
import { Block, FooterBlock } from "../types/Blocks";
import { RootState } from "../Redux/store";
import { baseURL } from "../lib/configs";
import BlockSEmbedCode from "../components/Products/BlockSEmbedCode";
import ReactPlayer from "react-player";
import useWindowWidth from "../Hooks/use-window-width";

interface TBlock {
  block?: Block | FooterBlock;
}

const RenderParagraph = ({ block }: TBlock) => (
  <div className={block?.attributes?.class}>{block?.content}</div>
);

interface ImageAttributes {
  src?: string;
  alt?: string;
  class?: string;
  [key: string]: any;
}

const RenderImage = ({ block }: TBlock) => {
  const { class: cls, ...attributes } =
    (block?.attributes as ImageAttributes) || {};

  return (
    <img
      {...attributes}
      src={attributes?.src ? `${baseURL}${attributes.src}` : ""}
      alt={attributes?.alt ?? ""}
      className={`h-full w-full ${cls}`}
    />
  );
};

const RenderLink = ({ block }: TBlock) => {
  const { class: cls, ...attributes } = block?.attributes || {};

  return attributes?.href ? (
    <NavLink to={attributes?.href} className={cls}>
      {block?.content}
    </NavLink>
  ) : (
    <span className={cls}>{block?.content}</span>
  );
};

const RenderListItem = ({ block }: TBlock) => {
  const { class: cls, ...attributes } = block?.attributes || {};

  return (
    <li {...attributes} className={cls}>
      {Array.isArray(block?.children) && (
        <RenderChildren blocks={block?.children} />
      )}
    </li>
  );
};

const RenderBlock = ({ block }: TBlock) => {
  const { class: cls, ...attributes } = block?.attributes || {};

  switch (block?.tag) {
    case "img":
      return <RenderImage block={block} />;
    case "p":
      return <RenderParagraph block={block} />;
    case "a":
      return <RenderLink block={block} />;
    case "li":
      return <RenderListItem block={block} />;
    case "h5":
      return (
        <h5 {...attributes} className={cls}>
          {block?.content}
        </h5>
      );
    case "ul":
      return (
        <ul {...attributes} className={cls}>
          <RenderChildren blocks={block?.children} />
        </ul>
      );
    default:
      return <></>;
  }
};

const RenderChildren = ({
  blocks,
  isMobile,
}: {
  isMobile?: boolean;
  blocks?: (Block | FooterBlock)[];
}) => (
  <>
    {blocks?.map((block, index) => {
      if (block.data_snippet === "s_embed_code") {
        return (
          <div key={index}>
            <BlockSEmbedCode block={block as unknown as Block} key={index} />
          </div>
        );
      }
      if (block.tag === "section") {
        if (block.data_snippet === "s_dynamic_snippet_products") {
          return <BlockSliderProducts block={block as Block} key={index} />;
        }

        // if (block.data_snippet === "s_image_gallery") {
        //   return <BlockImageGallery block={block as Block} key={index} />;
        // }

        return (
          <section key={index} className={``}>
            <RenderBlock block={block} />
            <RenderChildren blocks={block?.children} isMobile={isMobile} />
          </section>
        );
      } else if (block.tag === "div") {
        if (
          block?.attributes?.class === "media_iframe_video" &&
          block?.attributes?.["data-oe-expression"]
        ) {
          return (
            <div
              key={index}
              className={` w-full  rounded-md text-center m-auto p-0 `}
            >
              <ReactPlayer
                url={block.attributes?.["data-oe-expression"]}
                playing={true}
                loop={true}
                controls={true}
                muted={true}
                width={"100%"}
                height={isMobile ? 300 : 600}
              />
            </div>
          );
        }

        return (
          <div key={index} className={``}>
            <RenderBlock block={block} />
            <RenderChildren blocks={block?.children} isMobile={isMobile} />
          </div>
        );
      } else {
        return (
          <Fragment key={index}>
            <RenderBlock block={block} />
            <RenderChildren blocks={block?.children} isMobile={isMobile} />
          </Fragment>
        );
      }
    })}
  </>
);

const HomeScreen = () => {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.layouts
  );

  const isMobile = useWindowWidth().isMobile;

  if (error) return <div>{error?.toString()}</div>;

  if (loading) {
    return <Spin fullscreen />;
  }

  return (
    <>
      
      {/* 
        *
        *
        *  
        
        Render main blocks
        
        *
        *
      */}

      {/* {data?.websiteBlocks?.blocks?.map((block, index) => (
        <div key={index} className={""}>
          <RenderBlock block={block} />
          {block.children && (
            <RenderChildren blocks={block.children} isMobile={isMobile} />
          )}
        </div>
      ))} */}
    </>
  );
};

export default HomeScreen;
