import {
  ChatHeader,
  ChatHeaderAddon,
  ChatHeaderAvatar,
  ChatHeaderButton,
  ChatHeaderMain,
} from "@/registry/new-york/chat/chat-header";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  MoreHorizontalIcon,
  PhoneIcon,
  SearchIcon,
  VideoIcon,
} from "lucide-react";
import { CodeBlock } from "@/components/common/code-block";
import { Anchor } from "@/components/common/anchor";
import { HighlightedComponent } from "@/components/ui/typography";

export function HeaderUsageExample() {
  return (
    <div className="space-y-2">
      <div>
        <Anchor id="chat-header">
          <h3 className="text-lg font-semibold">Chat Header</h3>
        </Anchor>
        <p className="text-sm text-muted-foreground">
          A sticky header component with flexible layout. Use{" "}
          <HighlightedComponent>ChatHeaderMain</HighlightedComponent> for the
          primary content area (takes remaining space) and{" "}
          <HighlightedComponent>ChatHeaderAddon</HighlightedComponent> for
          grouping items on either side. Includes{" "}
          <HighlightedComponent>ChatHeaderAvatar</HighlightedComponent> for
          profile images and{" "}
          <HighlightedComponent>ChatHeaderButton</HighlightedComponent> for
          action buttons.
        </p>
      </div>

      <ChatHeader className="border rounded-sm static mb-4">
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
          <InputGroup className="md:flex hidden">
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <ChatHeaderButton className="md:inline-flex hidden">
            <PhoneIcon />
          </ChatHeaderButton>
          <ChatHeaderButton className="md:inline-flex hidden">
            <VideoIcon />
          </ChatHeaderButton>
          <ChatHeaderButton>
            <MoreHorizontalIcon />
          </ChatHeaderButton>
        </ChatHeaderAddon>
      </ChatHeader>

      <CodeBlock language="jsx" code={codeString} showLineNumbers />
    </div>
  );
}

const codeString = `<ChatHeader className="border-b">
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
    <ChatHeaderButton className="@2xl/chat:inline-flex hidden">
      <PhoneIcon />
    </ChatHeaderButton>
    <ChatHeaderButton className="@2xl/chat:inline-flex hidden">
      <VideoIcon />
    </ChatHeaderButton>
    <ChatHeaderButton>
      <MoreHorizontalIcon />
    </ChatHeaderButton>
  </ChatHeaderAddon>
  </ChatHeader>
</ChatHeader>
    `;
