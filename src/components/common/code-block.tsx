"use client";

import { useShikiHighlighter } from "react-shiki/web";
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
  const highlighted = useShikiHighlighter(
    code,
    language,
    {
      light: "github-light",
      dark: "github-dark",
    },
    {
      defaultColor: "light-dark()",
      showLineNumbers,
    },
  );

  return (
    <div className={cn("relative", className)}>
      <CopyButton className="absolute top-2 right-2 z-10" text={code} />
      {highlighted === null ? (
        <CodeBlockSkeleton code={code} />
      ) : (
        <div className="rs-root not-prose rs-default-styles">{highlighted}</div>
      )}
    </div>
  );
}

function CodeBlockSkeleton({ code }: { code: string }) {
  const lines = code.split("\n");
  const maxLen = Math.max(...lines.map((l) => l.trimEnd().length), 1);

  return (
    <div
      className="rounded-md bg-muted overflow-hidden"
      style={{ height: `calc(${lines.length} * 1.5rem + 2.5rem)` }}
    >
      <div className="pl-16 pr-8 py-5">
        {lines.map((line, i) => {
          const trimmed = line.trimEnd();
          const indent = line.length - line.trimStart().length;
          const widthPct =
            trimmed.length === 0
              ? 0
              : Math.max(12, (trimmed.length / maxLen) * 100);

          return (
            <div
              key={i}
              className="flex items-center h-6"
              style={{ paddingLeft: `${indent * 0.55}rem` }}
            >
              {widthPct > 0 && (
                <div
                  className="h-[0.7rem] rounded-sm bg-primary/15 animate-pulse"
                  style={{ width: `${widthPct}%` }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
