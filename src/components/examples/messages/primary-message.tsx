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
import { ReactionsPopover } from "../reactions-popover";
import { MessageActionsDropdown } from "./message-actions-dropdown";

interface PrimaryMessageProps {
  avatarSrc?: string;
  avatarAlt?: string;
  avatarFallback?: string;
  senderName: string;
  content: EventContent;
  timestamp: number;
  status?: "sent" | "sending" | "failed";
  reactions?: string[];
  isEdited?: boolean;
  onReaction?: (emoji: string) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  className?: string;
  id?: string;
  highlighted?: boolean;
}

export function PrimaryMessage({
  avatarSrc,
  avatarAlt,
  avatarFallback,
  senderName,
  content,
  timestamp,
  status,
  reactions,
  isEdited,
  onReaction,
  onDelete,
  onEdit,
  className,
  id,
  highlighted,
}: PrimaryMessageProps) {
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
        {isEdited && (
          <span className="text-muted-foreground text-sm">(edited)</span>
        )}
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
