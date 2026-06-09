import { useState } from "react";
import { cn } from "@/lib/utils";
import { EventContent } from "@/data/messages";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
  ChatEventHoverActions,
  ChatEventHoverActionsButton,
  ChatEventTime,
} from "@/registry/new-york/chat/chat-event";
import { MessageContent } from "./message-content";
import { MessageActionsDropdown } from "@/components/examples/message-actions/message-actions-dropdown";
import { MessageActionsDialog } from "@/components/examples/message-actions/message-actions-dialog";
import { ReactionsPopover } from "@/components/examples/message-reactions/reactions-popover";
import { useLongPress } from "@/hooks/use-long-press";
import { MoreHorizontalIcon, SmilePlusIcon } from "lucide-react";

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
  const [actionsDialogOpen, setActionsDialogOpen] = useState(false);
  const longPressHandlers = useLongPress(() => setActionsDialogOpen(true));

  return (
    <>
    <ChatEvent
      id={id}
      className={cn(
        "hover:bg-accent",
        highlighted && "animate-message-highlight",
        className,
      )}
      {...longPressHandlers}
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
                key={`${emoji}-${i}`}
                type="button"
                onClick={() => onReaction?.(emoji)}
                className="text-sm bg-accent border rounded-full px-2 py-0.5 select-none hover:bg-destructive/10 hover:border-destructive/40 transition-colors"
                aria-label={`Toggle ${emoji} reaction`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </ChatEventBody>
      <ChatEventHoverActions>
        <ReactionsPopover onReaction={onReaction}>
          <ChatEventHoverActionsButton aria-label="Add reaction">
            <SmilePlusIcon />
          </ChatEventHoverActionsButton>
        </ReactionsPopover>
        <MessageActionsDropdown onEdit={onEdit} onDelete={onDelete}>
          <ChatEventHoverActionsButton aria-label="More options">
            <MoreHorizontalIcon />
          </ChatEventHoverActionsButton>
        </MessageActionsDropdown>
      </ChatEventHoverActions>
    </ChatEvent>
    <MessageActionsDialog
      open={actionsDialogOpen}
      onOpenChange={setActionsDialogOpen}
      onReaction={onReaction}
      onEdit={onEdit}
      onDelete={onDelete}
    />
    </>
  );
}
