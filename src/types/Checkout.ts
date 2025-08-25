import { CustomerType } from "./Common";

export type Payments = Record<string, Payment>;
export interface Payment {
  payment_id: number;
  payment: string;
  description: string;
  instructions: string;
  icon?: string | PaymentIcon;
}
export interface PaymentIcon {
  image_path: string;
  alt: string;
  is_high_res: boolean;
  relative_path: string;
  image_y: number;
  image_x: number;
}

/*------------ * Shipment *------------ */


export type ShipmentLocations = Record<string, Country>;
export interface Country {
  value: string;
  label: string;
  sumDuureg: Record<string, State>;
}

export interface State {
  id: string;
  value: string;
  country_code: string;
  label: string;
  baghoroo?: Record<string, Baghoroo>;
}

export interface Baghoroo {
  value: string;
  label: string;
  aimag_city_code: string;
  soum_district_code: string;
  id: string;
}

export interface SraBmLocation {
  location_id: number;
  dispatch: string;
  is_default: string;
  layout_id: number;
  object_ids: unknown;
  custom_html: unknown;
  position: number;
  lang_code: string;
  name: string;
  title: string;
  meta_description: string;
  meta_keywords: string;
  is_frontend_editing_allowed: boolean;
}
export interface SraBmLocations {
  [location_id: string]: SraBmLocation;
}
/*------------ * Order *------------ */

export interface OrderCreateProduct {
  product_id: string;
  amount: number;
}
export interface OrderCreateRequest {
  products?: Record<string, OrderCreateProduct>;
  shipping_id?: 1;
  payment_id?: 14;
  has_coupons?: boolean;
  ship_to_another?: 0;
  register_org?: string;
  customer_type?: string;
  coupon_codes?: string;
  use_discount?: boolean;
  coupons?: string;
  coupon_code?: string;
  user_data?: {
    payment_id: string;
    shipping_id?: number;
    customer_notes: string;
    email: string;
    s_address: string;
    customer_type: CustomerType;
    s_phone: string;
    firstname: string;
    baghoroo: string;
    district: string;
    city: string;
    s_state: string;
    s_city?: string;
    s_country: string;
    recalculate: boolean;
    calculate_shipping: "A";
    guest_checkout: boolean;
    ship_to_another: 0;
    guest_id: string;
    phone: string;
    lastname: string;
  };
}

export interface UpdateCartResponse {
  status: number;
  cart?: { cart_ids: Record<number, number> };
}

export interface QPayBankUrl {
  description: string;
  link: string;
  name: string;
}
