import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import { useDispatch } from "react-redux";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/isotope.css";
import styles from "./restcomponent.module.scss";
import { saveQuery } from "~/store/historySlice";
import { IRestComponentProps } from "~/components/rest/RestComponent.interface";
import { useTranslation } from "react-i18next";

export const RestComponent: React.FC<IRestComponentProps> = ({
  serverData,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("GET");
  const [endpoint, setEndpoint] = useState<string>("");
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>(
    [{ key: "", value: "" }],
  );
  const [variables, setVariables] = useState<
    Array<{ key: string; value: string }>
  >([{ key: "", value: "" }]);
  const [bodyContent, setBodyContent] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const decodeBase64 = (str: string) => {
    return decodeURIComponent(escape(atob(str)));
  };

  useEffect(() => {
    const urlParts = location.pathname.split("/");
    if (urlParts.length > 2) {
      const method = urlParts[1];
      const encodedEndpoint = urlParts[2];
      const decodedEndpoint = decodeBase64(encodedEndpoint);

      const encodedBodyContent = urlParts[3] ? decodeBase64(urlParts[3]) : "";

      const queryParams = new URLSearchParams(location.search);
      const newHeaders: Array<{ key: string; value: string }> = [];
      const newVariables: Array<{ key: string; value: string }> = [];

      queryParams.forEach((value, key) => {
        if (key.startsWith("header_")) {
          newHeaders.push({ key: key.replace("header_", ""), value });
        } else if (key.startsWith("var_")) {
          newVariables.push({ key: key.replace("var_", ""), value });
        }
      });

      setSelectedMethod(method);
      setEndpoint(decodedEndpoint);
      setBodyContent(encodedBodyContent);
      setHeaders(newHeaders.length > 0 ? newHeaders : [{ key: "", value: "" }]);
      setVariables(
        newVariables.length > 0 ? newVariables : [{ key: "", value: "" }],
      );
    }
  }, [location]);

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleHeaderChange = (index: number, key: string, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = { key, value };
    setHeaders(newHeaders);
  };

  const handleAddVariable = () => {
    setVariables([...variables, { key: "", value: "" }]);
  };

  const handleVariableChange = (index: number, key: string, value: string) => {
    const newVariables = [...variables];
    newVariables[index] = { key, value };
    setVariables(newVariables);
  };

  const encodeBase64 = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  const updateURL = useCallback(() => {
    const encodedEndpoint = encodeBase64(endpoint);
    const queryParams = [
      ...headers
        .filter((header) => header.key)
        .map(
          (header) =>
            `${encodeURIComponent(header.key)}=${encodeURIComponent(header.value)}`,
        ),
      ...variables
        .filter((variable) => variable.key)
        .map(
          (variable) =>
            `${encodeURIComponent(variable.key)}=${encodeURIComponent(variable.value)}`,
        ),
    ].join("&");

    const url = `/${selectedMethod}/${encodedEndpoint}${bodyContent ? `/${encodeBase64(bodyContent)}` : ""}${
      queryParams ? `?${queryParams}` : ""
    }`;
    window.history.replaceState(null, "", url);
  }, [selectedMethod, endpoint, headers, variables, bodyContent]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  const handleSubmit = () => {
    const encodedEndpoint = encodeBase64(endpoint);
    const encodedBodyContent = bodyContent ? encodeBase64(bodyContent) : null;
    const queryParams = [
      ...headers
        .filter((header) => header.key)
        .map(
          (header) =>
            `${encodeURIComponent(header.key)}=${encodeURIComponent(header.value)}`,
        ),
      ...variables
        .filter((variable) => variable.key)
        .map(
          (variable) =>
            `${encodeURIComponent(variable.key)}=${encodeURIComponent(variable.value)}`,
        ),
    ].join("&");

    const url = `/${selectedMethod}/${encodedEndpoint}${encodedBodyContent ? `/${encodedBodyContent}` : ""}${
      queryParams ? `?${queryParams}` : ""
    }`;

    const history = {
      query: "rest",
      route: url,
    };

    dispatch(saveQuery(history));

    navigate(url);
  };

  return (
    <div>
      <select
        name="method"
        aria-label="method"
        value={selectedMethod}
        onChange={(e) => {
          setSelectedMethod(e.target.value);
          updateURL();
        }}
        className={styles.apiMethod}
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="PATCH">PATCH</option>
        <option value="DELETE">DELETE</option>
      </select>
      <input
        type="text"
        name="endpoint"
        placeholder={t("placeholders.apiEndpoint")}
        value={endpoint}
        onChange={(e) => {
          setEndpoint(e.target.value);
          updateURL();
        }}
        className={styles.inputText}
      />

      <div>
        <h4>{t("titles.variable")}</h4>
        {variables.map((variable, index) => (
          <div key={index} className={styles.variableRow}>
            <input
              type="text"
              placeholder={t("placeholders.variableKey")}
              value={variable.key}
              onChange={(e) => {
                handleVariableChange(index, e.target.value, variable.value);
                updateURL();
              }}
              className={styles.variableKey}
            />
            <input
              type="text"
              placeholder={t("placeholders.variableValue")}
              value={variable.value}
              onChange={(e) => {
                handleVariableChange(index, variable.key, e.target.value);
                updateURL();
              }}
              className={styles.variableValue}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddVariable}
          className={styles.addButton}
        >
          {t("buttons.addVariable")}
        </button>
      </div>

      <div>
        <h4>{t("titles.header")}</h4>
        {headers.map((header, index) => (
          <div key={index} className={styles.headerRow}>
            <input
              type="text"
              placeholder={t("placeholders.headerKey")}
              value={header.key}
              onChange={(e) => {
                handleHeaderChange(index, e.target.value, header.value);
                updateURL();
              }}
              className={styles.headerKey}
            />
            <input
              type="text"
              placeholder={t("placeholders.headerValue")}
              value={header.value}
              onChange={(e) => {
                handleHeaderChange(index, header.key, e.target.value);
                updateURL();
              }}
              className={styles.headerValue}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddHeader}
          className={styles.addButton}
        >
          {t("buttons.addHeader")}
        </button>
      </div>

      {selectedMethod !== "GET" && (
        <div className={styles.bodySection}>
          <h4>{t("titles.body")}</h4>
          <CodeMirror
            value={bodyContent}
            options={{
              mode: "application/json",
              theme: "isotope",
              lineNumbers: true,
            }}
            onBeforeChange={(editor, data, value) => {
              setBodyContent(value);
            }}
            onChange={(editor, data, value) => {
              setBodyContent(value);
            }}
            onBlur={updateURL}
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        className={styles.submitButton}
      >
        {t("buttons.sendRequest")}
      </button>

      {serverData && (
        <div className={styles.responseSection}>
          <h3>Status</h3>
          <h5>Response status: {serverData.response}</h5>
          <h3>Response:</h3>
          <pre className={styles.response} data-testid="server-response">
            {JSON.stringify(serverData.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
