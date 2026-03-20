import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
  ChatEventTime,
} from "@/registry/new-york/chat/chat-event";
import { cn } from "@/lib/utils";
import { EventContent } from "@/data/messages";
import { MessageContent } from "./message-content";

export function AdditionalMessage({
  content,
  timestamp,
  status,
}: {
  content: EventContent;
  timestamp: number;
  status?: "sent" | "sending" | "failed";
}) {
  return (
    <ChatEvent className="hover:bg-accent group">
      <ChatEventAddon>
        <ChatEventTime
          timestamp={timestamp}
          format="time"
          className="text-right text-[8px] @md/chat:text-[10px] group-hover:visible invisible"
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
    </ChatEvent>
  );
}
