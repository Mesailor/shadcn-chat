"use client";

import { useCallback, useRef, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import {
  Event,
  EventFile,
} from "@/registry/new-york/blocks/chat-basic/data/messages";
import { mockAPI } from "@/registry/new-york/blocks/chat-basic/data/mock-api";
import {
  CURRENT_USER,
  OTHER_USER,
} from "@/registry/new-york/blocks/chat-basic/data/users";
import { useMessages } from "@/registry/new-york/blocks/chat-basic/hooks/use-messages";
import { useMessageReactions } from "@/registry/new-york/blocks/chat-basic/hooks/use-message-reactions";
import { useMessageSearch } from "@/registry/new-york/blocks/chat-basic/hooks/use-message-search";
import { useMessageActions } from "@/registry/new-york/blocks/chat-basic/hooks/use-message-actions";
import { useProfile } from "@/registry/new-york/blocks/chat-basic/hooks/use-profile";
import { useChatSidebar } from "@/registry/new-york/blocks/chat-basic/hooks/use-chat-sidebar";
import { useIsWider } from "@/registry/new-york/blocks/chat-basic/hooks/use-is-wider";
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
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
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
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { ChatMessages } from "@/registry/new-york/chat/chat-messages";
import { PrimaryMessage } from "@/registry/new-york/blocks/chat-basic/components/message-items/primary-message";
import { DateItem } from "@/registry/new-york/blocks/chat-basic/components/message-items/date-item";
import { AdditionalMessage } from "@/registry/new-york/blocks/chat-basic/components/message-items/additional-message";
import { PrimaryMessageSkeleton } from "@/registry/new-york/blocks/chat-basic/components/message-items/primary-message-skeleton";
import { DateItemSkeleton } from "@/registry/new-york/blocks/chat-basic/components/message-items/date-item-skeleton";
import { SearchSidebarContent } from "@/registry/new-york/blocks/chat-basic/components/message-search/search-sidebar-content";
import { DeleteDialog } from "@/registry/new-york/blocks/chat-basic/components/message-actions/delete-dialog";
import { ProfileSidebarContent } from "@/registry/new-york/blocks/chat-basic/components/profile/profile-sidebar-content";
import { BlockDialog } from "@/registry/new-york/blocks/chat-basic/components/profile/block-dialog";
import { ChatSidebar } from "@/registry/new-york/blocks/chat-basic/components/chat-sidebar/chat-sidebar";

export default function ChatExampleComponent() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const isChatWide = useIsWider(chatContainerRef, 672);

  const { loading, messages, setMessages } = useMessages({
    onFetch: mockAPI.getEvents,
  });

  const { sidebarOpen, setSidebarOpen, sidebarView, setSidebarView } =
    useChatSidebar();

  const { handleReaction } = useMessageReactions({
    setMessages,
    onReact: mockAPI.reactToEvent,
  });

  const {
    searchQuery,
    setSearchQuery,
    activeSearchQuery,
    searchResults,
    highlightedMessageId,
    setHighlightedMessageId,
    handleSearch,
    handleClearSearch,
    openSearch,
  } = useMessageSearch({
    setSidebarOpen,
    setSidebarView,
    onSearch: mockAPI.searchEvents,
  });

  const {
    openBlockDialog,
    setOpenBlockDialog,
    isBlocked,
    openProfile,
    handleBlock,
    handleUnblock,
  } = useProfile({
    setSidebarOpen,
    setSidebarView,
    onBlock: mockAPI.blockUser,
    onUnblock: mockAPI.unblockUser,
  });

  const {
    messageToDelete,
    openDeleteDialog,
    setOpenDeleteDialog,
    messageToEdit,
    handleOpenDeleteDialog,
    handleDelete,
    handleStartEdit,
    handleSubmitEdit,
    handleCancelEdit,
  } = useMessageActions({
    setMessages,
    onDelete: mockAPI.deleteEvent,
    onUpdate: mockAPI.updateEvent,
  });

  const handleSubmit = useCallback(
    async (submitData: { text: string; files: File[] }) => {
      const tempId = Date.now();
      const newMessage: Event = {
        id: tempId,
        status: "sending",
        tempId: tempId,
        sender: CURRENT_USER,
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

      const postedMessage = await mockAPI.postEvent({
        text: submitData.text,
        files: submitData.files,
      });
      setMessages((prev) =>
        prev.map((msg) => (msg.tempId === tempId ? postedMessage : msg)),
      );
    },
    [setMessages],
  );

  const scrollToBottom = useCallback(() => {
    chatMessagesRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToMessage = useCallback(
    (id: number) => {
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
    },
    [setHighlightedMessageId],
  );

  const handleSidebarClose = useCallback(() => {
    if (isChatWide && sidebarView === "search") {
      handleClearSearch();
    }
    setSidebarOpen(false);
  }, [isChatWide, sidebarView, handleClearSearch, setSidebarOpen]);

  return (
    <>
      <Chat ref={chatContainerRef} className="h-svh">
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
            {isBlocked && <Badge variant="destructive">Blocked</Badge>}
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
                  <DropdownMenuItem
                    onSelect={() => handleUnblock(OTHER_USER.id)}
                  >
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
              {loading &&
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

              {!loading &&
                messages.map((msg, i, msgs) => {
                  const isOwnMessage = msg.sender.id === CURRENT_USER.id;
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
                          onReaction={(emoji) => handleReaction(msg.id, emoji)}
                          onDelete={
                            isOwnMessage
                              ? () => handleOpenDeleteDialog(msg)
                              : undefined
                          }
                          onEdit={
                            isOwnMessage
                              ? () => handleStartEdit(msg)
                              : undefined
                          }
                        />
                        <DateItem timestamp={msg.timestamp} className="my-4" />
                      </Fragment>
                    );
                  }

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
                          isOwnMessage
                            ? () => handleOpenDeleteDialog(msg)
                            : undefined
                        }
                        onEdit={
                          isOwnMessage ? () => handleStartEdit(msg) : undefined
                        }
                      />
                    );
                  } else {
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
                          isOwnMessage
                            ? () => handleOpenDeleteDialog(msg)
                            : undefined
                        }
                        onEdit={
                          isOwnMessage ? () => handleStartEdit(msg) : undefined
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
      <DeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        message={messageToDelete}
        onConfirm={handleDelete}
      />
      <BlockDialog
        open={openBlockDialog}
        onOpenChange={setOpenBlockDialog}
        onConfirm={() => handleBlock(OTHER_USER.id)}
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
    if (!trimmedContent && files.length === 0) return;

    onSubmit?.({
      text: trimmedContent,
      files,
    });

    setInput("");
    setFiles([]);
    setTimeout(() => {
      onScrollToBottom?.();
    });
  }, [input, files, onSubmit, onScrollToBottom]);

  const handleSubmitEdit = useCallback(() => {
    const trimmedContent = input.trim();
    if (!trimmedContent && files.length === 0 && filesToEdit.length === 0) {
      return;
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
          <PopoverContent className="w-auto p-0" align="start" side="top">
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
