"use client";

import { Fragment } from "react/jsx-runtime";
import {
  CalendarDaysIcon,
  GiftIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Chat } from "@/registry/new-york/chat/chat";
import {
  ChatHeader,
  ChatHeaderAddon,
  ChatHeaderAvatar,
  ChatHeaderButton,
  ChatHeaderMain,
} from "@/registry/new-york/chat/chat-header";
import {
  ChatToolbar,
  ChatToolbarAddon,
  ChatToolbarAttachment,
  ChatToolbarAttachmentButton,
  ChatToolbarButton,
  ChatToolbarTextarea,
} from "@/registry/new-york/chat/chat-toolbar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChatMessages } from "@/registry/new-york/chat/chat-messages";
import { PrimaryMessage } from "@/components/message-items/primary-message";
import { MessagePreview } from "@/components/message-items/message-preview";
import { DateItem } from "@/components/message-items/date-item";
import { AdditionalMessage } from "@/components/message-items/additional-message";
import { PrimaryMessageSkeleton } from "@/components/message-items/primary-message-skeleton";
import { DateItemSkeleton } from "@/components/message-items/date-item-skeleton";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AUTHED_USER_ID,
  deleteEvent,
  Event,
  getEvents,
  postEvent,
  reactToEvent,
  searchEvents,
} from "@/data/messages";

