import { PaymentTypes } from "./Cart";

export interface OrderDetailQuery {
  orderDetails?: OrderDetails;
}

export interface PocketZeroInvoiceStatusResponse {
  data?: {
    pocketzeroInvoiceDetail?: {
      response?: PocketZeroInvoiceStatus;
    };
  };
}

export interface PocketZeroInvoiceStatus {
  aliasName?: string;
  amount?: string;
  branchId?: string;
  branchName?: string;
  category?: string;
  createdAt?: string;
  customerId?: string;
  description?: string;
  fee?: string;
  holdId?: string;
  id?: string;
  info?: string;
  invoiceType?: string;
  journalNumber: null;
  orderNumber?: string;
  paidDate?: string;
  phoneNumber?: string;
  receiverName?: string;
  referenceId?: string;
  returnDate?: string;
  returnState?: string;
  returnedJournalNumber?: string;
  senderName?: string;
  state?: string;
  terminalId?: string;
  transactionId?: string;
  timestamp?: string;
  status: "NOT_FOUND";
  code: "resource_not_found";
  message: "Илэрц олдсонгүй";
  path: "/v2/invoicing/invoices/order-number";
  errors?: string;
  data?: string;
}

export interface QpayBanklist {
  id: number;
  name: string;
  description: string;
  link: string;
  __typename: string;
}

export interface PocketzeroResponse {
  invoiceId?: number;
  qr?: string;
  orderId: number;
  orderNumber: string;
  deeplink: string;
  info: string;
  amount: number;
  error: string;
  __typename: string;
}

export interface OrderDetails {
  paymentMethodDesc: PaymentTypes;
  id: number;
  name: string;
  amountUntaxed: number;
  amountTax: number;
  amountTotal: number;
  amountToInvoice: number;
  accessToken: string;
  state: string;
  reference: string;
  signedBy: string;
  invoiceStatus: string;
  validityDate: string;
  note: string;
  locked: boolean;
  createDate: string;
  dateOrder: string;
  carrierId: number;
  payment: Payment;
  partner: Partner;
  orderLines?: OrderLine[];
  qpayInvoice?: {
    invoiceId: string;
    qrText: string;
    qrImage: string;
    bankList?: QpayBanklist[];
  };
  pocketzeroResponse?: PocketzeroResponse;
  lendmnResponse?: {
    description?: string;
    invoiceId?: string;
    qr?: string;
    orderId?: string;
    orderNumber?: string;
    deeplink?: string;
    info?: string;
    amount?: string;
    error?: string;
  };
}

interface Payment {
  id: number;
  name: string;
  code: string | null;
  pendingMsg: string | null;
}

interface Partner {
  id: number;
  name: string;
  userId: number;
  stateId: number;
  countryId: number;
  completeName: string;
  type: string;
  street: string;
  street2: string;
  zip: string;
  email: string;
  city: string;
  phone: string;
  mobile: string;
  commercialCompanyName: string;
  companyName: string;
  comment: string;
  phoneSanitized: string;
}

interface OrderLine {
  id: number;
  name: string;
  productId: number;
  qtyAvailable: number;
  price: number;
  priceTotal: number;
}
