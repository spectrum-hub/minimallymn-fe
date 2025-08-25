import { ProductItem } from "./Products";

export interface OrderLine {
  id?: number;
  productId?: number;
  product?: ProductItem;
  quantity?: number;
  priceUnit?: number;
  lineName?: string;
  discount?: number;
  priceSubtotal?: number;
  priceTotal?: number;
  isDelivery?: boolean;
  priceTax?: number;
  state?: string;
  
}

export type PaymentTypes = "pocketzero" | "storepay"| "wire_transfer" | "lendmn"

export interface PaymentMethods {
  sequence: number;
  id: number;
  primaryPaymentMethodId: number;
  fixedPrice: number;
  code: PaymentTypes;
  name: string;
  supportRefund: boolean;
  description?: string;
  isAuthRequired?: boolean;
}
export interface DeliveryCarriers {
  id: number;
  amount: number;
  fixedPrice: number;
  freeOver: number;
  name: string;
  deliveryType: string;
  productId: number;
}
export interface Cart {
  id?: number;
  name?: string;
  amountTotal?: number;
  status?: string;
  existCart?: string;
  orderLines?: OrderLine[];
  total?: number;
  paymentMethods?: PaymentMethods[];
  deliveryCarriers?: DeliveryCarriers[];
  selectedDeliveriers?: OrderLine[];
  isDeliverySelected?: boolean
}

export interface CreateOrder {
  order: Cart;
}

export interface CartData {
  createOrder: CreateOrder;
}

export interface CartResponse {
  carts?: Cart[];
}
