import { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { prettifyQuery } from "../../utils/prettifyQuery";
import CodeEditor from "../../components/editor/Editor";
import { useLocation, useNavigate } from "@remix-run/react";
import styles from "./graphql.module.scss";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { useDispatch } from "react-redux";
import { saveQuery } from "../../store/historySlice";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

type GraphQlInput = {
  apiUrl: string;
  query: string;
  sdlUrl: string;
  variables?: string;
};

interface IServerData {
  serverData?: unknown;
}

interface RequestBody {
  query?: string;
  variables?: string;
}

interface IQueryWithVariables {
  query: string;
  variables: string;
}

interface IQueryWithoutVariables {
  query: string;
  variables?: undefined;
}

type QueryData = IQueryWithVariables | IQueryWithoutVariables;

export default function GraphQlComponent({ serverData }: IServerData) {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, setValue, watch } = useForm<GraphQlInput>();
  const apiUrl = watch("apiUrl");
  const query = watch("query");
  const sdlUrl = watch("sdlUrl");
  const [response, setResponse] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const dispatch = useDispatch();
  const [schemaString, setSchemaString] = useState<string>("");
  const [targetUrl, setUrl] = useState("");
  const { t } = useTranslation();

  const showToast = (toastText: string) => {
    toast(toastText);
  };

  const showWarnToast = (toastText: string) => {
    toast.warn(toastText);
  };

  const decodeBase64 = (str: string) => {
    return decodeURIComponent(escape(atob(str)));
  };

  const fillSdlUrl = useCallback(
    (apiUrl: string) => {
      const sdlUrl = watch("sdlUrl");
      if (!sdlUrl) {
        setValue("sdlUrl", apiUrl.trim() ? `${apiUrl}?sdl` : "");
      }
    },
    [setValue, watch],
  );

  useEffect(() => {
    const urlParts = location.pathname.split("/").slice(2);
    if (urlParts.length > 1) {
      const [encodedURL, encodedBody] = urlParts;
      const decodedURL = decodeBase64(encodedURL);
      const decodedBody: QueryData = JSON.parse(decodeBase64(encodedBody));

      const query = decodedBody.query.replace(/\\n/g, "\n");
      const variables = decodedBody.variables ?? "";

      const queryParams = new URLSearchParams(location.search);
      const newHeaders: Array<{ key: string; value: string }> = [];

      queryParams.forEach((value, key) => {
        newHeaders.push({ key, value });
      });

      setHeaders(newHeaders.length > 0 ? newHeaders : [{ key: "", value: "" }]);
      setValue("query", query);
      setValue("variables", variables);
      setValue("apiUrl", decodedURL);
      fillSdlUrl(decodedURL);
    }
  }, [location, setValue, fillSdlUrl]);

  useEffect(() => {
    setResponse(JSON.stringify(serverData, null, 2));
  }, [serverData]);

  const changeUrl = useCallback(
    (encodedApiUrl: string, encodedRequestBody: string) => {
      const headerParams = headers
        .filter(({ key, value }) => key || value)
        .map(({ key, value }) => `${key}=${value}`)
        .join("&");
      const url = `/graphql/${encodedApiUrl}/${encodedRequestBody}${headerParams ? `?${headerParams}` : ""}`;
      setUrl(url);
      window.history.replaceState({}, "", url);
    },
    [headers],
  );

  const createEncodedUrl = useCallback(() => {
    const apiUrl = watch("apiUrl");
    const query = watch("query");
    const variables = watch("variables");

    const requestBody: RequestBody = {};

    if (query && query.trim()) {
      requestBody.query = query;
    }

    if (variables && variables.trim()) {
      requestBody.variables = variables;
    }

    const encodedRequestBody = Object.keys(requestBody).length
      ? btoa(JSON.stringify(requestBody))
      : "";

    const encodedApiUrl = btoa(apiUrl ?? " ");

    return { encodedApiUrl, encodedRequestBody, apiUrl };
  }, [watch]);

  useEffect(() => {
    const { encodedApiUrl, encodedRequestBody, apiUrl } = createEncodedUrl();

    if (apiUrl.length > 0) {
      changeUrl(encodedApiUrl, encodedRequestBody);
    }
  }, [headers, createEncodedUrl, changeUrl]);

  const handleBlur = useCallback(() => {
    const { encodedApiUrl, encodedRequestBody, apiUrl } = createEncodedUrl();

    if (apiUrl.length > 0) {
      changeUrl(encodedApiUrl, encodedRequestBody);
    }

    fillSdlUrl(apiUrl);
  }, [createEncodedUrl, fillSdlUrl, changeUrl]);

  const validateUrl = (apiUrl: string) => {
    try {
      new URL(apiUrl);
      return true;
    } catch {
      return false;
    }
  };

  const onSubmit: SubmitHandler<GraphQlInput> = async () => {
    if (validateUrl(apiUrl) && query) {
      dispatch(saveQuery({ query: "graphql", route: targetUrl }));
      navigate(targetUrl);
    } else showWarnToast(t("notifications.urlFail"));
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

  const makeDocumentation = async () => {
    try {
      const introspectionResult = await fetchGraphSchema();
      const schema = buildClientSchema(introspectionResult.data);

      const schemaSDL = printSchema(schema);
      setSchemaString(schemaSDL);
      showToast(t("notifications.schemeSuccess"));
    } catch (error) {
      console.error("Error fetching scheme:", error);
      showWarnToast(t("notifications.schemeFail"));
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

  const handleVariablesChange = useCallback(
    (variables: string) => {
      setValue("variables", variables);
    },
    [setValue],
  );

  return (
    <>
      <h1 className={styles.title}>{t("titles.graphql")}</h1>
      <div className={styles.pageContainer}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.formContainer}
        >
          <label htmlFor="apiUrl">
            <b>{t("titles.endpointURL")}</b>
            <input
              {...register("apiUrl")}
              id="apiUrl"
              type="text"
              placeholder={t("placeholders.enterURL")}
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
              placeholder={t("placeholders.enterURL")}
              className={styles.inputField}
              onBlur={handleBlur}
            />
          </label>
          <div>
            <h4 className={styles.headerTitle}>{t("titles.headers")}:</h4>
            {headers.map((header, index) => (
              <div key={index} className={styles.headerContainer}>
                <input
                  type="text"
                  placeholder={t("placeholders.headerKey")}
                  value={header.key}
                  onChange={(e) =>
                    handleHeaderChange(index, e.target.value, header.value)
                  }
                  className={styles.headerKey}
                />
                <input
                  type="text"
                  placeholder={t("placeholders.headerValue")}
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
              {t("buttons.addHeader")}
            </button>
          </div>
          <div>
            <button
              type="submit"
              className={styles.button}
              disabled={!apiUrl?.trim() || !query?.trim()}
            >
              {t("buttons.submit").toUpperCase()}
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={handlePrettify}
              disabled={!query || !query.trim()}
            >
              {t("buttons.prettify")}
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={makeDocumentation}
              disabled={!sdlUrl}
            >
              {t("buttons.getSDLScheme")}
            </button>
          </div>
          <div>
            <CodeEditor
              onChange={handleEditorChange}
              value={query}
              onBlur={handleBlur}
              onVariablesChange={handleVariablesChange}
              variablesValue={watch("variables") ?? ""}
              onVariablesBlur={useCallback(() => handleBlur(), [handleBlur])}
            />
          </div>
        </form>
        <div className={styles.responseContainer}>
          <h2 className={styles.responseTitle}>{t("titles.response")}</h2>
          {response ? (
            <>
              <pre className={styles.preContainer}>{response}</pre>
            </>
          ) : (
            <pre className={styles.preContainer}>{t("emptyResponse")}</pre>
          )}
        </div>

        {schemaString ? (
          <div className={styles.documentationContainer}>
            <h2 className={styles.documentationTitle}>
              {t("titles.documentation")}
            </h2>
            <pre className={styles.preContainer}>{schemaString}</pre>
          </div>
        ) : null}
      </div>
    </>
  );
}
