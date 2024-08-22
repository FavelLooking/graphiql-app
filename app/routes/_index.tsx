import type { MetaFunction } from "@remix-run/node";
import { Header } from "~/components/header/header";
import { Footer } from "~/components/footer/footer";

export const meta: MetaFunction = () => {
  return [
    { title: "REST/GraphiQL Client" },
    { name: "description", content: "Welcome to REST/GraphiQL Client!" },
  ];
};

export default function Index() {
  return (
    <>
      <Header />
      <main></main>
      <Footer />
    </>
  );
}
