// src/App.tsx
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { ApolloProvider } from "@apollo/client";

import NotificationCtx from "./context/NotificationCtx";
import MainLayout from "./components/Layouts";

import routes from "./routes";
import { apolloClient } from "./lib/apolloClient";
import { DrawerProvider } from "./Providers/DrawerProvider";
import { initGA, logPageView } from "./lib/analytics";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    initGA();
    logPageView();
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <PageTracker />

        <Routes>
          {routes.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <DrawerProvider>
                  <NotificationCtx>
                    <MainLayout>
                      <Component />
                    </MainLayout>
                  </NotificationCtx>
                </DrawerProvider>
              }
            />
          ))}
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
};

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    logPageView();
  }, [location]);

  return null;
};

export default App;
