import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import GraphQLClientPage from "./graphql";

interface IParams {
  encodedApiUrl?: string;
  encodedQuery?: string;
}

export const loader: LoaderFunction = async ({
  params,
}: {
  params: IParams;
}) => {
  try {
    const { encodedApiUrl, encodedQuery } = params;
    if (!encodedApiUrl || !encodedQuery) {
      return json({ error: "Missing parameters" }, { status: 400 });
    }

    const apiUrl = atob(encodedApiUrl);
    const query = atob(encodedQuery);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown = await response.json();
    return json(data);
  } catch (error) {
    console.error("Loader error:", error);
    return json({ error: (error as Error).message }, { status: 500 });
  }
};

export default function GraphQlRequestBodyPage() {
  const loaderData = useLoaderData();
  return <GraphQLClientPage serverData={loaderData} />;
}
