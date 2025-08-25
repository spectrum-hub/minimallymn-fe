import { useState, useEffect } from "react";
import { MOBILE_NAV_WIDTH } from "../Constants";

const useWindowWidth = (): {
  windowWidth: number;
  isMobile: boolean;
} => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener to track window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    windowWidth,
    isMobile: windowWidth <= MOBILE_NAV_WIDTH,
  };
};

export default useWindowWidth;
