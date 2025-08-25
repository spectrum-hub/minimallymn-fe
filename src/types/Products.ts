/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category } from "./Category";

export interface Attribute {
  id: number;
  name: string;
  sequence: number;
  attributeId: string[] | undefined;
  color: number;
  htmlColor: boolean;
  active: boolean;
  defaultExtraPrice: number;
  displayType: "select" | "radio" | "color" | "multi";
}
export interface ProductsQuery {
  products: Products;
}

export interface WishlistsQuery {
  wishlist: Products;
}

export interface PublicCategories {
  id: number;
  name: string;
  parentPath: string;
}

export interface Products {
  pageInfo: PageInfo;
  items: ProductItem[];
  publicCategories?: PublicCategories[];
  attributes?: Attribute[];
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  pageCount: number;
  pageSize: number;
  currentPage: number;
  __typename: string;
}
export interface PublicCategIds {
  name: string;
  id: number;
  parentPath: string;
}
export interface ProductItem {
  productHtmlDesc?: string;
  product_id?: number;
  product_variant_ids: number[];
  id: number;
  name: string;
  listPrice: number;
  standardPrice: number;
  type: string;
  websiteSequence: number;
  category: Category;
  productVariantIds: number[];
  productVariantId: string[];
  productVariantCount: number;
  barcode: string;
  pricelistItemCount: number;
  images?: ProductImage[];
  productTemplateImageIds?: number[];

  description?: string;
  pricelist?: any | null;
  attributes?: any | null;
  displayName?: string;
  productVariantNum?: number;
  productVariantName?: string;
  propertyStockProductionId?: number;
  propertyStockProductionName?: string;
  publicCategIds?: PublicCategIds[];
  baseUnitPrice?: string;
  availableThreshold?: string;
  baseUnitName?: string;
  baseUnitCount?: string;
  descriptionSale?: string;
  attributeLineIds?: number[];
  validProductTemplateAttributeLineIds?: number[];
  incomingQty?: number;
  outgoingQty?: number;
  salesCount?: number;
  alternativeProductIds?: any[];
  websiteDescription?: string;
  qtyAvailable?: number;
  productVariants?: {
    attributesList?: AttributesList[];
    combinationIndicesValues?: CombinationIndicesValues[];
  };
  productTmplId: number;
  combinationIndices?: string;
  productBrand?: {
    name: string;
    id: number;
  };
  brand?: {
    name: string;
    id: number;
  };
}

export interface AttributesList {
  productVariantId?: number;
  attributeName?: string;
  id: number;
  productAttributeValueId?: string;
  attributeLineId: string;
  productTmplId?: string;
  attributeId?: string;
  attributeDisplayType?: "select" | "radio" | "color" | "multi";
  sequence?: string;
  color?: string;
  name?: string;
  htmlColor?: string;
  priceExtra?: string;
}
export interface CombinationIndicesValues {
  combinationIndices: string;
  productId: string;
  qtyAvailable: number;
  productTemplateImageIds?: string[];
  productVariantImageIds?: string[];
}

export interface ProductImage {
  id?: 32;
  url?: string;
}

export interface Root {
  data: Data;
}

export interface Data {
  products: Products;
}

export interface ProductDetails {
  productDetails?: ProductItem;
}
