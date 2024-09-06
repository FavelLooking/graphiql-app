import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { RestComponent } from "~/components/rest/RestComponent";

export const loader = async ({
  params,
  request,
}: {
  params: unknown;
  request: Request;
}) => {
  const { method, endpoint } = params;
  console.log(method, endpoint);

  if (!endpoint) {
    throw new Response("Endpoint is required", { status: 400 });
  }

  const decodedEndpoint = Buffer.from(endpoint, "base64").toString("utf-8");

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

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  const queryString = new URLSearchParams(variables).toString();
  const finalUrl = queryString
    ? `${decodedEndpoint}?${queryString}`
    : decodedEndpoint;

  const response = await fetch(finalUrl, fetchOptions);
  if (!response.ok) {
    throw new Response("Failed to fetch data", { status: response.status });
  }

  const data = await response.json();
  return json({ data, response: response.status });
};

export default function RestRequestPage() {
  const actionData = useLoaderData();

  return <RestComponent serverData={actionData} />;
}
