import React, { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { useDispatch } from "react-redux";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/isotope.css";
import styles from "./restcomponent.module.scss";
import { saveQuery } from "~/store/historySlice";

interface RestComponentProps {
    serverData?: unknown;
}

export const RestComponent: React.FC<RestComponentProps> = ({ serverData }) => {
    const [processUrl, setProcessUrl] = useState<string>("");
    const [selectedMethod, setSelectedMethod] = useState<string>("GET");
    const [endpoint, setEndpoint] = useState<string>("");
    const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>(
        [{ key: "", value: "" }],
    );
    const [bodyContent, setBodyContent] = useState<string>("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAddHeader = () => {
        setHeaders([...headers, { key: "", value: "" }]);
    };

    const handleHeaderChange = (index: number, key: string, value: string) => {
        const newHeaders = [...headers];
        newHeaders[index] = { key, value };
        setHeaders(newHeaders);
    };

    const encodeBase64 = (str: string) => {
        return btoa(unescape(encodeURIComponent(str)));
    };

    const handleBlur = (value) => {
        const encodedValue = value ? encodeBase64(value) : "null";
        const url = `${processUrl}/${encodedValue}`;
        setProcessUrl(url);
        window.history.replaceState(null, "", url);
    };

    const handleSubmit = () => {
        const encodedEndpoint = encodeBase64(endpoint);
        const encodedBodyContent = bodyContent ? encodeBase64(bodyContent) : null;
        const queryParams = headers
            .filter((header) => header.key)
            .map(
                (header) =>
                    `${encodeURIComponent(header.key)}=${encodeURIComponent(header.value)}`,
            )
            .join("&");

        const url = `/${selectedMethod}/${encodedEndpoint}${encodedBodyContent ? `/${encodedBodyContent}` : ""}${
            queryParams ? `?${queryParams}` : ""
        }`;
        setProcessUrl(url);

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
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
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
                placeholder="API Endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className={styles.inputText}
                onBlur={(e) => handleBlur(e.target.value)}
            />

            <div>
                <h4>Headers</h4>
                {headers.map((header, index) => (
                    <div key={index} className={styles.headerRow}>
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
                    className={styles.addButton}
                >
                    Add Header
                </button>
            </div>

            {selectedMethod !== "GET" && (
                <div className={styles.bodySection}>
                    <h4>Body</h4>
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
                        onBlur={(editor) => {
                            const value = editor.doc.getValue();
                            handleBlur(value);
                        }}
                    />
                </div>
            )}

            <button
                type="button"
                onClick={handleSubmit}
                className={styles.submitButton}
            >
                Send Request
            </button>

            {serverData && (
                <div className={styles.responseSection}>
                    <h3>Status</h3>
                    <h5>Response status: {serverData.response}</h5>
                    <h3>Response:</h3>
                    <pre className={styles.response}>
            {JSON.stringify(serverData.data, null, 2)}
          </pre>
                </div>
            )}
        </div>
    );
};
