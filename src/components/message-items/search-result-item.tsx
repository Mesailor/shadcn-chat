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

export function SearchResultItem({
  avatarSrc,
  avatarAlt,
  avatarFallback,
  senderName,
  content,
  timestamp,
  onClick,
  className,
}: {
  avatarSrc?: string;
  avatarAlt?: string;
  avatarFallback?: string;
  senderName: string;
  content: EventContent;
  timestamp: number;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <ChatEvent
      className={cn(
        "hover:bg-accent cursor-pointer border rounded-md",
        className,
      )}
      onClick={onClick}
    >
      <ChatEventAddon>
        <ChatEventAvatar
          src={avatarSrc}
          alt={avatarAlt}
          fallback={avatarFallback}
        />
      </ChatEventAddon>
      <ChatEventBody>
        <ChatEventTitle>
          <span className="font-medium truncate">{senderName}</span>
          <ChatEventTime timestamp={timestamp} />
        </ChatEventTitle>
        <ChatEventContent>
          <MessageContent content={content} />
        </ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  );
}
