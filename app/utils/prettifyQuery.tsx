export const prettifyQuery = (query: string): string => {
  let indentLevel = 0;
  const indentSize = 2;

  return query
    .replace(/(\{|\})/g, "\n$1\n")
    .replace(/([a-zA-Z])\s+([a-zA-Z])/g, "$1\n$2")
    .replace(/\)\s*\{/g, ") {")
    .split("\n")
    .map((line) => {
      if (line.includes("}")) indentLevel--;
      const indentedLine = " ".repeat(indentLevel * indentSize) + line.trim();
      if (line.includes("{")) indentLevel++;
      return indentedLine;
    })
    .join("\n")
    .replace(/\n\s*\n/g, "\n")
    .trim();
};
