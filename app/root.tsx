import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import { Provider } from "react-redux";
import { store } from "./store/store";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <Provider store={store}>
        <body>
          {children}
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
