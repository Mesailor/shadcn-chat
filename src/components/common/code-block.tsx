import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyButton } from "@/components/common/copy-button";
import { cn } from "@/lib/utils";

export function CodeBlock({
  code,
  language,
  showLineNumbers = false,
  className,
}: {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <CopyButton className="absolute top-2 right-2 z-10" text={code} />
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          borderRadius: "8px",
          backgroundColor: "var(--sidebar)",
        }}
        showLineNumbers={showLineNumbers}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
