import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import GraphQLClientPage from "../components/graphql/GraphQlComponent";

interface IParams {
  encodedApiUrl?: string;
  encodedRequestBody?: string;
}

export const loader: LoaderFunction = async ({
  params,
}: {
  params: IParams;
  request: Request;
}) => {
  try {
    const { encodedApiUrl, encodedRequestBody } = params;

    if (!encodedApiUrl || !encodedRequestBody) {
      return json({ error: "Missing parameters" }, { status: 400 });
    }

    const apiUrl = atob(encodedApiUrl);
    const requestBody = atob(encodedRequestBody);
    const { query, variables } = JSON.parse(requestBody);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      return json({ data: response.statusText, response: response.status });
    }

    const data = await response.json();
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
