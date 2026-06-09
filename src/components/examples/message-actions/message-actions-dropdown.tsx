import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopyIcon, PencilIcon, Trash2Icon } from "lucide-react";

interface MessageActionsDropdownProps {
  children: React.ReactNode;
  onCopy?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function MessageActionsDropdown({
  children,
  onCopy,
  onDelete,
  onEdit,
}: MessageActionsDropdownProps) {
  const hasAdditionalActions = !!onCopy || !!onEdit || !!onDelete;

  if (!hasAdditionalActions) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
        {onCopy && (
          <DropdownMenuItem onSelect={onCopy}>
            <CopyIcon />
            Copy
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onSelect={onEdit}>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem variant="destructive" onSelect={onDelete}>
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
