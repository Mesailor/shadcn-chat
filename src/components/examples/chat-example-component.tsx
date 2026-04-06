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
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { ChatMessages } from "@/registry/new-york/chat/chat-messages";
import { PrimaryMessage } from "@/components/message-items/primary-message";
import { DateItem } from "@/components/message-items/date-item";
import { AdditionalMessage } from "@/components/message-items/additional-message";
import { PrimaryMessageSkeleton } from "@/components/message-items/primary-message-skeleton";
import { DateItemSkeleton } from "@/components/message-items/date-item-skeleton";
import { useCallback, useEffect, useRef, useState } from "react";
import { Event, getEvents, postEvent, reactToEvent } from "@/data/messages";

export function ChatExampleComponent() {
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [fetching, setFetching] = useState(false);
  const [messages, setMessages] = useState<Event[]>([]);

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
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <ChatHeaderButton className=" @2xl/chat:inline-flex hidden">
            <PhoneIcon />
          </ChatHeaderButton>
          <ChatHeaderButton className=" @2xl/chat:inline-flex hidden">
            <VideoIcon />
          </ChatHeaderButton>
          <ChatHeaderButton>
            <MoreHorizontalIcon />
          </ChatHeaderButton>
        </ChatHeaderAddon>
      </ChatHeader>

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
            return <PrimaryMessageSkeleton key={i} className="w-full mt-4" />;
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
                    avatarSrc={msg.sender.avatarUrl}
                    avatarAlt={msg.sender.username}
                    avatarFallback={msg.sender.name.slice(0, 2)}
                    senderName={msg.sender.name}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    status={msg.status}
                    reactions={msg.reactions}
                    onReaction={(emoji) => handleReaction(msg.id, emoji)}
                  />
                  <DateItem timestamp={msg.timestamp} className="my-4" />
                </Fragment>
              );
            }

            // If next item is same user, show additional
            if (msg.sender.id === msgs[i + 1]?.sender.id) {
              return (
                <AdditionalMessage
                  className="pt-1"
                  key={msg.id}
                  content={msg.content}
                  timestamp={msg.timestamp}
                  status={msg.status}
                  reactions={msg.reactions}
                  onReaction={(emoji) => handleReaction(msg.id, emoji)}
                />
              );
            }
            // Else, show primary
            else {
              return (
                <PrimaryMessage
                  className="mt-4"
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
                />
              );
            }
          })}
      </ChatMessages>

      <Toolbar onSubmit={handleSubmit} onScrollToBottom={scrollToBottom} />
    </Chat>
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
