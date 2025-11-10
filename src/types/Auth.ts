export interface AuthContextType {
  isAuthenticated: boolean;
  user?: { name: string; email: string };
  logout: () => void;
}

// types/UserProfile.ts

export interface RecentlyViewedPid {
  productId?: number; // backend-д product_id байгаа ч заримдаа 0 эсвэл байхгүй
  productTmplId: number; // product_tmpl_id
  viewCount: number;
}

export interface ShippingAddress {
  id?: number;
  addressTitle?: string;
  addressDetail?: string;
  cityId?: string;
  districtId?: string;
  baghorooId?: string;
  phone?: string;
  latitude?: string;
  longitude?: string;
  isDefault?: boolean; // backend-д is_default байгаа ч зарим response-д байхгүй байж болно
}

export interface ShippingAddressesConfig {
  title?: string;
  addText?: string;
  editText?: string;
  deleteText?: string;
}

export interface UserProfileData {
  success?: boolean;
  message?: string;
  userId?: number;
  clientIp?: string;
  phone?: string;
  phone2?: string;
  userType?: "individual" | "company";
  companyRegister?: string;
  email?: string;
  fullname?: string;
  birthday?: string;
  gender?: string;
  textRequests?: string[] | null;
  recentSearchList?: string[] | null;
  recentlyViewedPids?: RecentlyViewedPid[];
  shippingAddresses?: ShippingAddress[];
  shippingAddressesConfig?: ShippingAddressesConfig;
}

// Main response interface
export interface UserProfileResponse {
  data: {
    userProfile: UserProfileData;
  };
}

// Хэрвээ Apollo Client ашиглаж байгаа бол useQuery-д зориулсан typed response
export type UserProfileQueryResult = {
  userProfile: UserProfileData;
  errors?: string[];
};

// Optional: GraphQL fragment эсвэл reusable type
export type ShippingAddressFragment = ShippingAddress;
export type RecentlyViewedPidFragment = RecentlyViewedPid;
