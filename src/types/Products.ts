interface ImageSize {
  main: string;
  medium: string;
  small: string;
}

interface Tag {
  tag_id: number;
  name: string;
  color: string;
}

interface Category {
  name: string;
  url: string;
  id: number;
}

interface Brand {
  url: string;
  id: number;
  name: string;
  logo: ImageSize;
}

interface Price {
  price: string;
  formatted: string;
  currency: string;
  discount?: null;
}

interface Discount {
  currency: string;
  rate: string;
  savingsFormatted: null | string;
  savings: null | number;
  originalPrice: null | number;
  originalPriceFormatted: null | string;
}

interface Quantity {
  quantity: number | null;
  description: string;
}

interface Attribute {
  attribute_id: number;
  attribute: string;
  value_id: number;
  value: string;
}

export interface ProductItem {
  url: string;
  slug: string;
  productTmplId: number;
  productId: number;
  productName: string;
  isFrontListView: "Y" | "N";
  attributes: Attribute[];
  tags: Tag[];
  category: Category;
  fullDescription: string;
  templateAdditionalImages: ImageSize[];
  variantAdditionalImages: ImageSize[];
  brand: Brand;
  mainImageUrl: ImageSize;
  variantImageUrl: ImageSize;
  price: Price;
  discount: Discount;
  quantity: Quantity;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
  slug: string;
  filters: {
    attribute_value_ids: number[];
  };
}

interface Products {
  pageInfo: PageInfo;
  items: ProductItem[];
}


export interface ProductsQueryData {
  items: Products;
}

export interface ProductsQueryResponseData {
  items: ProductItem[];
}
