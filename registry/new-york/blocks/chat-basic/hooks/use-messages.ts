import { Event } from "@/registry/new-york/blocks/chat-basic/data/messages";
import { useEffect, useState } from "react";

export const useMessages = ({
  onFetch,
}: {
  onFetch: () => Promise<Event[]>;
}) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Event[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const fetchedMessages = await onFetch();
        setMessages(fetchedMessages);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [onFetch]);

  return { loading, messages, setMessages };
};
