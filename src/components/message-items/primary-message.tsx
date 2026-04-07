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
import { ReactionsPopover } from "./reactions-popover";

export function PrimaryMessage({
  avatarSrc,
  avatarAlt,
  avatarFallback,
  senderName,
  content,
  timestamp,
  status,
  reactions,
  onReaction,
  className,
  id,
  highlighted,
}: {
  avatarSrc?: string;
  avatarAlt?: string;
  avatarFallback?: string;
  senderName: string;
  content: EventContent;
  timestamp: number;
  status?: "sent" | "sending" | "failed";
  reactions?: string[];
  onReaction?: (emoji: string) => void;
  className?: string;
  id?: string;
  highlighted?: boolean;
}) {
  return (
    <ChatEvent
      id={id}
      className={cn("hover:bg-accent", highlighted && "animate-message-highlight", className)}
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
        {reactions && reactions.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1">
            {reactions.map((emoji, i) => (
              <button
                key={`${emoji}-${i}`}
                type="button"
                onClick={() => onReaction?.(emoji)}
                className="text-sm bg-accent border rounded-full px-2 py-0.5 select-none hover:bg-destructive/10 hover:border-destructive/40 transition-colors"
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </ChatEventBody>
      <ChatEventHoverActions>
        <ReactionsPopover onReaction={onReaction}>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 [&_svg]:size-3.5"
            aria-label="Add reaction"
          >
            <SmilePlusIcon />
          </Button>
        </ReactionsPopover>
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
