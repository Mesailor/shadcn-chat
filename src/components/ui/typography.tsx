import { cn } from "@/lib/utils";

export function TypographyInlineCode({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <code
      className={cn(
        "bg-muted relative rounded px-[0.3rem] py-[0.2rem] text-sm font-semibold",
        className,
      )}
    >
      {children}
    </code>
  );
}

export function HighlightedComponent({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TypographyInlineCode
      className={cn(
        "px-0 py-0 font-normal text-primary bg-primary-foreground",
        className,
      )}
    >
      {children}
    </TypographyInlineCode>
  );
}
