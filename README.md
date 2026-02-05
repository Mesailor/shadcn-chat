# Shadcn Chat Component

A customizable chat component built with shadcn/ui and React.

## Demo

Checkout a [live demo](https://shadcn-chat.vercel.app)

## Installation

### Prerequisites

The chat component is compatible with any environment that supports [React](https://react.dev/learn) and has [shadcn/ui](https://ui.shadcn.com/docs) configured.

This guide assumes you are already familiar with both of these technologies. If you are not, you can review their documentations first.

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

#### Responsiveness

The `Chat` component uses container queries (ex. [`@2xl/chat:`](https://tailwindcss.com/docs/responsive-design#named-containers)) to adapt its layout based on the available width, ensuring an optimal user experience across different device sizes.

Make sure that the `Chat` component is given a **defined height or max-height** (ex. via CSS or parent container) to enable proper scrolling behavior for the messages section.

```tsx
<Chat className="h-screen">
  <ChatHeader>{/* Header Content */}</ChatHeader>

  <ChatMessages>{/* Messages Content */}</ChatMessages>

  <ChatToolbar>{/* Toolbar Content */}</ChatToolbar>
</Chat>
```

### Chat Header

A sticky header component with flexible layout. Use `ChatHeaderMain` for the primary content area (takes remaining space) and `ChatHeaderAddon` for grouping items on either side. Includes `ChatHeaderAvatar` for profile images and `ChatHeaderButton` for action buttons.

```tsx
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
      <span className="text-sm font-medium truncate">Front-end developer</span>
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

A flexible message row component for displaying any message or event in the chat. Use `ChatEventAddon` for side content like avatars or timestamps, and `ChatEventBody` for the main content area. Inside the body, use `ChatEventTitle` for sender name and metadata, and `ChatEventContent` for the message text. Use `ChatEventAvatar` for profile images and `ChatEventTime` for localized timestamp formatting with preset formats.

#### Primary Message

```tsx
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventAvatar,
  ChatEventBody,
  ChatEventContent,
  ChatEventTime,
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
        <ChatEventAvatar
          src={avatarSrc}
          alt={avatarAlt}
          fallback={avatarFallback}
        />
      </ChatEventAddon>
      <ChatEventBody>
        <ChatEventTitle>
          <span className="font-medium">{senderName}</span>
          <ChatEventTime timestamp={timestamp} />
        </ChatEventTitle>
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
  ChatEventTime,
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
        <ChatEventTime
          timestamp={timestamp}
          format="time"
          className="text-right text-[8px] @md/chat:text-[10px] group-hover:visible invisible"
        />
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
import { ChatEvent, ChatEventTime } from "@/components/ui/chat-event";

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
      <ChatEventTime
        timestamp={timestamp}
        format="longDate"
        className="font-semibold min-w-max"
      />
      <Separator className="flex-1" />
    </ChatEvent>
  );
}
```

### Chat Toolbar

A sticky bottom input area for message composition. Use `ChatToolbar` as the container, `ChatToolbarTextarea` for the input field with built-in submit handling (Enter to submit, Shift+Enter for new line), and `ChatToolbarAddon` to position action buttons using the `align` prop ("inline-start", "inline-end", "block-start", "block-end"). Use `ChatToolbarButton` for consistent icon button styling.

```tsx
<ChatToolbar>
  <ChatToolbarAddon align="inline-start">
    <ChatToolbarButton>
      <PlusIcon />
    </ChatToolbarButton>
  </ChatToolbarAddon>

  <ChatToolbarTextarea
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onSubmit={() => handleSendMessage()}
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
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## Acknowledgements

- Built with [shadcn/ui](https://ui.shadcn.com/) and [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Awesome [README builder](https://readme.so)
