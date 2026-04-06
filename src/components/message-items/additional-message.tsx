import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
  ChatEventHoverActions,
  ChatEventTime,
} from "@/registry/new-york/chat/chat-event";
import { cn } from "@/lib/utils";
import { EventContent } from "@/data/messages";
import { MessageContent } from "./message-content";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, SmilePlusIcon } from "lucide-react";

export function AdditionalMessage({
  className,
  content,
  timestamp,
  status,
}: {
  className?: string;
  content: EventContent;
  timestamp: number;
  status?: "sent" | "sending" | "failed";
}) {
  return (
    <ChatEvent className={cn("hover:bg-accent", className)}>
      <ChatEventAddon>
        <ChatEventTime
          timestamp={timestamp}
          format="time"
          className="text-right text-[8px] @md/chat:text-[10px] group-hover/event:visible invisible"
        />
      </ChatEventAddon>
      <ChatEventBody>
        <ChatEventContent
          className={cn({
            "opacity-70": status === "sending",
          })}
        >
          <MessageContent content={content} />
        </ChatEventContent>
      </ChatEventBody>
      <ChatEventHoverActions>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 [&_svg]:size-3.5"
          aria-label="Add reaction"
        >
          <SmilePlusIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 [&_svg]:size-3.5"
          aria-label="More options"
        >
          <MoreHorizontalIcon />
        </Button>
      </ChatEventHoverActions>
    </ChatEvent>
  );
}
