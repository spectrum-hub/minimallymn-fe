import HomeScreen from "./Screens/HomeScreen";
import ProductListScreen from "./Screens/ProductListScreen";
import ProductDetailScreen from "./Screens/ProductDetailScreen";
import AuthLoginScreen from "./Screens/Auth/LoginScreen";
import AuthRegisterScreen from "./Screens/Auth/RegisterScreen";
import CheckoutScreen from "./Screens/Checkout/CartScreen";
import CheckoutAddressScreen from "./Screens/Checkout/AddressScreen";
import OrderDetail from "./Screens/Checkout/OrderDetail";
import Orders from "./Screens/Checkout/Orders";
import WishlistScreen from "./Screens/WishlistScreen";
import MobileLoginScreen from "./Screens/Auth/MobileLoginScreen";

import OrdersScreen from "./Screens/User/AccountOrdersScreen";
import HelpCenterScreen from "./Screens/User/HelpCenterScreen";
import ProfileScreen from "./Screens/User/ProfileScreen";
import ViewScreen from "./Screens/User/ViewScreen";
import AccountWishlistScreen from "./Screens/User/WishlistScreen";
import AccountLogoutScreen from "./Screens/User/AccountLogoutScreen";
import PhoneUpdateScreen from "./Screens/User/PhoneUpdateScreen";
import OrderDetailScreen from "./Screens/User/OrderDetailScreen";
import AccountPasswordScreen from "./Screens/User/AccountPasswordScreen";
import BrandsScreen from "./Screens/BrandsScreen";
import BlogsScreen from "./Screens/BlogsScreen";

/**
 *
 * 
 * 
 * Mobile Screens ------------
 * 
 * 
 */

import MobileCategoriesScreent from "./Screens/Mobile/CategoriesScreent";
import PrivacyPolicyScreen from "./Screens/ContentsScreen";
import MarketplaceProductsScreen from "./Screens/MarketplaceProductsScreen";
import MarketplaceProductDetailScreen from "./Screens/MarketplaceProductDetailScreen";

const routes = [
  { navigationShow: true, path: "/", Component: HomeScreen },
  {
    navigationShow: true,
    path: "/marketplace",
    Component: MarketplaceProductsScreen,
  },
  {
    navigationShow: true,
    path: "/marketplace/:productId",
    Component: MarketplaceProductDetailScreen,
  },
  {
    navigationShow: true,
    path: "/products/:slug",
    Component: ProductDetailScreen,
  },
  { navigationShow: true, path: "/products", Component: ProductListScreen },
  { navigationShow: false, path: "/checkout", Component: CheckoutScreen },
  {
    navigationShow: false,
    path: "checkout/address",
    Component: CheckoutAddressScreen,
  },
  { navigationShow: true, path: "/auth/login", Component: AuthLoginScreen },
  {
    navigationShow: true,
    path: "/auth/register",
    Component: AuthRegisterScreen,
  },
  {
    navigationShow: true,
    path: "/auth/reset-password",
    Component: MobileLoginScreen,
  },
  { navigationShow: false, path: "/orders", Component: Orders },
  { navigationShow: false, path: "/orders/:orderId", Component: OrderDetail },
  { navigationShow: true, path: "/wishlist", Component: WishlistScreen },
  { navigationShow: true, path: "/account/profile", Component: ProfileScreen },
  { navigationShow: true, path: "/account/orders", Component: OrdersScreen },
  {
    navigationShow: true,
    path: "/account/orders/:orderId",
    Component: OrderDetailScreen,
  },

  {
    navigationShow: true,
    path: "/contents/:contentTitle",
    Component: PrivacyPolicyScreen,
  },

  { navigationShow: true, path: "/account/view", Component: ViewScreen },
  {
    navigationShow: true,
    path: "/account/password",
    Component: AccountPasswordScreen,
  },
  {
    navigationShow: true,
    path: "/account/wishlist",
    Component: AccountWishlistScreen,
  },
  {
    navigationShow: true,
    path: "/account/support",
    Component: HelpCenterScreen,
  },
  {
    navigationShow: true,
    path: "/account/phone-update",
    Component: PhoneUpdateScreen,
  },
  {
    navigationShow: true,
    path: "/account/logout",
    Component: AccountLogoutScreen,
  },
  {
    navigationShow: true,
    path: "/brands",
    Component: BrandsScreen,
  },
  {
    navigationShow: true,
    path: "/blog",
    Component: BlogsScreen,
  },

  /**
   *
   * Mobile Screens ------------
   *
   */

  {
    navigationShow: false,
    path: "/mobileCategories",
    Component: MobileCategoriesScreent,
  },
];

export default routes;
