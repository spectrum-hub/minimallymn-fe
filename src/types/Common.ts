import {
  FieldValues,
  FieldPath,
  Noop,
  FieldPathValue,
  RefCallBack,
} from "react-hook-form";
import { UserInfoType } from "./Auth";
import { Cart, OrderLine, PaymentTypes } from "./Cart";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
}
export type SeoNameTypes = "p" | "c" | "s" | "a" | "e";
export type YesNo = "Y" | "N";
export type GraphicText = "G" | "T";
export type Status = "A" | "I" | "D" | "O";
export interface QueryParams {
  sort_by?: SortBy;
  sort_order?: SortOrder;
  items_per_page?: number;
  get_filters?: string;
  page?: number;
  bestsellers?: string;
  on_sale?: string;
  newest?: string;
  limit?: number;
  features_hash?: string;
  q?: string;
  shipment_id?: string;
  coupon_codes?: string;
}
export interface Availability {
  phone: boolean;
  tablet: boolean;
  desktop: boolean;
}
export type langCodes = "mn" | "en" | "ru" | "cn";
export type SortOrder = "desc" | "asc";
export type TitlePosition = "left" | "right" | "center";
export type SortBy =
  | "position"
  | "timestamp"
  | "product"
  | "price"
  | "popularity";

export type Dispatches =
  | "default"
  | "index.index"
  | "products.view"
  | "categories.view"
  | "checkout.cart"
  | "checkout"
  | "auth"
  | "profiles"
  | "profiles.success_add"
  | "checkout.complete"
  | "pages.view"
  | "no_page"
  | "products.search"
  | "gift_certificates"
  | "press.centers"
  | "book.authors"
  | "book.translators";

export interface SeoResponce {
  name: string;
  object_id: number;
  company_id: number;
  type: SeoNameTypes;
  dispatch: string;
  path: string;
  lang_code: string;
}

export interface SortParams {
  sort_by?: string;
  sort_order?: string;
  page?: number;
  features_hash?: string;
  total_items?: number;
  items_per_page?: number;
}

export interface PriceFormat {
  price: string | number;
  symbol: NSymbol;
}
export enum NSymbol {
  Empty = "₮",
}

export interface PriceRawTotals {
  raw_total_price: number;
  total_price: number;
}
export interface Payment {
  position: number;
  payment: string;
  description: string;
  instructions: string;
  p_surcharge?: string;
  a_surcharge?: string;
  surcharge_title: string;
  script?: null;
  template?: string;
  payment_id: number;
  icon?: string;
  only_auth_users: "Y" | "N";
}
export type Promotion = {
  bonuses: PromotionBonus[];
};
type PromotionBonus = {
  bonus: string;
  discount_bonus: string;
  discount_value: string;
  promotion_id: string;
};
export interface DefaultLocation {
  tracking: string;
  options_type: string;
  exceptions_type: string;
  address: string;
  zipcode: string;
  city: string;
  country: string;
  state: string;
  phone: string;
  country_descr: string;
  state_descr: string;
}
export interface GiftCertificates {
  gift_cert_code: string;
  gift_cert_id: number;
  amount: number;
  company_id: number;
  display_subtotal: number;
  email: string;
  guest_id: string;
  http_location: string;
  ip_address: string;
  item_id: string;
  item_type: "G";
  order_id: "348";
  phone: string;
  position: string;
  price: string;
  product_id: string;
  recipient: string;
  send_via: "E";
  sender: string;
  session_id: string;
  storefront_id: string;
  subtotal: number;
  tax_value: number;
  template: string;
  timestamp: string;
  type: "C";
  user_id: string;
  user_type: "R";
}
export type CustomerType = "citizen" | "organization";
export interface ShipmentPaymentForm {
  city: string;
  district?: string;
  baghoroo?: string;
  firstname: string;
  s_phone: string;
  s_address?: string;
  customer_type: string;
  payment_id: string;
  shipment_id?: number;
  customer_notes?: string;
  full_address?: object;
  email?: string;
}

export type TControllerRenderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  onChange: (...event: unknown[]) => void;
  onBlur: Noop;
  value: FieldPathValue<TFieldValues, TName>;
  disabled?: boolean;
  name: TName;
  ref: RefCallBack;
};

export interface PageProfile {
  key: string;
  label: string;
  icon: JSX.Element;
  additional?: number | string;
  className?: string;
  position: number;
}

export interface Step1Values {
  baghoroo: string;
  city: string;
  customer_type: string;
  district: string;
  email?: string | null;
  firstname: string;
  s_address: string;
  s_phone: string;
  register_org?: string | null;
  customer_notes?: string | null;
  deliveryId?: number | undefined;
  paymentCode?: PaymentTypes;
}

export interface StepValues {
  baghoroo: string;
  city: string;
  customer_type: string;
  district: string;
  email?: string | null;
  firstname: string;
  s_address: string;
  s_phone: string;
  register_org?: string | null;
  customer_notes?: string | null;
  paymentCode: PaymentTypes;
  deliveryId?: number | undefined;
}

export interface HeaderProps {
  isShowNavigation?: boolean;
  userInfo?: UserInfoType | null;
  isAuthenticated?: boolean;
  cartTotalItems?: number;
  orderLines?: OrderLine[];
  cartItems?: Cart;
  isMobile?: boolean;
}

export interface LocationsType {
  value: string;
  label: string;
  sumDuureg: {
    [key: string]: {
      id: string;
      value: string;
      country_code: string;
      label: string;
      baghoroo: {
        [key: string]: {
          value: string;
          label: string;
          aimag_city_code: string;
          soum_district_code: string;
          id: string;
        };
      };
    };
  };
}

export interface LocationNType {
  [key: string]: {
    value: string;
    label: string;
    sumDuureg: {
      [key: string]: {
        id: string;
        value: string;
        country_code: string;
        label: string;
        baghoroo: {
          [key: string]: {
            value: string;
            label: string;
            aimag_city_code: string;
            soum_district_code: string;
            id: string;
          };
        };
      };
    };
  };
}

export type ApiContextType = "commerce" | "minimally";


export interface CheckoutLocations {
  city?: string;
  district?: string;
  baghoroo?: string;
}
