"use client";

import { Fragment } from "react/jsx-runtime";
import {
  CalendarDaysIcon,
  GiftIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  SquareChevronRightIcon,
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
  ChatToolbarButton,
  ChatToolbarTextarea,
} from "@/registry/new-york/chat/chat-toolbar";
import { ChatMessages } from "@/registry/new-york/chat/chat-messages";
import { Message, getMessages, postMessage } from "@/data/messages";
import { PrimaryMessage } from "@/components/message-items/primary-message";
import { DateItem } from "@/components/message-items/date-item";
import { AdditionalMessage } from "@/components/message-items/additional-message";
import { PrimaryMessageSkeleton } from "@/components/message-items/primary-message-skeleton";
import { DateItemSkeleton } from "@/components/message-items/date-item-skeleton";
import { useCallback, useEffect, useRef, useState } from "react";

export function ChatExampleComponent() {
  const [fetching, setFetching] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const usersHandleSendMessage = useCallback(async (content: string) => {
    return await postMessage(content);
  }, []);

  const handleSubmit = useCallback(async (content: string) => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return; // Don't send empty messages
    const tempId = Date.now(); // Temporary ID for optimistic UI
    const newMessage: Message = {
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
      content: trimmedContent,
    };
    setMessages((prev) => [newMessage, ...prev]);
    setInput("");
    // Scroll to top (newest message) when a new message is sent
    setTimeout(() => {
      chatMessagesRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
    const postedMessage = await usersHandleSendMessage(trimmedContent);
    // Replace the temporary message with the posted message
    setMessages((prev) =>
      prev.map((msg) => (msg.tempId === tempId ? postedMessage : msg)),
    );
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      setFetching(true);
      const fetchedMessages = await getMessages();
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
                  />
                  <DateItem timestamp={msg.timestamp} className="my-4" />
                </Fragment>
              );
            }

            // If next item is same user, show additional
            if (msg.sender.id === msgs[i + 1]?.sender.id) {
              return (
                <AdditionalMessage
                  key={msg.id}
                  content={msg.content}
                  timestamp={msg.timestamp}
                  status={msg.status}
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
                />
              );
            }
          })}
      </ChatMessages>

      <ChatToolbar>
        <ChatToolbarAddon align="inline-start">
          <ChatToolbarButton>
            <PlusIcon />
          </ChatToolbarButton>
        </ChatToolbarAddon>
        <ChatToolbarTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={() => {
            handleSubmit(input);
          }}
        />
        <ChatToolbarAddon align="inline-end">
          <ChatToolbarButton>
            <GiftIcon />
          </ChatToolbarButton>
          <ChatToolbarButton>
            <CalendarDaysIcon />
          </ChatToolbarButton>
          <ChatToolbarButton>
            <SquareChevronRightIcon />
          </ChatToolbarButton>
        </ChatToolbarAddon>
      </ChatToolbar>
    </Chat>
  );
}
