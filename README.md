# Shadcn Chat Component

A customizable chat component built with shadcn/ui and React.

## Demo

Checkout a [live demo](https://shadcn-chat.vercel.app)

## Installation

### Prerequisites

The chat component is compatible with any environment that supports [React](https://react.dev/learn) and has [shadcn/ui](https://ui.shadcn.com/docs) configured.

This guide assumes you are already familiar with both of these technologies. If you are not, please review their documentation first.

### Quick Start

1. **Install shadcn/ui:** If you haven't already, initialize shadcn/ui in your project by following the [official installation guide](https://ui.shadcn.com/docs/installation).

2. **Install Dependencies:** Ensure you have the necessary primitives installed.

```bash
pnpm dlx shadcn@latest add textarea
```

3. **Copy the Chat Component:** Copy the chat component files from the [repository](https://github.com/Mesailor/shadcn-chat/tree/main/src/components/chat) into your project's components directory (e.g., `@/components/chat`).

4. **Import and Use:** Import the component into your page and use it as needed.

## Usage Examples

### Chat

The root container component that establishes the chat layout structure with container queries and flex column layout for header, messages, and toolbar sections.

```tsx
<Chat>
  <ChatHeader>{/* Header Content */}</ChatHeader>

  <ChatMessages>{/* Messages Content */}</ChatMessages>

  <ChatToolbar>{/* Toolbar Content */}</ChatToolbar>
</Chat>
```

### Chat Header

A sticky header component with three sections (Start, Main, End) for displaying chat participant info, status, search, and action buttons.

```tsx
<ChatHeader className="border-b">
  <ChatHeaderStart>
    <Avatar className="rounded-full size-6">
      <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
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
    <Button variant="ghost" className="size-8 @2xl/chat:inline-flex hidden">
      <PhoneIcon />
    </Button>
    <Button variant="ghost" className="size-8 @2xl/chat:inline-flex hidden">
      <VideoIcon />
    </Button>
    <Button variant="ghost" className="size-8">
      <MoreHorizontalIcon />
    </Button>
  </ChatHeaderEnd>
</ChatHeader>
```

### Chat Messages

A scrollable flex container with reverse column direction that displays chat messages from bottom to top, automatically handling overflow.

```tsx
<ChatMessages>
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
```

### Chat Event

A flexible message row component with Addon (for avatar/timestamp) and Body sections, supporting any message or event in the chat.

#### Primary Message

```tsx
import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
  ChatEventDescription,
  ChatEventTitle,
} from "@/components/ui/chat-event";

export function PrimaryMessage({
  avatarSrc,
  avatarAlt,
  avatarFallback,
  senderName,
  content,
  timestamp,
  className,
}: {
  avatarSrc?: string;
  avatarAlt?: string;
  avatarFallback?: string;
  senderName: string;
  content: ReactNode;
  timestamp: number;
  className?: string;
}) {
  return (
    <ChatEvent className={cn("hover:bg-accent", className)}>
      <ChatEventAddon>
        <Avatar className="rounded-full size-8 @md/chat:size-10 mx-auto">
          <AvatarImage src={avatarSrc} alt={avatarAlt} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </ChatEventAddon>
      <ChatEventBody>
        <div className="flex items-baseline gap-2">
          <ChatEventTitle>{senderName}</ChatEventTitle>
          <ChatEventDescription>
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(timestamp)}
          </ChatEventDescription>
        </div>
        <ChatEventContent>{content}</ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  );
}
```

#### Additional Message

```tsx
import { ReactNode } from "react";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
  ChatEventDescription,
} from "@/components/ui/chat-event";

export function AdditionalMessage({
  content,
  timestamp,
}: {
  content: ReactNode;
  timestamp: number;
}) {
  return (
    <ChatEvent className="hover:bg-accent group">
      <ChatEventAddon>
        <ChatEventDescription className="text-right text-[8px] @md/chat:text-[10px] group-hover:visible invisible">
          {new Intl.DateTimeFormat("en-US", {
            timeStyle: "short",
          }).format(timestamp)}
        </ChatEventDescription>
      </ChatEventAddon>
      <ChatEventBody>
        <ChatEventContent>{content}</ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  );
}
```

#### Date Item

```tsx
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChatEvent } from "@/components/ui/chat-event";

export function DateItem({
  timestamp,
  className,
}: {
  timestamp: number;
  className?: string;
}) {
  return (
    <ChatEvent className={cn("items-center gap-1", className)}>
      <Separator className="flex-1" />
      <span className="text-muted-foreground text-xs font-semibold min-w-max">
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(timestamp)}
      </span>
      <Separator className="flex-1" />
    </ChatEvent>
  );
}
```

### Chat Toolbar

A sticky bottom input area with a three-column grid layout (AddonStart, Textarea, AddonEnd) for message composition with optional action buttons on both sides.

```tsx
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
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## Acknowledgements

- Built with [shadcn/ui](https://ui.shadcn.com/) and [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Awesome [README builder](https://readme.so)
