import { json, ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ params }) => {
  const { encodedApiUrl, encodedQuery } = params;
  if (!encodedApiUrl || !encodedQuery) {
    return json({ error: "Missing parameters" }, { status: 400 });
  }

  const apiUrl = atob(encodedApiUrl);
  const query = atob(encodedQuery);
  console.log(query);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return json(data);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};
