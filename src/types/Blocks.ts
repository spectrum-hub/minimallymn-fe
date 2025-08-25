/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSnippet, HmtlTags } from "./General";

export type DataName =
  | "Card"
  | "Products"
  | "Banners"
  | "Categories"
  | "Columns"
  | "Separator"
  | "";

export interface LayoutMenus {
  id: number;
  name: string;
  url: string;
}

export interface FooterBlock {
  id: string;
  name: string;
  content: string;
  attributes?: {
    inherit_id: string;
    name: string;
    active: string;
    expr?: string;
    class?:
      | "oe_structure oe_structure_solo"
      | "s_social_media_facebook"
      | "s_social_media_instagram"
      | "s_social_media_youtube"
      | "row"
      | "container";

    id: "footer";
    "t-ignore": "true";
    href?: string;
    "t-if": "not no_footer";
  };
  class?: string;
  tag: HmtlTags;
  data_name: string;
  data_snippet: string;
  total_sub_element: string;
  data_product_category_id: string;
  data_number_of_elements: string;
  children?: FooterBlock[];
}

export interface WebBlocksResponse {
  websiteBlocks?: {
    menus?: LayoutMenus[];
    blocks?: Block[];
    footer?: FooterBlock;
  };
}
export interface Block {
  id: string;
  name: string;
  content: string;
  attributes: any
  dataSnippet?: DataSnippet;
  data_snippet?: DataSnippet;
  tag: HmtlTags;
  totalSubElement?: number;
  total_sub_element?: number;
  dataProductCategoryId?: string;
  data_product_category_id?: string;
  dataNumberOfElements?: string;
  data_number_of_elements?: string;
  dataName?: string;
  data_name?: string;
  children?: Block[];
}

export interface OldBlock {
  tag: HmtlTags;
  attributes: { [key: string]: string };
  content: string;
  attributesClass: string;
  id: string;
  tCall: string;
  tValue: string;
  dataSnippet: DataSnippet;
  dataName: DataName;
  dataProductCategoryId: string;
  dataShowVariants: string;
  dataNumberOfRecords: string;
  dataFilterId: string;
  dataTemplateKey: string;
  dataCarouselInterval: string;
  tSet: string;
  pageName: string;
  dataNumberOfElements: string;
  dataNumberOfElementsSmallDevices: string;
  dataExtraClasses: string;
  dataRowPerSlide: string;
  dataArrowPosition: string;
  dataVcss: string;
  dataColumns: string;
  src: string;
  dataOriginalId: string;
  dataOriginalSrc: string;
  archDb?: string;
  pageIds?: string;
  menuIds?: string;
  url?: string;
  websiteUrl?: string;
  websiteId?: string;
  displayName?: string;
}