export function ChatExampleComponent() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [isChatWide, setIsChatWide] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [messages, setMessages] = useState<Event[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    number | null
  >(null);

  const [messageToDelete, setMessageToDelete] = useState<Event | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleSubmit = useCallback(
    async (submitData: { text: string; files: File[] }) => {
      // Optimistically add the new message to the UI with a temporary ID and "sending" status
      const tempId = Date.now();
      const newMessage: Event = {
        id: tempId,
        status: "sending",
        tempId: tempId,
        sender: {
          id: "johndoe-user-id",
          name: "John Doe",
          avatarUrl:
            "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_13.png",
          username: "@johndoe",
        },
        timestamp: Date.now(),
        content: {
          type: "message",
          ...(submitData.text && { text: submitData.text }),
          ...(submitData.files.length > 0 && {
            files: submitData.files.map((file) => ({
              url: URL.createObjectURL(file),
              fileName: file.name,
              mimeType: file.type,
            })),
          }),
        },
      };
      setMessages((prev) => [newMessage, ...prev]);

      // Replace the temporary message with the posted message
      const postedMessage = await postEvent({
        text: submitData.text,
        files: submitData.files,
      });
      setMessages((prev) =>
        prev.map((msg) => (msg.tempId === tempId ? postedMessage : msg)),
      );
    },
    [],
  );

  const handleReaction = useCallback(async (eventId: number, emoji: string) => {
    try {
      const updated = await reactToEvent(eventId, emoji);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === eventId ? updated : msg)),
      );
    } catch (error) {
      console.error("Failed to add reaction:", error);
      // Optionally show a toast or other user feedback
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    chatMessagesRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToMessage = useCallback((id: number) => {
    const container = chatMessagesRef.current;
    const element = document.getElementById(`message-${id}`);
    if (!container || !element) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    container.scrollTo({
      top:
        container.scrollTop +
        elementRect.top -
        containerRect.top -
        containerRect.height / 2 +
        elementRect.height / 2,
      behavior: "smooth",
    });

    setHighlightedMessageId(id);
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setActiveSearchQuery(trimmed);
    setSearchOpen(true);
    const results = await searchEvents(trimmed);
    setSearchResults(results);
  }, []);

  const handleSearchClose = useCallback(() => {
    setSearchOpen(false);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setActiveSearchQuery("");
    setSearchResults([]);
  }, []);

  const handleOpenDeleteDialog = useCallback((event: Event) => {
    setMessageToDelete(event);
    setOpenDeleteDialog(true);
  }, []);

  const handleDelete = useCallback(async () => {
    setOpenDeleteDialog(false);
    if (!messageToDelete) return;

    try {
      const deletedMessageId = await deleteEvent(messageToDelete.id);
      setMessages((prev) => prev.filter((msg) => msg.id !== deletedMessageId));
      setMessageToDelete(null);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  }, [messageToDelete]);

  useEffect(() => {
    if (highlightedMessageId === null) return;
    const timer = setTimeout(() => setHighlightedMessageId(null), 3000);
    return () => clearTimeout(timer);
  }, [highlightedMessageId]);

  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setIsChatWide(entry.contentRect.width >= 672);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      setFetching(true);
      const fetchedMessages = await getEvents();
      setMessages(fetchedMessages);
      setFetching(false);
    };
    fetchMessages();
  }, []);

  return (
    <>
      <div ref={chatContainerRef} className="h-full">
        <Chat>
          <ChatHeader className="border-b">
            <ChatHeaderAddon>
              <ChatHeaderAvatar
                src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png"
                alt="@annsmith"
                fallback="AS"
              />
            </ChatHeaderAddon>
            <ChatHeaderMain>
              <span className="font-medium">Ann Smith</span>
              <span className="text-sm font-semibold">AKA</span>
              <span className="flex-1 grid">
                <span className="text-sm font-medium truncate">
                  Front-end developer
                </span>
              </span>
            </ChatHeaderMain>
            <ChatHeaderAddon>
              <InputGroup className="@2xl/chat:flex hidden">
                <InputGroupInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch(searchQuery);
                    }
                  }}
                />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>
              <ChatHeaderButton className="@2xl/chat:inline-flex hidden">
                <PhoneIcon />
              </ChatHeaderButton>
              <ChatHeaderButton className="@2xl/chat:inline-flex hidden">
                <VideoIcon />
              </ChatHeaderButton>
              <ChatHeaderButton>
                <MoreHorizontalIcon />
              </ChatHeaderButton>
            </ChatHeaderAddon>
          </ChatHeader>

          <SidebarProvider
            open={searchOpen}
            onOpenChange={(open) => {
              if (!open) handleSearchClose();
            }}
            className="flex-1 min-h-0"
          >
            <SidebarInset className="min-h-0 overflow-hidden">
              <ChatMessages ref={chatMessagesRef} className="scrollbar-hidden">
                {fetching &&
                  Array.from({ length: 20 }).map((_, i) => {
                    if (i % 6 === 0) {
                      return (
                        <Fragment key={i}>
                          <PrimaryMessageSkeleton className="w-full" />
                          <DateItemSkeleton className="my-4" />
                        </Fragment>
                      );
                    }
                    return (
                      <PrimaryMessageSkeleton key={i} className="w-full mt-4" />
                    );
                  })}

                {!fetching &&
                  messages.map((msg, i, msgs) => {
                    // If date changed, show date item
                    if (
                      new Date(msg.timestamp).toDateString() !==
                      new Date(msgs[i + 1]?.timestamp).toDateString()
                    ) {
                      return (
                        <Fragment key={msg.id}>
                          <PrimaryMessage
                            id={`message-${msg.id}`}
                            highlighted={highlightedMessageId === msg.id}
                            avatarSrc={msg.sender.avatarUrl}
                            avatarAlt={msg.sender.username}
                            avatarFallback={msg.sender.name.slice(0, 2)}
                            senderName={msg.sender.name}
                            content={msg.content}
                            timestamp={msg.timestamp}
                            status={msg.status}
                            reactions={msg.reactions}
                            onReaction={(emoji) =>
                              handleReaction(msg.id, emoji)
                            }
                            onDelete={
                              msg.sender.id === AUTHED_USER_ID
                                ? () => handleOpenDeleteDialog(msg)
                                : undefined
                            }
                          />
                          <DateItem
                            timestamp={msg.timestamp}
                            className="my-4"
                          />
                        </Fragment>
                      );
                    }

                    // If next item is same user, show additional
                    if (msg.sender.id === msgs[i + 1]?.sender.id) {
                      return (
                        <AdditionalMessage
                          id={`message-${msg.id}`}
                          className="pt-1"
                          highlighted={highlightedMessageId === msg.id}
                          key={msg.id}
                          content={msg.content}
                          timestamp={msg.timestamp}
                          status={msg.status}
                          reactions={msg.reactions}
                          onReaction={(emoji) => handleReaction(msg.id, emoji)}
                          onDelete={
                            msg.sender.id === AUTHED_USER_ID
                              ? () => handleOpenDeleteDialog(msg)
                              : undefined
                          }
                        />
                      );
                    }
                    // Else, show primary
                    else {
                      return (
                        <PrimaryMessage
                          id={`message-${msg.id}`}
                          className="mt-4"
                          highlighted={highlightedMessageId === msg.id}
                          key={msg.id}
                          avatarSrc={msg.sender.avatarUrl}
                          avatarAlt={msg.sender.username}
                          avatarFallback={msg.sender.name.slice(0, 2)}
                          senderName={msg.sender.name}
                          content={msg.content}
                          timestamp={msg.timestamp}
                          status={msg.status}
                          reactions={msg.reactions}
                          onReaction={(emoji) => handleReaction(msg.id, emoji)}
                          onDelete={
                            msg.sender.id === AUTHED_USER_ID
                              ? () => handleOpenDeleteDialog(msg)
                              : undefined
                          }
                        />
                      );
                    }
                  })}
              </ChatMessages>

              <Toolbar
                onSubmit={handleSubmit}
                onScrollToBottom={scrollToBottom}
              />
            </SidebarInset>

            <SearchSidebar
              open={searchOpen}
              onClose={handleSearchClose}
              onClear={handleClearSearch}
              query={activeSearchQuery}
              results={searchResults}
              useDialog={!isChatWide}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSearch={handleSearch}
              onResultClick={scrollToMessage}
            />
          </SidebarProvider>
        </Chat>
      </div>
      <DeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        message={messageToDelete}
        onConfirm={handleDelete}
      />
    </>
  );
}

