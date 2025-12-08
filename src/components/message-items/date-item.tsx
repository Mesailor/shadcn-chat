import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChatEvent } from "@/components/chat/chat-event";

export function DateItem({
  timestamp,
  className,
}: {
  timestamp: number;
  className?: string;
}) {
  return (
    <ChatEvent className={cn("items-center gap-1", className)}>
      <Separator className="flex-1" />
      <span className="text-muted-foreground text-xs font-semibold min-w-max">
        {/* 31 October 2025 */}
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(timestamp)}
      </span>
      <Separator className="flex-1" />
    </ChatEvent>
  );
}
