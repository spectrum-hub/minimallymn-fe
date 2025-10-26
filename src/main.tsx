import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.scss";
import App from "./App.tsx";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/grid";


import AppTheme from "./components/theme";
import { Provider } from "react-redux";
import { store } from "./Redux/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AppTheme>
        <App />
      </AppTheme>
    </Provider>
  </StrictMode>
);
