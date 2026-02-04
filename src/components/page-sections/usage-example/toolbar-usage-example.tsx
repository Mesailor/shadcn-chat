import {
  ChatToolbar,
  ChatToolbarAddonEnd,
  ChatToolbarAddonStart,
  ChatToolbarButton,
  ChatToolbarTextarea,
} from "@/components/chat/chat-toolbar";
import { CodeBlock } from "@/components/common/code-block";
import {
  CalendarDaysIcon,
  GiftIcon,
  PlusIcon,
  SquareChevronRightIcon,
} from "lucide-react";
import { Anchor } from "@/components/common/anchor";

export function ToolbarUsageExample() {
  return (
    <div className="space-y-2">
      <div>
        <Anchor id="chat-toolbar">
          <h3 className="text-lg font-semibold">Chat Toolbar</h3>
        </Anchor>
        <p className="text-sm text-muted-foreground">
          A sticky bottom input area with a three-column grid layout
          (AddonStart, Textarea, AddonEnd) for message composition with optional
          action buttons on both sides.
        </p>
      </div>

      <ChatToolbar>
        <ChatToolbarAddonStart>
          <ChatToolbarButton>
            <PlusIcon />
          </ChatToolbarButton>
        </ChatToolbarAddonStart>
        <ChatToolbarTextarea className="md:text-base" />
        <ChatToolbarAddonEnd>
          <ChatToolbarButton>
            <GiftIcon />
          </ChatToolbarButton>
          <ChatToolbarButton>
            <CalendarDaysIcon />
          </ChatToolbarButton>
          <ChatToolbarButton>
            <SquareChevronRightIcon />
          </ChatToolbarButton>
        </ChatToolbarAddonEnd>
      </ChatToolbar>

      <CodeBlock language="jsx" code={codeString} showLineNumbers />
    </div>
  );
}

const codeString = `<ChatToolbar>
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
`;
