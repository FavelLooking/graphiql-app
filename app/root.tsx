import "./utils/i18n";
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
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
import { LoaderFunctionArgs } from "@remix-run/node";
import i18next from "./utils/i18n.server";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request);
  return json({ locale });
}

export const handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common",
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  useChangeLanguage(locale);
  return (
    <html lang={locale} dir={i18n.dir()}>
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
