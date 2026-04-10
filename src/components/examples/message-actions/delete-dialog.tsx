import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessagePreview } from "@/components/examples/message-items/message-preview";
import { Event } from "@/data/messages";

export function DeleteDialog({
  open,
  onOpenChange,
  message,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: Event | null;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open && !!message} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete message</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this message?
          </DialogDescription>
        </DialogHeader>
        {message && (
          <MessagePreview
            className="p-1 border rounded-md"
            key={message.id}
            avatarSrc={message.sender.avatarUrl}
            avatarAlt={message.sender.username}
            avatarFallback={message.sender.name.slice(0, 2)}
            senderName={message.sender.name}
            content={message.content}
            timestamp={message.timestamp}
          />
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
