import { CodeBlock } from "./code-block";
import { MESSAGES } from "@/data/messages";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
  ChatEventDescription,
  ChatEventTitle,
} from "@/components/chat/chat-event";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DateItem } from "@/components/message-items/date-item";

const PRIMARY_MSG = MESSAGES[1];
const ADDITIONAL_MSG = MESSAGES[0];

export function EventUsageExample() {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Chat Event</h3>

      <h4 className="font-semibold">Primary Message</h4>
      <ChatEvent className="hover:bg-accent py-2 border-y">
        <ChatEventAddon>
          <Avatar className="rounded-full size-8 @md/chat:size-10 mx-auto">
            <AvatarImage
              src={PRIMARY_MSG.sender.avatarUrl}
              alt={PRIMARY_MSG.sender.name}
            />
            <AvatarFallback>
              {PRIMARY_MSG.sender.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </ChatEventAddon>
        <ChatEventBody>
          <div className="flex items-baseline gap-2">
            <ChatEventTitle>{PRIMARY_MSG.sender.name}</ChatEventTitle>
            <ChatEventDescription>
              {/* 07.09.2020, 16:28 */}
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(PRIMARY_MSG.timestamp)}
            </ChatEventDescription>
          </div>
          <ChatEventContent className="text-sm md:text-base">
            {PRIMARY_MSG.content}
          </ChatEventContent>
        </ChatEventBody>
      </ChatEvent>
      <CodeBlock codeString={primaryMessageCodeString} />

      <h4 className="font-semibold mt-4">Additional Message</h4>
      <ChatEvent className="hover:bg-accent group py-2 border-y">
        <ChatEventAddon>
          <ChatEventDescription className="text-right text-[8px] md:text-[10px] group-hover:visible invisible">
            {/* 16:08 */}
            {new Intl.DateTimeFormat("en-US", {
              timeStyle: "short",
            }).format(ADDITIONAL_MSG.timestamp)}
          </ChatEventDescription>
        </ChatEventAddon>
        <ChatEventBody>
          <ChatEventContent className="text-sm md:text-base">
            {ADDITIONAL_MSG.content}
          </ChatEventContent>
        </ChatEventBody>
      </ChatEvent>
      <CodeBlock codeString={additionalMessageCodeString} />

      <h4 className="font-semibold mt-4">Date Item</h4>
      <DateItem timestamp={PRIMARY_MSG.timestamp} className="py-3" />
      <CodeBlock codeString={dateItemCodeString} />
    </div>
  );
}

const primaryMessageCodeString = `import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
  ChatEventDescription,
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
        <Avatar className="rounded-full size-8 @md/chat:size-10 mx-auto">
          <AvatarImage src={avatarSrc} alt={avatarAlt} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </ChatEventAddon>
      <ChatEventBody>
        <div className="flex items-baseline gap-2">
          <ChatEventTitle>{senderName}</ChatEventTitle>
          <ChatEventDescription>
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(timestamp)}
          </ChatEventDescription>
        </div>
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
  ChatEventDescription,
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
        <ChatEventDescription className="text-right text-[8px] @md/chat:text-[10px] group-hover:visible invisible">
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
