"use client";

import { cn } from "@/lib/utils";

export function ChatMessages({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col-reverse overflow-auto py-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
