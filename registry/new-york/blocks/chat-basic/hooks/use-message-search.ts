import { Event } from "@/registry/new-york/blocks/chat-basic/data/messages";
import { useCallback, useRef, useState } from "react";

export const useMessageSearch = ({
  setSidebarOpen,
  setSidebarView,
  onSearch,
}: {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarView: React.Dispatch<React.SetStateAction<"search" | "profile">>;
  onSearch: (query: string) => Promise<Event[]>;
}) => {
  const searchIdRef = useRef(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Event[]>([]);

  const handleSearch = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      const currentSearchId = ++searchIdRef.current;
      setActiveSearchQuery(trimmed);
      setSidebarView("search");
      setSidebarOpen(true);
      try {
        const results = await onSearch(trimmed);
        // Only update if this is still the most recent search
        if (currentSearchId === searchIdRef.current) {
          setSearchResults(results);
        }
      } catch (error) {
        console.error("Search failed:", error);
        if (currentSearchId === searchIdRef.current) {
          setSearchResults([]);
        }
      }
    },
    [setSidebarOpen, setSidebarView, onSearch],
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setActiveSearchQuery("");
    setSearchResults([]);
  }, []);

  const openSearch = useCallback(() => {
    setSidebarView("search");
    setSidebarOpen(true);
  }, [setSidebarView, setSidebarOpen]);

  return {
    searchQuery,
    setSearchQuery,
    activeSearchQuery,
    searchResults,
    handleSearch,
    handleClearSearch,
    openSearch,
  };
};
