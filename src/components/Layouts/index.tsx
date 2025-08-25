/**
 * components\Layouts\index.tsx
 * component: MainLayout
 * Enhanced version with better performance, modularity, and UX
 */
import { StatusBar, Style } from "@capacitor/status-bar";
import React, {
  FC,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
  lazy,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import sha256 from "crypto-js/sha256";
import { AUTH_SESSION_ID, CLIENT_CUSTOMER_TOKEN } from "../../Constants";
import { AppDispatch, RootState } from "../../Redux/store";
import { checkAuthStatus } from "../../Redux/slices/authSlice";
import { userInfoAsync } from "../../Redux/userActions";
import { getCartAsync } from "../../Redux/cartActions";
import { getCatgoriesAsync, getLayoutsAsync } from "../../Redux/layoutActions";
import useWindowWidth from "../../Hooks/use-window-width";
import { decryptData } from "../../lib/helpers";
import ErrorBoundary from "../ErrorBoundary";
import LoadingSpinner from "../LoadingSpinner";
import Footer from "./Footer";
import { FloatButton, Spin } from "antd";
import { MLink } from "../Links";
import FBMessenger from "../FBMessenger";

// Lazy-loaded components for better performance
const Header = lazy(() => import("../Header/HeaderMini"));

const BottomNavbar = lazy(() => import("../Mobile/BottomNavbar"));

interface Props {
  children: React.ReactNode;
}

// Custom hook for session management
const useSession = (dispatch: AppDispatch) => {
  const initializeSession = useCallback(() => {
    let token = localStorage.getItem(CLIENT_CUSTOMER_TOKEN);
    if (!token) {
      token = sha256(`${Date.now()}-${Math.random()}`).toString();
      localStorage.setItem(CLIENT_CUSTOMER_TOKEN, token);
    }

    const authToken = localStorage.getItem(AUTH_SESSION_ID);
    if (authToken) {
      try {
        const sessionId = decryptData(authToken);
        if (sessionId && typeof sessionId === "string") {
          // Validate type
          dispatch(checkAuthStatus(sessionId));
        } else {
          console.error("Invalid sessionId format:", sessionId);
          localStorage.removeItem(AUTH_SESSION_ID);
          // Clear invalid token
        }
      } catch (error) {
        console.error("Decryption failed:", error);
        localStorage.removeItem(AUTH_SESSION_ID);
      }
    }
  }, [dispatch]);

  return { initializeSession };
};

// Custom hook for fetching data

const useFetchData = (
  dispatch: AppDispatch,
  isAuthenticated: boolean,
  loading: boolean
) => {
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          dispatch(getLayoutsAsync()),
          dispatch(getCatgoriesAsync()),
          dispatch(getCartAsync()),
          isAuthenticated && !loading
            ? dispatch(userInfoAsync())
            : Promise.resolve(),
        ]);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, [dispatch, isAuthenticated, loading]);
};

const MainLayout: FC<Props> = ({ children }) => {
  const dispatch: AppDispatch = useDispatch();
  const { isMobile } = useWindowWidth();

  const cart = useSelector((state: RootState) => state.cart.cart);
  const categories = useSelector((state: RootState) => state.category);

  const footer = useSelector(
    (state: RootState) => state.layouts?.data?.websiteBlocks?.footer
  );
  const { isAuthenticated, loading: authLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const userInfo = useSelector((state: RootState) => state.userInfo?.data);

  const { initializeSession } = useSession(dispatch);
  useFetchData(dispatch, isAuthenticated, authLoading);

  useEffect(() => initializeSession(), [initializeSession]);

  const cartTotalItems = useMemo(() => {
    return (
      cart?.carts?.[0]?.orderLines?.reduce(
        (acc, item) => acc + (item.quantity ?? 0),
        0
      ) ?? 0
    );
  }, [cart?.carts]);

  const headerParams = useMemo(
    () => ({
      userInfo,
      isAuthenticated,
      cartTotalItems,
      orderLines: cart?.carts?.[0]?.orderLines,
      cartItems: cart?.carts?.[0],
      categories: categories?.data?.categories,
      isMobile: isMobile,
    }),
    [
      userInfo,
      isAuthenticated,
      cartTotalItems,
      cart?.carts,
      categories?.data?.categories,
      isMobile,
    ]
  );
  // Display content under transparent status bar
  const setStatusBarStyleLight = async () => {
    await StatusBar.setStyle({ style: Style.Dark });
  };

  const showStatusBar = useCallback(async () => {
    if (isMobile) {
      await StatusBar.show();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      showStatusBar();
      setStatusBarStyleLight();
    }
  }, [isMobile, showStatusBar]);

  return (
    <ErrorBoundary fallback={<Spin fullscreen />}>
      <Header {...headerParams} />
      <div
        className={`min-h-screen flex flex-col ${
          isMobile ? "bg-gray-200" : "bg-gray-100"
        }`}
      >
        <main className="px-1 py-1 pb-20 max-w-5xl mx-auto flex-grow w-full">
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </main>
        {isMobile ? (
          <Suspense fallback={<LoadingSpinner />}>
            <BottomNavbar />
          </Suspense>
        ) : (
          <>
            <Footer footerData={footer ?? null} />

            <div className="copyright bg-[#2f0f46] text-gray-300 text-sm p-4 text-center  ">
              <FooterLinkContentLinks />
              Minimally.mn © 2023-{new Date().getFullYear()} Зохиогчийн эрх
              хамгаалагдсан
            </div>
          </>
        )}
        {isMobile ? null : (
          <FloatButton.BackTop visibilityHeight={100} shape={"square"} />
        )}
      </div>
      <FBMessenger />
    </ErrorBoundary>
  );
};

export default MainLayout;

const FooterLinkContentLinks: FC = () => {
  const links = [
    {
      pathname: "/contents/terms-and-conditions-of-service",
      label: "Үйлчилгээний журам болон нөхцөл",
    },
    {
      pathname: "/contents/privacy-policy",
      label: "Нууцлалын бодлого",
    },
    {
      pathname: "/contents/frequently-asked-questions",
      label: "Түгээмэл асуултууд",
    },
  ];

  return (
    <ul className="flex flex-wrap justify-center gap-2 text-center my-6 text-[15px]">
      {links.map((link, index) => (
        <li key={link.pathname} className="flex items-center gap-2">
          <MLink className="underline-hover" {...link} />
          {index < links.length - 1 && (
            <span className="mx-1 text-gray-400">|</span>
          )}
        </li>
      ))}
    </ul>
  );
};
