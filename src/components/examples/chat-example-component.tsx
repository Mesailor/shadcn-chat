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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Chat } from "@/components/chat/chat";
import {
  ChatHeader,
  ChatHeaderMain,
  ChatHeaderEnd,
  ChatHeaderStart,
} from "@/components/chat/chat-header";
import {
  ChatToolbar,
  ChatToolbarAddonEnd,
  ChatToolbarAddonStart,
  ChatToolbarTextarea,
} from "@/components/chat/chat-toolbar";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MESSAGES } from "@/data/messages";
import { PrimaryMessage } from "@/components/message-items/primary-message";
import { DateItem } from "@/components/message-items/date-item";
import { AdditionalMessage } from "@/components/message-items/additional-message";

export function ChatExampleComponent() {
  return (
    <Chat>
      <ChatHeader className="border-b">
        <ChatHeaderStart>
          <Avatar className="rounded-full size-6">
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <span className="font-medium">Evil Rabbit</span>
        </ChatHeaderStart>
        <ChatHeaderMain>
          <span className="text-sm font-semibold">AKA</span>
          <span className="text-sm font-medium">Chocolate Bunny</span>
        </ChatHeaderMain>
        <ChatHeaderEnd>
          <InputGroup className="@2xl/chat:flex hidden">
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <Button
            variant="ghost"
            className="size-8 @2xl/chat:inline-flex hidden"
          >
            <PhoneIcon />
          </Button>
          <Button
            variant="ghost"
            className="size-8 @2xl/chat:inline-flex hidden"
          >
            <VideoIcon />
          </Button>
          <Button variant="ghost" className="size-8">
            <MoreHorizontalIcon />
          </Button>
        </ChatHeaderEnd>
      </ChatHeader>

      <ChatMessages className="scrollbar-hidden">
        {MESSAGES.map((msg, i, msgs) => {
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
              />
            );
          }
        })}
      </ChatMessages>

      <ChatToolbar>
        <ChatToolbarAddonStart>
          <Button variant="ghost" className="size-8 @md/chat:size-9">
            <PlusIcon className="size-5 @md/chat:size-6 stroke-[1.7px]" />
          </Button>
        </ChatToolbarAddonStart>
        <ChatToolbarTextarea />
        <ChatToolbarAddonEnd>
          <Button variant="ghost" className="size-8 @md/chat:size-9">
            <GiftIcon className="size-4 @md/chat:size-5 stroke-[1.7px]" />
          </Button>
          <Button variant="ghost" className="size-8 @md/chat:size-9">
            <CalendarDaysIcon className="size-4 @md/chat:size-5 stroke-[1.7px]" />
          </Button>
          <Button variant="ghost" className="size-8 @md/chat:size-9">
            <SquareChevronRightIcon className="size-4 @md/chat:size-5 stroke-[1.7px]" />
          </Button>
        </ChatToolbarAddonEnd>
      </ChatToolbar>
    </Chat>
  );
}
