export interface MarketplacePageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  pageCount: number;
  pageSize: number;
  currentPage: number;
}

export interface CommerceSearchItems {
  items: MarketplaceItem[];
  pageInfo: MarketplacePageInfo;
}

export interface MarketplaceProducts {
  commerceSearchItems?: CommerceSearchItems;
  total: number;
  page: number;
  pageSize: number;
}

export interface MarketplaceItem {
  BrandName: string;
  id: number;
  name: string;
  commerceDescription: CommerceDescription;
}

export interface CommerceDescription {
  BrandName: string;
  title: string;
  id: string;
  description: string;
  brandName: string;
  mainPictureUrl: string;
  promotionPrice: PromotionPrice;
  promotionPricePercent: [];
  price: Price;
  pictures: Picture[];
}

export interface PromotionPrice {
  originalPrice: number;
  marginPrice: number;
}

export interface Price {
  originalPrice: number;
  currencyName: string;
}

export interface Picture {
  url: string;
  small: Small;
  medium: Medium;
  large: Large;
}

export interface Small {
  Url: string;
  Width: number;
}

export interface Medium {
  Url: string;
}

export interface Large {
  Url: string;
}
