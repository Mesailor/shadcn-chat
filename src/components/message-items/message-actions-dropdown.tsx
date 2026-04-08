import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PencilIcon, Trash2Icon } from "lucide-react";

interface MessageActionsDropdownProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function MessageActionsDropdown({
  children,
  onDelete,
  onEdit,
}: MessageActionsDropdownProps) {
  const hasAdditionalActions = !!onEdit || !!onDelete;

  if (!hasAdditionalActions) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
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
