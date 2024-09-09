export const prettifyQuery = (query: string): string => {
  let indentLevel = 0;
  const indentSize = 2;

  return query
    .replace(/\}\s*/g, "\n}\n")
    .replace(/\{(\n\s*\n)/g, "{")
    .replace(/\)\s*\{/g, ") {")
    .replace(/(\w)\s*\{/g, "$1 {\n")
    .split("\n")
    .map((line) => {
      if (line.includes("}")) indentLevel--;
      const indentedLine =
        " ".repeat(Math.max(indentLevel * indentSize, 0)) + line.trim();
      if (line.includes("{")) indentLevel++;
      return indentedLine;
    })
    .join("\n")
    .replace(/\n\s*\n/g, "\n")
    .trim();
};
