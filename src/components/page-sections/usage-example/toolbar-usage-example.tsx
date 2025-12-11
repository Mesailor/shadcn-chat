import {
  ChatToolbar,
  ChatToolbarAddonEnd,
  ChatToolbarAddonStart,
  ChatToolbarTextarea,
} from "@/components/chat/chat-toolbar";
import { CodeBlock } from "@/components/common/code-block";
import { Button } from "@/components/ui/button";
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
      <Anchor id="chat-toolbar">
        <h3 className="text-lg font-semibold">Chat Toolbar</h3>
      </Anchor>

      <ChatToolbar>
        <ChatToolbarAddonStart>
          <Button variant="ghost" className="size-8 md:size-9">
            <PlusIcon className="size-5 md:size-6 stroke-[1.7px]" />
          </Button>
        </ChatToolbarAddonStart>
        <ChatToolbarTextarea className="md:text-base" />
        <ChatToolbarAddonEnd>
          <Button variant="ghost" className="size-8 md:size-9">
            <GiftIcon className="size-4 md:size-5 stroke-[1.7px]" />
          </Button>
          <Button variant="ghost" className="size-8 md:size-9">
            <CalendarDaysIcon className="size-4 md:size-5 stroke-[1.7px]" />
          </Button>
          <Button variant="ghost" className="size-8 md:size-9">
            <SquareChevronRightIcon className="size-4 md:size-5 stroke-[1.7px]" />
          </Button>
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
