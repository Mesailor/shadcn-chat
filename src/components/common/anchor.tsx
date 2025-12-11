import { Button } from "@/components/ui/button";
import { Link2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Anchor({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("group flex items-baseline gap-3 scroll-m-6", className)}
      id={id}
    >
      {children}
      <Button
        className="size-4 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        size="icon"
        variant="ghost"
        asChild
      >
        <a href={`#${id}`} aria-label="Anchor link">
          <Link2Icon className="size-2.5" />
        </a>
      </Button>
    </div>
  );
}
