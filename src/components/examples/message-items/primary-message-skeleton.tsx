import { cn } from "@/lib/utils";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
  ChatEventTitle,
} from "@/registry/new-york/chat/chat-event";
import { Skeleton } from "@/components/ui/skeleton";

export function PrimaryMessageSkeleton({ className }: { className?: string }) {
  return (
    <ChatEvent className={cn(className)}>
      <ChatEventAddon>
        <Skeleton className="size-8 @md/chat:size-10 rounded-full" />
      </ChatEventAddon>
      <ChatEventBody>
        <ChatEventTitle className="mb-1">
          <Skeleton className="h-4 w-24" />
        </ChatEventTitle>
        <ChatEventContent>
          <div className="flex flex-col gap-1.5 mt-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  );
}
