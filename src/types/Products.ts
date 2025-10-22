/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface ProductBrand {
  id: number;
  logo: string;
  name: string;
}

export interface ProductPrice {
  currency: string;
  formatted: string;
  price: number;
}

export interface ProductDiscount {
  originalPrice: number;
  originalPriceFormatted: string;
  rate: number;
  currency: string;
  savingsFormatted: string;
  savings: number;
}

export interface ProductImageUrl {
  main: string;
  medium: string;
  small: string;
}

export interface ProductAttribute {
  attribute_id: number;
  attribute: string;
  value_id: number;
  value: string;
}

// Тухайн талбарын төрөл:
export type Attributes = ProductAttribute[];

export interface ProductItem {
  qtyAvailable: number;
  id: number;
  name: string;
  category: string;
  productTmplId: string;
  productId: string;
  productName: string;
  attributes?: Attributes;
  categoryNames: string[];
  priceExtraSum: number;
  mainImageUrl: ProductImageUrl;
  variantImageUrl: ProductImageUrl;
  brand: ProductBrand;
  price: ProductPrice;
  discount: ProductDiscount;
  tags: {
    name: string;
    tag_id: string;
    color: string;
  }[];
  images: ProductImage[];
  productTemplateImageIds: string[];
  productVariantImageIds: string[];
  productVariantId: string;
  productVariantCount: string;
  productVariantNum: string;
  productVariantName: string;
  productVariantIds: string[];
  propertyStockProductionId: string;
  productVariants: {
    combinationIndicesValues: CombinationIndicesValues[];
  };
  combinationIndicesValues: CombinationIndicesValues[];
  combinationIndices: string;
  templateAdditionalImages: ProductImageUrl[];
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
