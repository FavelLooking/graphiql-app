import { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { prettifyQuery } from "../utils/prettifyQuery";
import CodeEditor from "../components/editor/Editor";
import { useNavigate } from "@remix-run/react";
import styles from "../styles/graphql.module.scss";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { useDispatch } from "react-redux";
import { saveQuery } from "~/store/historySlice";

type GraphQlInput = {
  apiUrl: string;
  query: string;
  sdlUrl: string;
};

interface IServerData {
  serverData: unknown;
}

export default function GraphQLClientPage({ serverData }: IServerData) {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch } = useForm<GraphQlInput>();
  const query = watch("query");
  const [response, setResponse] = useState("");
  const dispatch = useDispatch();

  const [schemaString, setSchemaString] = useState<string>("");

  useEffect(() => {
    setResponse(JSON.stringify(serverData, null, 2));
  }, [serverData]);

  const onSubmit: SubmitHandler<GraphQlInput> = async (data) => {
    const encodedApiUrl = btoa(data.apiUrl);
    const encodedQuery = btoa(data.query);
    const url = `/graphql/${encodedApiUrl}/${encodedQuery}`;
    dispatch(saveQuery({ query: "graphql", route: url }));
    navigate(url);
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

  const fillSdlUrl = useCallback(
    (apiUrl: string) => {
      setValue("sdlUrl", `${apiUrl}?sdl`);
    },
    [setValue],
  );

  const handleBlur = useCallback(() => {
    const apiUrl = watch("apiUrl");
    const query = watch("query");
    const encodedApiUrl = btoa(apiUrl ?? " ");
    const encodedQuery = btoa(query ?? "");
    changeUrl(encodedApiUrl, encodedQuery);
    fillSdlUrl(apiUrl);
  }, [watch, fillSdlUrl]);

  const makeDocumentation = async () => {
    try {
      const introspectionResult = await fetchGraphSchema();
      const schema = buildClientSchema(introspectionResult.data);

      const schemaSDL = printSchema(schema);
      setSchemaString(schemaSDL);
    } catch (error) {
      console.error("Error fetching schema:", error);
    }
  };

  const fetchGraphSchema = async () => {
    const sdlUrl = watch("sdlUrl");
    const fetcher = createGraphiQLFetcher({
      url: sdlUrl,
    });
    const data = await fetcher({
      query: getIntrospectionQuery(),
      operationName: "IntrospectionQuery",
    });
    return data;
  };

  return (
    <>
      <h1 className={styles.title}>GraphQL Client</h1>
      <div className={styles.pageContainer}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.formContainer}
        >
          <div>
            <label htmlFor="apiUrl">
              Endpoint URL:
              <input
                {...register("apiUrl")}
                id="apiUrl"
                type="text"
                placeholder="please, enter URL"
                className={styles.inputField}
                onBlur={handleBlur}
              />
            </label>
          </div>
          <div>
            <label htmlFor="sdlUrl">
              SDL URL:
              <input
                {...register("sdlUrl")}
                id="sdlUrl"
                type="text"
                placeholder="please, enter URL"
                className={styles.inputField}
                onBlur={handleBlur}
              />
            </label>
          </div>
          <div>
            <button type="submit" className={styles.button}>
              SUBMIT
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={handlePrettify}
            >
              Prettify
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={makeDocumentation}
            >
              Get SDL Scheme
            </button>
          </div>
          <div>
            <CodeEditor
              onChange={handleEditorChange}
              value={query}
              onBlur={handleBlur}
            />
          </div>
        </form>
        <div className={styles.responseContainer}>
          <h2 className={styles.responseTitle}>Response</h2>
          {response ? (
            <pre className={styles.preContainer}>{response}</pre>
          ) : (
            <pre className={styles.preContainer}>
              Right, now it&apos;s empty
            </pre>
          )}
        </div>

        {schemaString ? (
          <div className={styles.documentationContainer}>
            <h2 className={styles.documentationTitle}>Documentation</h2>
            <pre className={styles.preContainer}>{schemaString}</pre>
          </div>
        ) : null}
      </div>
    </>
  );
}
