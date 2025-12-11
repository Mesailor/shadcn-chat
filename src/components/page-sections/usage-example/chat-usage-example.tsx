import { Anchor } from "@/components/common/anchor";
import { CodeBlock } from "@/components/common/code-block";

export function ChatUsageExample() {
  return (
    <div className="space-y-2">
      <div>
        <Anchor id="chat">
          <h3 className="text-lg font-semibold">Chat</h3>
        </Anchor>
        <p className="text-sm text-muted-foreground">
          The root container component that establishes the chat layout
          structure with container queries and flex column layout for header,
          messages, and toolbar sections.
        </p>
      </div>

      <CodeBlock language="jsx" code={codeString} showLineNumbers />
    </div>
  );
}

const codeString = `<Chat>
  <ChatHeader>
    {/* Header Content */}
  </ChatHeader>

  <ChatMessages>
    {/* Messages Content */}
  </ChatMessages>

  <ChatToolbar>
    {/* Toolbar Content */}
  </ChatToolbar>
</Chat>;   
    `;
