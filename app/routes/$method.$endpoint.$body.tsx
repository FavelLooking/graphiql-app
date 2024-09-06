import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { RestComponent } from "~/components/rest/RestComponent";

export const loader: LoaderFunction = async ({
  params,
  request,
}: {
  params: unknown;
  request: Request;
}) => {
  const { method, endpoint, body } = params;
  console.log(method, endpoint, body);

  if (!endpoint) {
    throw new Response("Endpoint is required", { status: 400 });
  }

  const decodedEndpoint = Buffer.from(endpoint, "base64").toString("utf-8");
  const decodedBody = body
    ? Buffer.from(body, "base64").toString("utf-8")
    : null;

  const url = new URL(request.url);
  const headers: Record<string, string> = {};
  const variables: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    if (
      key.toLowerCase() === "authorization" ||
      key.toLowerCase() === "content-type"
    ) {
      headers[key] = value;
    } else {
      variables[key] = value;
    }
  });

  const requestBody = decodedBody ? JSON.parse(decodedBody) : {};
  if (Object.keys(variables).length > 0) {
    requestBody.variables = variables;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    body: JSON.stringify(requestBody),
  };

  const response = await fetch(decodedEndpoint, fetchOptions);

  if (!response.ok) {
    throw new Response("Failed to fetch data", { status: response.status });
  }

  const data = await response.json();
  return json({ data, response: response.status });
};

export default function RestRequestBodyPage() {
  const actionData = useLoaderData();

  return <RestComponent serverData={actionData} />;
}
