"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyButton } from "@/components/common/copy-button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";

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
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  let style = oneLight;

  // Fix hydration errors by checking if the component is mounted
  if (mounted) {
    style = resolvedTheme === "dark" ? oneDark : oneLight;
  }

  return (
    <div className={cn("relative", className)}>
      <CopyButton className="absolute top-2 right-2 z-10" text={code} />
      <SyntaxHighlighter
        language={language}
        style={style}
        customStyle={{
          borderRadius: "8px",
        }}
        showLineNumbers={showLineNumbers}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
