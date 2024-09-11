import React, { useEffect, useRef, useState } from "react";
import factory from "codemirror-ssr";
import implementPlaceholder from "codemirror-ssr/addon/display/placeholder";
import "codemirror-ssr/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import CodeMirror from "codemirror";
import styles from "./editor.module.scss";
import { useTranslation } from "react-i18next";


interface ICodeEditorProps {
  onChange: (content: string) => void;
  onVariablesChange: (variables: string) => void;
  onBlur?: () => void;
  value: string;
  variablesValue: string;
  onVariablesBlur?: () => void;
}

const CodeEditor: React.FC<ICodeEditorProps> = ({
  value,
  onChange,
  onVariablesChange,
  onBlur,
  variablesValue,
  onVariablesBlur,
}) => {
  const [isVariablesVisible, setIsVariablesVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<CodeMirror.EditorFromTextArea | null>(null);
  const variablesRef = useRef<HTMLTextAreaElement | null>(null);
  const variablesEditorRef = useRef<CodeMirror.EditorFromTextArea | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!textareaRef.current || !variablesRef.current) return;

    const codemirror = factory();
    implementPlaceholder(codemirror);

    editorRef.current = codemirror.fromTextArea(textareaRef.current, {
      placeholder: t("placeholders.enterGraphQLQuery"),
      theme: "dracula",
      mode: "graphql",
    });

    editorRef.current.setSize("90%", "300px");

    const handleChange = () => {
      const editorValue = editorRef.current?.getValue() || "";
      onChange(editorValue);
    };

    editorRef.current.on("change", handleChange);
    editorRef.current.on("blur", onBlur || (() => {}));

    variablesEditorRef.current = codemirror.fromTextArea(variablesRef.current, {
      placeholder: "Enter GraphQL variables here (JSON format)...",
      theme: "dracula",
      mode: { name: "javascript", json: true },
      lineNumbers: true,
    });

    variablesEditorRef.current.setSize("90%", "60px");

    const handleVariablesChange = () => {
      const variablesValue = variablesEditorRef.current?.getValue() || "";
      onVariablesChange(variablesValue);
    };

    const handleVariablesBlur = () => {
      if (onVariablesBlur) onVariablesBlur();
    };

    variablesEditorRef.current.on("change", handleVariablesChange);
    variablesEditorRef.current.on("blur", handleVariablesBlur);

    return () => {
      editorRef.current?.off("change", handleChange);
      editorRef.current?.off("blur", onBlur || (() => {}));
      editorRef.current?.toTextArea();

      variablesEditorRef.current?.off("change", handleVariablesChange);
      variablesEditorRef.current?.off("blur", handleVariablesBlur);
      variablesEditorRef.current?.toTextArea();
    };
  }, [onChange, onVariablesChange, onBlur, onVariablesBlur, t]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value || "");
    }
  }, [value]);

  useEffect(() => {
    if (
      variablesEditorRef.current &&
      variablesEditorRef.current.getValue() !== variablesValue
    ) {
      variablesEditorRef.current.setValue(variablesValue || "");
    }
  }, [variablesValue]);

  return (
    <div className={styles.codeEditorContainer}>
      <div className={styles.editorContainer}>
        <textarea ref={textareaRef} className={styles.textarea} />
      </div>

      <button
        onClick={() => setIsVariablesVisible((prev) => !prev)}
        type="button"
        className={styles.variableButton}
      >
        {isVariablesVisible ? "Hide Variables" : "Show Variables"}
      </button>

      <div
        className={`${styles.variablesEditor} ${isVariablesVisible ? styles.visible : styles.hidden}`}
      >
        <textarea ref={variablesRef} className={styles.textarea} />
      </div>
    </div>
  );
};

export default CodeEditor;
