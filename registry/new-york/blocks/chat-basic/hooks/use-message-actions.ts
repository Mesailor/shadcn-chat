import { useCallback, useState } from "react";
import {
  Event,
  EventContent,
  EventFile,
} from "@/registry/new-york/blocks/chat-basic/data/messages";

export const useMessageActions = ({
  setMessages,
  onDelete,
  onUpdate,
}: {
  setMessages: React.Dispatch<React.SetStateAction<Event[]>>;
  onDelete: (id: number) => Promise<number>;
  onUpdate: (
    id: number,
    data: { text?: string; uploadFiles?: File[]; editedFiles?: EventFile[] },
  ) => Promise<Event>;
}) => {
  const [messageToDelete, setMessageToDelete] = useState<Event | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [messageToEdit, setMessageToEdit] = useState<Event | null>(null);

  const handleOpenDeleteDialog = useCallback((event: Event) => {
    setMessageToDelete(event);
    setOpenDeleteDialog(true);
  }, []);

  const handleDelete = useCallback(async () => {
    setOpenDeleteDialog(false);
    if (!messageToDelete) return;

    try {
      const deletedMessageId = await onDelete(messageToDelete.id);
      setMessages((prev) => prev.filter((msg) => msg.id !== deletedMessageId));
      setMessageToDelete(null);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  }, [messageToDelete, onDelete, setMessages]);

  const handleStartEdit = useCallback((msg: Event) => {
    setMessageToEdit(msg);
  }, []);

  const handleSubmitEdit = useCallback(
    async (data: {
      text: string;
      uploadFiles: File[];
      editedFiles: EventFile[];
    }) => {
      if (!messageToEdit) return;

      const optimisticNewFiles: EventFile[] = data.uploadFiles.map((file) => ({
        url: URL.createObjectURL(file),
        fileName: file.name,
        mimeType: file.type,
      }));
      const optimisticAllFiles = [...data.editedFiles, ...optimisticNewFiles];
      const optimisticContent: EventContent = {
        type: "message",
        ...(data.text && { text: data.text }),
        ...(optimisticAllFiles.length > 0 && { files: optimisticAllFiles }),
      };

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageToEdit.id
            ? { ...msg, content: optimisticContent, isEdited: true }
            : msg,
        ),
      );
      setMessageToEdit(null);

      try {
        const updated = await onUpdate(messageToEdit.id, {
          text: data.text,
          uploadFiles: data.uploadFiles,
          editedFiles: data.editedFiles,
        });
        setMessages((prev) =>
          prev.map((msg) => (msg.id === updated.id ? updated : msg)),
        );
      } catch (error) {
        console.error("Failed to update message:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageToEdit.id ? messageToEdit : msg,
          ),
        );
      }
    },
    [messageToEdit, onUpdate, setMessages],
  );

  const handleCancelEdit = useCallback(() => {
    setMessageToEdit(null);
  }, []);

  return {
    messageToDelete,
    openDeleteDialog,
    setOpenDeleteDialog,
    messageToEdit,
    handleOpenDeleteDialog,
    handleDelete,
    handleStartEdit,
    handleSubmitEdit,
    handleCancelEdit,
  };
};
