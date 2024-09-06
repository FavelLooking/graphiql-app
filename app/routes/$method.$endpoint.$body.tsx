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
    const headers = Object.fromEntries(url.searchParams.entries());

    const response = await fetch(decodedEndpoint, {
        method,
        headers,
        body:
            (method !== "GET" || method !== "DELETE") && decodedBody
                ? decodedBody
                : null,
    });

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
