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

  const cart = useSelector((state: RootState) => state?.cart?.cart);
  const categories = useSelector((state: RootState) => state.category);

  const themeGrid = useSelector(
    (state: RootState) => state.layouts?.data?.themeGrid
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Header with sticky positioning and smooth shadow */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200/50 shadow-sm transition-all duration-300">
          <Header {...headerParams} />
        </header>

        {/* Main content area with improved spacing and max-width */}
        <main className={`flex-grow w-full transition-all duration-300 ${
          isMobile 
            ? "px-3 py-2 pb-24" 
            : "px-4 md:px-6 lg:px-8 py-4 md:py-6"
        } max-w-7xl mx-auto`}>
          <div className="transition-opacity duration-300">
            <Suspense 
              fallback={
                <div className="flex items-center justify-center min-h-[200px]">
                  <LoadingSpinner />
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </main>

        {/* Footer/Bottom Navigation */}
        {isMobile ? (
          <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md bg-white/95 border-t border-gray-200/50 shadow-lg">
            <Suspense fallback={<LoadingSpinner />}>
              <BottomNavbar />
            </Suspense>
          </div>
        ) : (
          <footer className="mt-auto border-t border-gray-200/50 bg-white/80 backdrop-blur-sm">
            <Footer themeGrid={themeGrid ?? null} />
          </footer>
        )}

        {/* Back to top button with modern design */}
        {!isMobile && (
          <FloatButton.BackTop 
            visibilityHeight={100} 
            style={{
              right: 24,
              bottom: 24,
              borderRadius: 12,
              border: 'none',
            }}
          />
        )}
      </div>

      {/* FB Messenger with improved positioning */}
      <div className="fixed bottom-20 right-4 z-30">
        <FBMessenger />
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout; 