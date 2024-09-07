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
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const dispatch = useDispatch();
  const [schemaString, setSchemaString] = useState<string>("");

  useEffect(() => {
    setResponse(JSON.stringify(serverData, null, 2));
  }, [serverData]);

  const changeUrl = useCallback(
    (encodedApiUrl: string, encodedQuery: string) => {
      const headerParams = headers
        .filter(({ key, value }) => key || value)
        .map(({ key, value }) => `${key}=${value}`)
        .join("&");
      const url = `/graphql/${encodedApiUrl}${encodedQuery ? `/${encodedQuery}` : ""}${headerParams ? `?${headerParams}` : ""}`;
      window.history.replaceState({}, "", url);
    },
    [headers],
  );

  useEffect(() => {
    const apiUrl = watch("apiUrl");
    const query = watch("query");
    const encodedApiUrl = btoa(apiUrl ?? " ");
    const encodedQuery = btoa(query ?? "");
    changeUrl(encodedApiUrl, encodedQuery);
  }, [headers, watch, changeUrl]);

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
  }, [watch, fillSdlUrl, changeUrl]);

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

  const handleHeaderChange = (index: number, key: string, value: string) => {
    setHeaders((prevHeaders) => {
      const updatedHeaders = [...prevHeaders];
      updatedHeaders[index] = { key, value };
      return updatedHeaders;
    });
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  return (
    <>
      <h1 className={styles.title}>GraphQL Client</h1>
      <div className={styles.pageContainer}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.formContainer}
        >
          <label htmlFor="apiUrl">
            <b>Endpoint URL:</b>
            <input
              {...register("apiUrl")}
              id="apiUrl"
              type="text"
              placeholder="please, enter URL"
              className={styles.inputField}
              onBlur={handleBlur}
            />
          </label>
          <label htmlFor="sdlUrl">
            <b>SDL URL:</b>
            <input
              {...register("sdlUrl")}
              id="sdlUrl"
              type="text"
              placeholder="please, enter URL"
              className={styles.inputField}
              onBlur={handleBlur}
            />
          </label>
          <div>
            <h4 className={styles.headerTitle}>Headers:</h4>
            {headers.map((header, index) => (
              <div key={index} className={styles.headerContainer}>
                <input
                  type="text"
                  placeholder="Header Key"
                  value={header.key}
                  onChange={(e) =>
                    handleHeaderChange(index, e.target.value, header.value)
                  }
                  className={styles.headerKey}
                />
                <input
                  type="text"
                  placeholder="Header Value"
                  value={header.value}
                  onChange={(e) =>
                    handleHeaderChange(index, header.key, e.target.value)
                  }
                  className={styles.headerValue}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddHeader}
              className={styles.button}
            >
              Add Header
            </button>
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
            <pre className={styles.preContainer}>Right now it&apos;s empty</pre>
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
