import { Anchor } from "@/components/common/anchor";
import { CodeBlock } from "@/components/common/code-block";
import { HighlightedComponent } from "@/components/ui/typography";
import Link from "next/link";

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
        <h4 className="mt-2">Responsiveness</h4>
        <div className="space-y-1 mt-1">
          <p className="text-sm text-muted-foreground">
            The <code>Chat</code> component uses container queries (ex.{" "}
            <HighlightedComponent className="hover:underline underline-offset-2">
              <Link
                href="https://tailwindcss.com/docs/responsive-design#named-containers"
                target="_blank"
                rel="noreferrer"
              >
                @2xl/chat:
              </Link>
            </HighlightedComponent>
            ) to adapt its layout based on the available width, ensuring an
            optimal user experience across different device sizes.
          </p>
          <p className="text-sm text-muted-foreground">
            Make sure that the <HighlightedComponent>Chat</HighlightedComponent>{" "}
            component is given a{" "}
            <span className="text-primary">defined height or max-height</span>{" "}
            (ex. via CSS or parent container) to enable proper scrolling
            behavior for the messages section.
          </p>
        </div>
      </div>

      <CodeBlock language="jsx" code={codeString} showLineNumbers />
    </div>
  );
}

const codeString = `<Chat className="h-screen">
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
