import React, { Suspense, useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  // useRouteError,
} from "@remix-run/react";
import { Provider, useDispatch } from "react-redux";
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18n";
import store, { AppDispatch } from "./store/store";
import { checkTokenExpiration } from "./store/authSlice";
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./global.scss";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        <Meta />
        <Links />
      </head>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          {" "}
          {/* Оборачиваем приложение I18nextProvider */}
          <body>
            <Suspense fallback={<div>Loading...</div>}>
              <Header />
              <main>{children}</main>
              <Footer />
            </Suspense>
            <ScrollRestoration />
            <Scripts />
            <ToastContainer />
          </body>
        </I18nextProvider>
      </Provider>
    </html>
  );
}

export default function App() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(checkTokenExpiration());
  }, [dispatch]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Outlet />
    </Suspense>
  );
}
