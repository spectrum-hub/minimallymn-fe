export interface AuthContextType {
  isAuthenticated: boolean;
  user?: { name: string; email: string };
  logout: () => void;
}

export interface UserInfoType {
  id?: string; // Add this line
  username?: string; // Add this line
  phone?: string;
  success?: boolean
  message?: string
  userInfo?: {
    phone?: string;
    success: boolean;
    message: string;
    userData: {
      name: string;
      email: boolean;
      login: string;
      city_id?: string
      district_id?: string
      baghoroo_id?: string
      success?: boolean;
    };
    pdata: {
      id: null;
      name: string;
      complete_name: string;
      country_id: boolean;
      street2?: string
      street?: string
      email?: string
      phone?: string
    };
  };
  errors?: string[]
}
 