interface ToolbarProps {
  onSubmit: (data: { text: string; files: File[] }) => Promise<void> | void;
  onScrollToBottom?: () => void;
}

function Toolbar({ onSubmit, onScrollToBottom }: ToolbarProps) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = useCallback(() => {
    const trimmedContent = input.trim();
    if (!trimmedContent && files.length === 0) return; // Don't submit empty messages

    onSubmit?.({
      text: trimmedContent,
      files,
    });

    setInput("");
    setFiles([]);
    // Scroll to top (newest message) when a new message is sent
    setTimeout(() => {
      onScrollToBottom?.();
    });
  }, [input, files, onSubmit, onScrollToBottom]);

  return (
    <ChatToolbar>
      {files.length > 0 && (
        <ChatToolbarAddon
          align="block-start"
          className="mb-2 overflow-x-auto gap-2"
        >
          {files.map((file, i) => (
            <ChatToolbarAttachment
              key={i}
              file={file}
              onRemove={() =>
                setFiles((prev) => prev.filter((_, idx) => idx !== i))
              }
            />
          ))}
        </ChatToolbarAddon>
      )}

      <ChatToolbarAddon align="inline-start">
        <ChatToolbarAttachmentButton
          onFilesSelected={(files) => {
            setFiles((prev) => [...prev, ...files]);
          }}
        >
          <PlusIcon />
        </ChatToolbarAttachmentButton>
      </ChatToolbarAddon>

      <ChatToolbarTextarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={() => handleSubmit()}
      />

      <ChatToolbarAddon align="inline-end">
        <ChatToolbarButton>
          <GiftIcon />
        </ChatToolbarButton>
        <ChatToolbarButton>
          <CalendarDaysIcon />
        </ChatToolbarButton>
        <ChatToolbarButton onClick={() => handleSubmit()}>
          <SendIcon />
        </ChatToolbarButton>
      </ChatToolbarAddon>
    </ChatToolbar>
  );
}

interface SearchSidebarProps {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  query: string;
  results: Event[];
  useDialog: boolean;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: (query: string) => void;
  onResultClick: (id: number) => void;
}

function SearchSidebar({
  open,
  onClose,
  onClear,
  query,
  results,
  useDialog,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onResultClick,
}: SearchSidebarProps) {
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
        if (useDialog) onClose();
      }}
    />
  ));

  const emptyState = (
    <p className="text-sm text-muted-foreground text-center py-8">
      No messages found.
    </p>
  );

  if (useDialog) {
    return (
      <Sheet
        open={open}
        onOpenChange={(o) => {
          if (!o) onClose();
        }}
      >
        <SheetContent side="right" className="flex flex-col gap-0 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Search messages</SheetTitle>
          </SheetHeader>
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
        </SheetContent>
      </Sheet>
    );
  }

  const content = results.length === 0 ? emptyState : resultItems;

  return (
    <div
      className={cn(
        "flex flex-col border-l bg-sidebar text-sidebar-foreground overflow-hidden",
        open ? "@3xl/chat:w-96 @2xl/chat:w-72 w-0" : "w-0",
      )}
    >
      <SidebarHeader className="border-b flex-row items-center justify-between">
        <span className="text-sm font-medium truncate">{label}</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            onClear();
            onClose();
          }}
        >
          <XIcon />
        </Button>
      </SidebarHeader>
      <SidebarContent className="gap-2 p-2">{content}</SidebarContent>
    </div>
  );
}

function DeleteDialog({
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
