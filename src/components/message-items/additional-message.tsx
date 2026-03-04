import { ReactNode } from "react";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
  ChatEventTime,
} from "@/registry/new-york/chat/chat-event";
import { cn } from "@/lib/utils";

export function AdditionalMessage({
  content,
  timestamp,
  status,
}: {
  content: ReactNode;
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
          {content}
        </ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  );
}
