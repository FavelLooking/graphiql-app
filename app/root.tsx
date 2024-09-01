import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./global.scss";
import { Provider } from "react-redux";
import store from "./store/store";
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";

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
        </body>
      </Provider>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
