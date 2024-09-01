import React, { useCallback, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { prettifyQuery } from "../utils/prettifyQuery";
import CodeEditor from "../components/editor/Editor";
import { useNavigate } from "@remix-run/react";
import styles from "../styles/graphql.module.scss";

type GraphQlInput = {
  apiUrl: string;
  query: string;
};

export default function GraphQLClientPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch } = useForm<GraphQlInput>();
  const query = watch("query");
  const [prettifyValue, setPrettifyValue] = useState(query);
  const [response, setResponse] = useState("");

  async function makeGraphQLRequest(apiUrl: string, query: string) {
    try {
      const endpointUrlBase64encoded = btoa(apiUrl);
      const queryBase64encoded = btoa(query);
      const linkCoding = `/graphql/${endpointUrlBase64encoded}/${queryBase64encoded}`;
      const response = await fetch(linkCoding, {
        method: "POST",
      });
      const json = await response.json();
      console.log(json);
      const stringifyJson = JSON.stringify(json, null, 2);
      setResponse(stringifyJson);

      navigate(linkCoding);
    } catch (err) {
      console.error(err);
    }
  }

  const onSubmit: SubmitHandler<GraphQlInput> = async (data) => {
    makeGraphQLRequest(data.apiUrl, data.query);
  };

  const handleEditorChange = useCallback(
    (content: string) => {
      setValue("query", content);
      setPrettifyValue(content);
    },
    [setValue],
  );

  const handlePrettify = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const prettifiedQuery = prettifyQuery(query);
    setPrettifyValue(prettifiedQuery);
    setValue("query", prettifiedQuery);
  };

  return (
    <>
      <h1 className={styles.title}>GraphQL Client</h1>
      <div className={styles.pageContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="apiUrl">
            Endpoint URL:{" "}
            <input
              {...register("apiUrl")}
              id="apiUrl"
              type="text"
              placeholder="please, enter URL"
            />
            <button type="submit">SUBMIT</button>
            <button type="button" onClick={handlePrettify}>
              Prettify
            </button>
          </label>
          <CodeEditor onChange={handleEditorChange} value={prettifyValue} />
        </form>
        <div className={styles.responseContainer}>
          <h2>Response</h2>
          {response ? (
            <pre>{response}</pre>
          ) : (
            <pre>Right, now it&apos;s empty</pre>
          )}
        </div>
      </div>
    </>
  );
}
