import { CommerceDescription } from "./Marketplace";
import { PublicCategIds } from "./Products";

interface ProductImage {
  sequence: number;
  id: number;
  productVariantId: number;
  img_type?: string;
}

export interface ItemAttribute {
  id: number;
  name: string;
  displayType: string;
  priceExtra: number | null;
  defaultExtraPrice: number | null;
}

export interface ProductAttributeValue {
  id: number;
  attributeId: ItemAttribute;
  attribute?: ItemAttribute;
  color: string;
  htmlColor: string;
  name: string;
  defaultExtraPrice: number;
  isCustom: boolean;
  productVariantId?: number;
}

interface ProductTemplateAttributeValue {
  productAttributeValueId: ProductAttributeValue;
}

interface ProductVariantImageIds {
  id: number;
  img_type?: string;
}
export interface ParentProduct {
  qtyAvailable: number;
  id: number;
  isProductVariant: boolean;
  priceExtra: number;
  combinationIndices: string;
  listPrice: number;
  price: number | null;
  productTemplateAttributeValueIds: ProductTemplateAttributeValue[];
  productVariantImageIds?: ProductVariantImageIds[];
}

interface ProductPlatformImage {
  url: string;
  smallUrl: string;
  width: number;
  isMain: boolean;
  __typename: string;
}

interface PlatformItemVariants {
  id: string;
  quantity: number;
  salesCount: number;
  price: number;
  pid?: string;
  vid?: string;
  propertyName?: string;
  value?: string;
  originalValue?: string;
  image?: string;
  thumbnail?: string;
  configOptions?: VariantConfigurator[];
  convertedPrice?: string
}
export interface ProductVideoItem {
  preview: string;
  url: string;
}

export interface VariantConfigurator {
  Pid: string;
  Vid: string;
  pid?: string;
  vid?: string;
  propertyName?: string;
  value?: string;
  originalValue?: string;
  image?: string;
  thumbnail?: string;
}

export interface PlatformAttributes {
  vid: string;
  pid: string;
  attribute?: string;
  value?: string;
  name?: string;
  image?: string;
  thumbnail?: string;
}
export interface NProductDetail {
  success?: boolean;
  error?: string;
  qtyAvailable: number;
  productHtmlDesc: string | undefined;
  productAdditionalWarning?: string;
  id: number;
  name: string;
  description: string;
  defaultCode: string;
  listPrice: number;
  standardPrice: number;
  productImages?: ProductImage[];
  productPlatformImages?: ProductPlatformImage[];
  parentProducts: ParentProduct[];
  publicCategIds?: PublicCategIds[];
  commerceDescription?: CommerceDescription;
  productBrand: {
    name?: string;
    id?: string;
  };
  platformItemVariants?: PlatformItemVariants[];
  videos?: ProductVideoItem[];
  attributes?: PlatformAttributes[];
  configurator?: string
}

export type GroupedAttrbutesProps = Record<
  number,
  { attribute: ItemAttribute; values: ProductAttributeValue[] }
>;

export interface ProductDetailType {
  itemDetail?: NProductDetail;
  itemDetailPlatform?: NProductDetail;
}
