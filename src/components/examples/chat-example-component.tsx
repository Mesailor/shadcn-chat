"use client";

import { Fragment } from "react/jsx-runtime";
import {
  BanIcon,
  CheckIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  SmileIcon,
  UserIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { ChatMessages } from "@/registry/new-york/chat/chat-messages";
import { PrimaryMessage } from "@/components/examples/message-items/primary-message";
import { MessagePreview } from "@/components/examples/message-items/message-preview";
import { DateItem } from "@/components/examples/message-items/date-item";
import { AdditionalMessage } from "@/components/examples/message-items/additional-message";
import { PrimaryMessageSkeleton } from "@/components/examples/message-items/primary-message-skeleton";
import { DateItemSkeleton } from "@/components/examples/message-items/date-item-skeleton";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CURRENT_USER,
  OTHER_USER,
  deleteEvent,
  Event,
  EventContent,
  EventFile,
  getEvents,
  postEvent,
  searchEvents,
  updateEvent,
} from "@/data/messages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessageReactions } from "@/hooks/examples/message-reactions";
import { mockAPI } from "@/data/examples/mock-api";

export function ChatExampleComponent() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [isChatWide, setIsChatWide] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [messages, setMessages] = useState<Event[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<"search" | "profile">(
    "search",
  );
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    number | null
  >(null);

  const [messageToDelete, setMessageToDelete] = useState<Event | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const [messageToEdit, setMessageToEdit] = useState<Event | null>(null);

  const { handleReaction } = useMessageReactions({
    setMessages,
    onReact: mockAPI.reactToEvent,
  });

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
    setSidebarView("search");
    setSidebarOpen(true);
    const results = await searchEvents(trimmed);
    setSearchResults(results);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setActiveSearchQuery("");
    setSearchResults([]);
  }, []);

  const handleSidebarClose = useCallback(() => {
    if (isChatWide && sidebarView === "search") {
      handleClearSearch();
    }
    setSidebarOpen(false);
  }, [isChatWide, sidebarView, handleClearSearch]);

  const openSearch = useCallback(() => {
    setSidebarView("search");
    setSidebarOpen(true);
  }, []);

  const openProfile = useCallback(() => {
    setSidebarView("profile");
    setSidebarOpen(true);
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

      // Client-side mapping only for the optimistic update
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

      // Optimistic update
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageToEdit.id
            ? { ...msg, content: optimisticContent, isEdited: true }
            : msg,
        ),
      );
      setMessageToEdit(null);

      try {
        const updated = await updateEvent(messageToEdit.id, {
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
    [messageToEdit],
  );

  const handleCancelEdit = useCallback(() => {
    setMessageToEdit(null);
  }, []);

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ChatHeaderButton>
                    <MoreHorizontalIcon />
                  </ChatHeaderButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!isChatWide && (
                    <>
                      <DropdownMenuItem onSelect={openSearch}>
                        <SearchIcon />
                        Search
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <PhoneIcon />
                        Start call
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <VideoIcon />
                        Start video
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onSelect={openProfile}>
                    <UserIcon />
                    Show profile
                  </DropdownMenuItem>
                  {isBlocked ? (
                    <DropdownMenuItem onSelect={() => setIsBlocked(false)}>
                      <BanIcon />
                      Unblock
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => setOpenBlockDialog(true)}
                    >
                      <BanIcon />
                      Block
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </ChatHeaderAddon>
          </ChatHeader>

          <SidebarProvider
            open={sidebarOpen}
            onOpenChange={(open) => {
              if (!open) handleSidebarClose();
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
                            isEdited={msg.isEdited}
                            onReaction={(emoji) =>
                              handleReaction(msg.id, emoji)
                            }
                            onDelete={
                              msg.sender.id === CURRENT_USER.id
                                ? () => handleOpenDeleteDialog(msg)
                                : undefined
                            }
                            onEdit={
                              msg.sender.id === CURRENT_USER.id
                                ? () => handleStartEdit(msg)
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
                          isEdited={msg.isEdited}
                          onReaction={(emoji) => handleReaction(msg.id, emoji)}
                          onDelete={
                            msg.sender.id === CURRENT_USER.id
                              ? () => handleOpenDeleteDialog(msg)
                              : undefined
                          }
                          onEdit={
                            msg.sender.id === CURRENT_USER.id
                              ? () => handleStartEdit(msg)
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
                          isEdited={msg.isEdited}
                          onReaction={(emoji) => handleReaction(msg.id, emoji)}
                          onDelete={
                            msg.sender.id === CURRENT_USER.id
                              ? () => handleOpenDeleteDialog(msg)
                              : undefined
                          }
                          onEdit={
                            msg.sender.id === CURRENT_USER.id
                              ? () => handleStartEdit(msg)
                              : undefined
                          }
                        />
                      );
                    }
                  })}
              </ChatMessages>

              <Toolbar
                key={messageToEdit?.id ?? "new"}
                onSubmit={handleSubmit}
                onScrollToBottom={scrollToBottom}
                messageToEdit={messageToEdit}
                onSubmitEdit={handleSubmitEdit}
                onCancelEdit={handleCancelEdit}
              />
            </SidebarInset>

            <ChatSidebar
              open={sidebarOpen}
              onClose={handleSidebarClose}
              title={sidebarView === "search" ? "Search" : "Profile"}
              isMobile={!isChatWide}
            >
              {sidebarView === "search" && (
                <SearchSidebarContent
                  query={activeSearchQuery}
                  results={searchResults}
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                  onSearch={handleSearch}
                  onResultClick={scrollToMessage}
                  onClose={handleSidebarClose}
                  isMobile={!isChatWide}
                />
              )}
              {sidebarView === "profile" && <ProfileSidebarContent />}
            </ChatSidebar>
          </SidebarProvider>
        </Chat>
      </div>
      <DeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        message={messageToDelete}
        onConfirm={handleDelete}
      />
      <BlockDialog
        open={openBlockDialog}
        onOpenChange={setOpenBlockDialog}
        onConfirm={() => {
          setIsBlocked(true);
          setOpenBlockDialog(false);
        }}
      />
    </>
  );
}

interface ToolbarProps {
  messageToEdit: Event | null;
  onSubmit: (data: { text: string; files: File[] }) => Promise<void> | void;
  onSubmitEdit: (data: {
    text: string;
    uploadFiles: File[];
    editedFiles: EventFile[];
  }) => Promise<void> | void;
  onCancelEdit: () => void;
  onScrollToBottom?: () => void;
}

function Toolbar({
  messageToEdit,
  onSubmit,
  onSubmitEdit,
  onCancelEdit,
  onScrollToBottom,
}: ToolbarProps) {
  const [input, setInput] = useState(messageToEdit?.content.text ?? "");
  const [files, setFiles] = useState<File[]>([]);

  const [filesToEdit, setFilesToEdit] = useState<EventFile[]>(
    messageToEdit?.content.files ?? [],
  );

  const [emojiOpen, setEmojiOpen] = useState(false);

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

  const handleSubmitEdit = useCallback(() => {
    const trimmedContent = input.trim();
    if (!trimmedContent && files.length === 0 && filesToEdit.length === 0) {
      return; // Don't submit empty messages
    }

    onSubmitEdit?.({
      text: trimmedContent,
      uploadFiles: files,
      editedFiles: filesToEdit,
    });

    setInput("");
    setFiles([]);
  }, [input, files, filesToEdit, onSubmitEdit]);

  return (
    <ChatToolbar>
      {(files.length > 0 || filesToEdit.length > 0) && (
        <ChatToolbarAddon
          align="block-start"
          className="mb-2 overflow-x-auto gap-2"
        >
          {files.map((file, i) => (
            <ChatToolbarAttachment
              key={file.name + i}
              fileName={file.name}
              onRemove={() =>
                setFiles((prev) => prev.filter((_, idx) => idx !== i))
              }
            />
          ))}
          {filesToEdit.map((file, i) => (
            <ChatToolbarAttachment
              key={file.fileName + i}
              fileName={file.fileName}
              onRemove={() =>
                setFilesToEdit((prev) => prev.filter((_, idx) => idx !== i))
              }
            />
          ))}
        </ChatToolbarAddon>
      )}

      <ChatToolbarAddon
        align="inline-start"
        className="order-2 flex-1 @2xl/chat:order-1 @2xl/chat:flex-none"
      >
        <ChatToolbarAttachmentButton
          onFilesSelected={(files) => {
            setFiles((prev) => [...prev, ...files]);
          }}
        >
          <PlusIcon />
        </ChatToolbarAttachmentButton>
        <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
          <PopoverTrigger asChild>
            <ChatToolbarButton>
              <SmileIcon />
            </ChatToolbarButton>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end" side="top">
            <EmojiPicker
              theme={Theme.AUTO}
              onEmojiClick={(emojiData: EmojiClickData) => {
                setInput((prev) => prev + emojiData.emoji);
                setEmojiOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </ChatToolbarAddon>

      <div className="w-full min-w-0 order-1 pb-1 @2xl/chat:pb-0 @2xl/chat:flex-1 @2xl/chat:w-auto @2xl/chat:order-2">
        <ChatToolbarTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={() => (messageToEdit ? handleSubmitEdit() : handleSubmit())}
        />
      </div>

      <ChatToolbarAddon align="inline-end">
        {messageToEdit && (
          <>
            <ChatToolbarButton onClick={onCancelEdit}>
              <XIcon />
            </ChatToolbarButton>
            <ChatToolbarButton
              variant="default"
              disabled={
                !input.trim() && files.length === 0 && filesToEdit.length === 0
              }
              onClick={() => handleSubmitEdit()}
            >
              <CheckIcon />
            </ChatToolbarButton>
          </>
        )}
        {!messageToEdit && (
          <ChatToolbarButton
            variant="default"
            disabled={!input.trim() && files.length === 0}
            onClick={() => handleSubmit()}
          >
            <SendIcon />
          </ChatToolbarButton>
        )}
      </ChatToolbarAddon>
    </ChatToolbar>
  );
}

function ChatSidebar({
  open,
  onClose,
  title,
  isMobile,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  isMobile: boolean;
  children: React.ReactNode;
}) {
  if (isMobile) {
    return (
      <Sheet
        open={open}
        onOpenChange={(o) => {
          if (!o) onClose();
        }}
      >
        <SheetContent side="right" className="flex flex-col gap-0 p-0">
          <SheetHeader className="border-b px-4 py-3 flex-row items-center space-y-0">
            <SheetTitle className="text-sm font-medium">{title}</SheetTitle>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col border-l bg-sidebar text-sidebar-foreground overflow-hidden",
        open ? "@3xl/chat:w-96 @2xl/chat:w-80 w-0" : "w-0",
      )}
    >
      <SidebarHeader className="border-b flex-row items-center justify-between">
        <span className="text-sm font-medium truncate">{title}</span>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <XIcon />
        </Button>
      </SidebarHeader>
      <SidebarContent className="gap-2">{children}</SidebarContent>
    </div>
  );
}

function SearchSidebarContent({
  query,
  results,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onResultClick,
  onClose,
  isMobile,
}: {
  query: string;
  results: Event[];
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: (query: string) => void;
  onResultClick: (id: number) => void;
  onClose: () => void;
  isMobile: boolean;
}) {
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

function ProfileSidebarContent() {
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <Avatar className="size-20">
        <AvatarImage src={OTHER_USER.avatarUrl} alt={OTHER_USER.username} />
        <AvatarFallback>{OTHER_USER.name.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className="font-medium">{OTHER_USER.name}</p>
        <p className="text-sm text-muted-foreground">{OTHER_USER.username}</p>
      </div>
    </div>
  );
}

function BlockDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block user</DialogTitle>
          <DialogDescription>
            Are you sure you want to block this user? They will no longer be
            able to send you messages.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
