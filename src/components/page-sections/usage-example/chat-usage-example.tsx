import { Anchor } from "@/components/common/anchor";
import { CodeBlock } from "@/components/common/code-block";

export function ChatUsageExample() {
  return (
    <div className="space-y-2">
      <Anchor id="chat">
        <h3 className="text-lg font-semibold">Chat</h3>
      </Anchor>

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
