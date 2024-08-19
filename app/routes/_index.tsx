import type { MetaFunction } from "@remix-run/node";
import {Header} from "~/components/header/header";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <Header/>
      <main></main>
      <footer></footer>
    </>
  );
}
