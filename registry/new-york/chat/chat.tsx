import { cn } from "@/lib/utils";

export function Chat({
  children,
  className,
}: {
  children?: React.ReactNode;
} & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "h-full overflow-hidden flex flex-col @container/chat",
        className
      )}
    >
      {children}
    </div>
  );
}
