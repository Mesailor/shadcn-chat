import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
  ChatEventHoverActions,
  ChatEventTime,
} from "@/registry/new-york/chat/chat-event";
import { cn } from "@/lib/utils";
import { EventContent } from "@/data/messages";
import { MessageContent } from "./message-content";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, SmilePlusIcon } from "lucide-react";
import { ReactionsPopover } from "./reactions-popover";
import { MessageActionsDropdown } from "./message-actions-dropdown";

interface AdditionalMessageProps {
  className?: string;
  content: EventContent;
  timestamp: number;
  status?: "sent" | "sending" | "failed";
  reactions?: string[];
  isEdited?: boolean;
  onReaction?: (emoji: string) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  id?: string;
  highlighted?: boolean;
}

export function AdditionalMessage({
  className,
  content,
  timestamp,
  status,
  reactions,
  isEdited,
  onReaction,
  onDelete,
  onEdit,
  id,
  highlighted,
}: AdditionalMessageProps) {
  return (
    <ChatEvent
      id={id}
      className={cn(
        "hover:bg-accent",
        highlighted && "animate-message-highlight",
        className,
      )}
    >
      <ChatEventAddon>
        <ChatEventTime
          timestamp={timestamp}
          format="time"
          className="text-right text-[8px] @md/chat:text-[10px] group-hover/event:visible invisible"
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
        {isEdited && (
          <span className="text-muted-foreground text-sm">(edited)</span>
        )}
        {reactions && reactions.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1">
            {reactions.map((emoji, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onReaction?.(emoji)}
                className="text-sm bg-accent border rounded-full px-2 py-0.5 select-none hover:bg-destructive/10 hover:border-destructive/40 transition-colors"
                aria-label={`Remove ${emoji} reaction`}
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
        <MessageActionsDropdown onEdit={onEdit} onDelete={onDelete}>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 [&_svg]:size-3.5"
            aria-label="More options"
          >
            <MoreHorizontalIcon />
          </Button>
        </MessageActionsDropdown>
      </ChatEventHoverActions>
    </ChatEvent>
  );
}
