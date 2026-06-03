import { useEffect, useState } from "react";

export function useHighlightedMessageId() {
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (highlightedMessageId === null) return;
    const timer = setTimeout(() => setHighlightedMessageId(null), 3000);
    return () => clearTimeout(timer);
  }, [highlightedMessageId]);

  return {
    highlightedMessageId,
    setHighlightedMessageId,
  };
}
