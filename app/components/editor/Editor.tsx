import React, { useEffect, useRef } from "react";
import factory from "codemirror-ssr";
import implementPlaceholder from "codemirror-ssr/addon/display/placeholder";
import "codemirror-ssr/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import CodeMirror from "codemirror";

interface CodeEditorProps {
  onChange: (content: string) => void;
  value: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<CodeMirror.EditorFromTextArea | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const codemirror = factory();
      implementPlaceholder(codemirror);

      editorRef.current = codemirror.fromTextArea(textareaRef.current, {
        placeholder: "Enter GraphQL query here...",
        theme: "dracula",
      });

      const handleChange = () => {
        const value = editorRef.current?.getValue() || "";
        onChange(value);
      };

      editorRef.current.on("change", handleChange);

      return () => {
        editorRef.current?.toTextArea();
      };
    }
  }, [onChange]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(value || "");
    }
  }, [value]);

  return <textarea ref={textareaRef} />;
};

export default CodeEditor;
