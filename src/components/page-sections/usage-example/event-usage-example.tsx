import { CodeBlock } from "@/components/common/code-block";
import { MESSAGES } from "@/data/messages";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventAvatar,
  ChatEventBody,
  ChatEventContent,
  ChatEventTitle,
} from "@/components/chat/chat-event";
import { DateItem } from "@/components/message-items/date-item";
import { Anchor } from "@/components/common/anchor";

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
          A flexible message row component with Addon (for avatar/timestamp) and
          Body sections, supporting any message or event in the chat.
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
            <span className="text-xs text-muted-foreground">
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(PRIMARY_MSG.timestamp)}
            </span>
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
          <span className="text-right text-[8px] md:text-[10px] text-muted-foreground group-hover:visible invisible">
            {new Intl.DateTimeFormat("en-US", {
              timeStyle: "short",
            }).format(ADDITIONAL_MSG.timestamp)}
          </span>
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

const primaryMessageCodeString = `import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventAvatar,
  ChatEventBody,
  ChatEventContent,
  ChatEventTitle,
} from "@/components/ui/chat-event";

export function PrimaryMessage({
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
          <span className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(timestamp)}
          </span>
        </ChatEventTitle>
        <ChatEventContent>{content}</ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  );
}
`;

const additionalMessageCodeString = `import { ReactNode } from "react";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
} from "@/components/ui/chat-event";

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
`;

const dateItemCodeString = `import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChatEvent } from "@/components/ui/chat-event";

export function DateItem({
  timestamp,
  className,
}: {
  timestamp: number;
  className?: string;
}) {
  return (
    <ChatEvent className={cn("items-center gap-1", className)}>
      <Separator className="flex-1" />
      <span className="text-muted-foreground text-xs font-semibold min-w-max">
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(timestamp)}
      </span>
      <Separator className="flex-1" />
    </ChatEvent>
  );
}
`;
