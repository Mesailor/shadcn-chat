import { CodeBlock } from "@/components/common/code-block";
import { MESSAGES } from "@/data/messages";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventAvatar,
  ChatEventBody,
  ChatEventContent,
  ChatEventTime,
  ChatEventTitle,
} from "@/registry/new-york/chat/chat-event";
import { DateItem } from "@/components/message-items/date-item";
import { Anchor } from "@/components/common/anchor";
import { HighlightedComponent } from "@/components/ui/typography";

const PRIMARY_MSG = MESSAGES[1];
const ADDITIONAL_MSG = MESSAGES[0];

export function EventUsageExample() {
  return (
    <div className="space-y-2">
      <div>
        <Anchor id="chat-event">
          <h3 className="text-lg font-semibold">Chat Event</h3>
        </Anchor>
        <p className="text-sm text-muted-foreground">
          A flexible message row component for displaying any message or event
          in the chat. Use{" "}
          <HighlightedComponent>ChatEventAddon</HighlightedComponent> for side
          content like avatars or timestamps, and{" "}
          <HighlightedComponent>ChatEventBody</HighlightedComponent> for the
          main content area. Inside the body, use{" "}
          <HighlightedComponent>ChatEventTitle</HighlightedComponent> for sender
          name and metadata, and{" "}
          <HighlightedComponent>ChatEventContent</HighlightedComponent> for the
          message text. Use{" "}
          <HighlightedComponent>ChatEventAvatar</HighlightedComponent> for
          profile images and{" "}
          <HighlightedComponent>ChatEventTime</HighlightedComponent> for
          localized timestamp formatting with preset formats.
        </p>
      </div>

      <h4 className="font-semibold">Primary Message</h4>
      <ChatEvent className="hover:bg-accent py-2 border-y">
        <ChatEventAddon>
          <ChatEventAvatar
            src={PRIMARY_MSG.sender.avatarUrl}
            alt={PRIMARY_MSG.sender.name}
            fallback={PRIMARY_MSG.sender.name.slice(0, 2)}
          />
        </ChatEventAddon>
        <ChatEventBody>
          <ChatEventTitle>
            <span className="font-medium">{PRIMARY_MSG.sender.name}</span>
            <ChatEventTime timestamp={PRIMARY_MSG.timestamp} />
          </ChatEventTitle>
          <ChatEventContent className="text-sm md:text-base">
            {PRIMARY_MSG.content}
          </ChatEventContent>
        </ChatEventBody>
      </ChatEvent>
      <CodeBlock
        language="jsx"
        code={primaryMessageCodeString}
        showLineNumbers
      />

      <h4 className="font-semibold mt-4">Additional Message</h4>
      <ChatEvent className="hover:bg-accent group py-2 border-y">
        <ChatEventAddon>
          <ChatEventTime
            timestamp={ADDITIONAL_MSG.timestamp}
            format="time"
            className="text-right text-[8px] md:text-[10px] group-hover:visible invisible"
          />
        </ChatEventAddon>
        <ChatEventBody>
          <ChatEventContent className="text-sm md:text-base">
            {ADDITIONAL_MSG.content}
          </ChatEventContent>
        </ChatEventBody>
      </ChatEvent>
      <CodeBlock
        language="jsx"
        code={additionalMessageCodeString}
        showLineNumbers
      />

      <h4 className="font-semibold mt-4">Date Item</h4>
      <DateItem timestamp={PRIMARY_MSG.timestamp} className="py-3" />
      <CodeBlock language="jsx" code={dateItemCodeString} showLineNumbers />
    </div>
  );
}

const primaryMessageCodeString = `export function PrimaryMessage({
  avatarSrc,
  avatarAlt,
  avatarFallback,
  senderName,
  content,
  timestamp,
  className,
}: {
  avatarSrc?: string;
  avatarAlt?: string;
  avatarFallback?: string;
  senderName: string;
  content: ReactNode;
  timestamp: number;
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
        <ChatEventContent>{content}</ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  );
}
`;

const additionalMessageCodeString = `export function AdditionalMessage({
  content,
  timestamp,
}: {
  content: ReactNode;
  timestamp: number;
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
        <ChatEventContent>{content}</ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  );
}
`;

const dateItemCodeString = `export function DateItem({
  timestamp,
  className,
}: {
  timestamp: number;
  className?: string;
}) {
  return (
    <ChatEvent className={cn("items-center gap-1", className)}>
      <Separator className="flex-1" />
      <ChatEventTime
        timestamp={timestamp}
        format="longDate"
        className="font-semibold min-w-max"
      />
      <Separator className="flex-1" />
    </ChatEvent>
  );
}
`;
