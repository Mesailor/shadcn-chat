import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { DEFAULT_REACTIONS } from "@/components/examples/message-reactions/reactions-popover";

interface MessageActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReaction?: (emoji: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MessageActionsDialog({
  open,
  onOpenChange,
  onReaction,
  onEdit,
  onDelete,
}: MessageActionsDialogProps) {
  const hasActions = !!onEdit || !!onDelete;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="sr-only">Message actions</DialogTitle>
          <DialogDescription className="sr-only">
            React to this message or choose an action
          </DialogDescription>
        </DialogHeader>
        {onReaction && (
          <div className="flex gap-0.5 flex-wrap">
            {DEFAULT_REACTIONS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="icon"
                className="size-10 text-xl"
                onClick={() => {
                  onReaction(emoji);
                  onOpenChange(false);
                }}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
        {hasActions && (
          <>
            {onReaction && <div className="border-t" />}
            <div className="flex flex-col">
              {onEdit && (
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  onClick={() => {
                    onOpenChange(false);
                    onEdit();
                  }}
                >
                  <PencilIcon className="size-4" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  className="justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={() => {
                    onOpenChange(false);
                    onDelete();
                  }}
                >
                  <Trash2Icon className="size-4" />
                  Delete
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
