"use client";

import { MessagePreview } from "@/components/examples/message-items/message-preview";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Event } from "@/data/messages";
import { SearchIcon } from "lucide-react";

export interface SearchSidebarContentProps {
  query: string;
  results: Event[];
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: (query: string) => void;
  onResultClick: (id: number) => void;
  onClose: () => void;
  isMobile: boolean;
}

export function SearchSidebarContent({
  query,
  results,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onResultClick,
  onClose,
  isMobile,
}: SearchSidebarContentProps) {
  const label = `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`;

  const resultItems = results.map((msg) => (
    <MessagePreview
      className="p-1 hover:bg-accent cursor-pointer border rounded-md"
      key={msg.id}
      avatarSrc={msg.sender.avatarUrl}
      avatarAlt={msg.sender.username}
      avatarFallback={msg.sender.name.slice(0, 2)}
      senderName={msg.sender.name}
      content={msg.content}
      timestamp={msg.timestamp}
      onClick={() => {
        onResultClick(msg.id);
        if (isMobile) onClose();
      }}
    />
  ));

  const emptyState = (
    <p className="text-sm text-muted-foreground text-center py-8">
      No messages found.
    </p>
  );

  if (isMobile) {
    return (
      <>
        <div className="border-b p-3 pr-12">
          <InputGroup>
            <InputGroupInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSearch(searchQuery);
                }
              }}
              autoFocus
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
        {query && (
          <div className="border-b px-4 py-2 text-sm text-muted-foreground">
            {label}
          </div>
        )}
        <div className="overflow-y-auto flex-1 space-y-2 p-2">
          {query && (results.length === 0 ? emptyState : resultItems)}
        </div>
      </>
    );
  }

  return (
    <>
      {query && (
        <div className="border-b px-2 py-2 text-sm text-muted-foreground flex items-center justify-between gap-2">
          <span className="truncate">{label}</span>
        </div>
      )}
      <div className="overflow-y-auto flex-1 space-y-2 px-2">
        {query && (results.length === 0 ? emptyState : resultItems)}
      </div>
    </>
  );
}
