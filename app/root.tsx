import "./utils/i18n";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, useRouteError,
} from "@remix-run/react";
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkTokenExpiration } from "./store/authSlice";
import store, { AppDispatch } from "./store/store";
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
        <body>
          <Header />
          <main>{children}</main>
          <Footer />
          <ScrollRestoration />
          <Scripts />
          <ToastContainer />
        </body>
      </Provider>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
      <div>
        <h1>Something went wrong</h1>
        <pre>{error.message}</pre>
      </div>
  );
}

export default function App() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(checkTokenExpiration());
  }, [dispatch]);

  return <Outlet />;
}
