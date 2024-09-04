import { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { prettifyQuery } from "../utils/prettifyQuery";
import CodeEditor from "../components/editor/Editor";
import { useNavigate } from "@remix-run/react";
import styles from "../styles/graphql.module.scss";

type GraphQlInput = {
  apiUrl: string;
  query: string;
};

interface ServerData {
  serverData: unknown;
}

export default function GraphQLClientPage({ serverData }: ServerData) {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch } = useForm<GraphQlInput>();
  const query = watch("query");
  const [response, setResponse] = useState("");

  useEffect(() => {
    setResponse(JSON.stringify(serverData, null, 2));
  }, [serverData]);

  const onSubmit: SubmitHandler<GraphQlInput> = async (data) => {
    const encodedApiUrl = btoa(data.apiUrl);
    const encodedQuery = btoa(data.query);
    navigate(`/graphql/${encodedApiUrl}/${encodedQuery}`);
  };

  const handleEditorChange = useCallback(
    (content: string) => {
      setValue("query", content);
    },
    [setValue],
  );

  const handlePrettify = useCallback(() => {
    const prettifiedQuery = prettifyQuery(query);
    setValue("query", prettifiedQuery);
  }, [query, setValue]);

  const changeUrl = (encodedApiUrl: string, encodedQuery: string) => {
    const state = {};
    window.history.replaceState(
      state,
      "",
      `/graphql/${encodedApiUrl}/${encodedQuery}`,
    );
  };

  const handleBlur = useCallback(() => {
    const apiUrl = watch("apiUrl");
    const query = watch("query");
    const encodedApiUrl = btoa(apiUrl ?? " ");
    const encodedQuery = btoa(query ?? "");
    changeUrl(encodedApiUrl, encodedQuery);
  }, [watch]);

  return (
    <>
      <h1 className={styles.title}>GraphQL Client</h1>
      <div className={styles.pageContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="apiUrl">
            Endpoint URL:
            <input
              {...register("apiUrl")}
              id="apiUrl"
              type="text"
              placeholder="please, enter URL"
              onBlur={handleBlur}
            />
          </label>
          <button type="submit">SUBMIT</button>
          <button type="button" onClick={handlePrettify}>
            Prettify
          </button>
          <CodeEditor
            onChange={handleEditorChange}
            value={query}
            onBlur={handleBlur}
          />
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
