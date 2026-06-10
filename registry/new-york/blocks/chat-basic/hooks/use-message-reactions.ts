import { Event } from "@/registry/new-york/blocks/chat-basic/data/messages";
import { useCallback } from "react";

export const useMessageReactions = ({
  setMessages,
  onReact,
}: {
  setMessages: React.Dispatch<React.SetStateAction<Event[]>>;
  onReact: (eventId: number, emoji: string) => Promise<Event>;
}) => {
  const handleReaction = useCallback(
    async (eventId: number, emoji: string) => {
      try {
        const updated = await onReact(eventId, emoji);
        setMessages((prev) =>
          prev.map((msg) => (msg.id === eventId ? updated : msg)),
        );
      } catch (error) {
        console.error("Failed to add reaction:", error);
        // Optionally show a toast or other user feedback
      }
    },
    [setMessages, onReact],
  );

  return { handleReaction };
};
