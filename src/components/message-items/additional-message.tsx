import { ReactNode } from "react";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
} from "../chat/chat-event";

export function AdditionalMessage({
  content,
  timestamp,
}: {
  content: ReactNode;
  timestamp: number;
}) {
  return (
    <ChatEvent className="hover:bg-accent group">
      <ChatEventAddon>
        <span className="text-right text-[8px] @md/chat:text-[10px] text-muted-foreground group-hover:visible invisible">
          {new Intl.DateTimeFormat("en-US", {
            timeStyle: "short",
          }).format(timestamp)}
        </span>
      </ChatEventAddon>
      <ChatEventBody>
        <ChatEventContent>{content}</ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  );
}
