import { ReactNode } from "react";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
  ChatEventDescription,
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
        <ChatEventDescription className="text-right text-[8px] @md/chat:text-[10px] group-hover:visible invisible">
          {/* 16:08 */}
          {new Intl.DateTimeFormat("en-US", {
            timeStyle: "short",
          }).format(timestamp)}
        </ChatEventDescription>
      </ChatEventAddon>
      <ChatEventBody>
        <ChatEventContent>{content}</ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  );
}
