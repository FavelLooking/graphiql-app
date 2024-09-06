import React, { useEffect, useRef } from "react";
import factory from "codemirror-ssr";
import implementPlaceholder from "codemirror-ssr/addon/display/placeholder";
import "codemirror-ssr/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import CodeMirror from "codemirror";

interface ICodeEditorProps {
  onChange: (content: string) => void;
  onBlur?: () => void;
  value: string;
}

const CodeEditor: React.FC<ICodeEditorProps> = ({
  value,
  onChange,
  onBlur,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<CodeMirror.EditorFromTextArea | null>(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    const codemirror = factory();
    implementPlaceholder(codemirror);

    editorRef.current = codemirror.fromTextArea(textareaRef.current, {
      placeholder: "Enter GraphQL query here...",
      theme: "dracula",
    });

    const handleChange = () => {
      const editorValue = editorRef.current?.getValue() || "";
      onChange(editorValue);
    };

    editorRef.current.on("change", handleChange);
    editorRef.current.on("blur", onBlur || (() => {}));

    return () => {
      editorRef.current?.off("change", handleChange);
      editorRef.current?.off("blur", onBlur || (() => {}));
      editorRef.current?.toTextArea();
    };
  }, [onChange, onBlur]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value || "");
    }
  }, [value]);

  return <textarea ref={textareaRef} />;
};

export default CodeEditor;
