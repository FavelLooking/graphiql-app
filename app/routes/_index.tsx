import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "REST/GraphiQL Client" },
    { name: "description", content: "Welcome to REST/GraphiQL Client!" },
  ];
};

export default function Index() {
  return (
    <>
      <main />
    </>
  );
}
