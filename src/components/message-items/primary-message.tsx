import { cn } from "@/lib/utils";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventAvatar,
  ChatEventBody,
  ChatEventContent,
  ChatEventTime,
  ChatEventTitle,
} from "@/registry/new-york/chat/chat-event";
import { EventContent } from "@/data/messages";
import { MessageContent } from "./message-content";

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
    </ChatEvent>
  );
}
