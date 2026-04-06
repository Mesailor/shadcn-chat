import { cn } from "@/lib/utils";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventAvatar,
  ChatEventBody,
  ChatEventContent,
  ChatEventHoverActions,
  ChatEventTime,
  ChatEventTitle,
} from "@/registry/new-york/chat/chat-event";
import { EventContent } from "@/data/messages";
import { MessageContent } from "./message-content";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, SmilePlusIcon } from "lucide-react";

export function PrimaryMessage({
  avatarSrc,
  avatarAlt,
  avatarFallback,
  senderName,
  content,
  timestamp,
  status,

  className,
}: {
  avatarSrc?: string;
  avatarAlt?: string;
  avatarFallback?: string;
  senderName: string;
  content: EventContent;
  timestamp: number;
  status?: "sent" | "sending" | "failed";

  className?: string;
}) {
  return (
    <ChatEvent className={cn("hover:bg-accent", className)}>
      <ChatEventAddon>
        <ChatEventAvatar
          src={avatarSrc}
          alt={avatarAlt}
          fallback={avatarFallback}
        />
      </ChatEventAddon>
      <ChatEventBody>
        <ChatEventTitle>
          <span className="font-medium">{senderName}</span>
          <ChatEventTime timestamp={timestamp} />
        </ChatEventTitle>
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
