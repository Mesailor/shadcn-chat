"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export function CopyButton({
  className,
  text,
}: {
  className?: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={className}
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={handleCopy}
    >
      {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </Button>
  );
}
