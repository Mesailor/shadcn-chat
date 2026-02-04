import {
  ChatToolbar,
  ChatToolbarAddon,
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
import { HighlightedComponent } from "@/components/ui/typography";

export function ToolbarUsageExample() {
  return (
    <div className="space-y-2">
      <div>
        <Anchor id="chat-toolbar">
          <h3 className="text-lg font-semibold">Chat Toolbar</h3>
        </Anchor>
        <p className="text-sm text-muted-foreground">
          A sticky bottom input area for message composition. Use{" "}
          <HighlightedComponent>ChatToolbar</HighlightedComponent> as the
          container,{" "}
          <HighlightedComponent>ChatToolbarTextarea</HighlightedComponent> for
          the input field with built-in submit handling (Enter to submit,
          Shift+Enter for new line), and{" "}
          <HighlightedComponent>ChatToolbarAddon</HighlightedComponent> to
          position action buttons using the <code>align</code> prop
          (&quot;inline-start&quot;, &quot;inline-end&quot;,
          &quot;block-start&quot;, &quot;block-end&quot;). Use{" "}
          <HighlightedComponent>ChatToolbarButton</HighlightedComponent> for
          consistent icon button styling.
        </p>
      </div>

      <ChatToolbar className="static p-0">
        <ChatToolbarAddon align="inline-start">
          <ChatToolbarButton>
            <PlusIcon />
          </ChatToolbarButton>
        </ChatToolbarAddon>
        <ChatToolbarTextarea className="md:text-base" />
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

      <CodeBlock language="jsx" code={codeString} showLineNumbers />
    </div>
  );
}

const codeString = `<ChatToolbar>
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
`;
