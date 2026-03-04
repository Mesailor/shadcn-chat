import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChatEvent } from "@/registry/new-york/chat/chat-event";
import { Skeleton } from "@/components/ui/skeleton";

export function DateItemSkeleton({ className }: { className?: string }) {
  return (
    <ChatEvent className={cn("items-center gap-1", className)}>
      <Separator className="flex-1" />
      <Skeleton className="h-4 w-28" />
      <Separator className="flex-1" />
    </ChatEvent>
  );
}
