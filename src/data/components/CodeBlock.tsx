interface CodeBlockProps {
  code: string | string[];
}

export default function CodeBlock({ code }: CodeBlockProps) {
  return (
    <pre style={{
      backgroundColor: "#f5f5f5",
      padding: "12px",
      borderRadius: "6px",
      overflowX: "auto"
    }}>
      {Array.isArray(code) ? code.join("\n") : code}
    </pre>
  );
}
