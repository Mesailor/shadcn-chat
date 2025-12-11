import {
  ChatHeader,
  ChatHeaderEnd,
  ChatHeaderMain,
  ChatHeaderStart,
} from "@/components/chat/chat-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

export function HeaderUsageExample() {
  return (
    <div className="space-y-2">
      <div>
        <Anchor id="chat-header">
          <h3 className="text-lg font-semibold">Chat Header</h3>
        </Anchor>
        <p className="text-sm text-muted-foreground">
          A sticky header component with three sections (Start, Main, End) for
          displaying chat participant info, status, search, and action buttons.
        </p>
      </div>

      <ChatHeader className="border rounded-sm static mb-4">
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
          <InputGroup className="md:flex hidden">
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <Button variant="ghost" className="size-8 md:inline-flex hidden">
            <PhoneIcon />
          </Button>
          <Button variant="ghost" className="size-8 md:inline-flex hidden">
            <VideoIcon />
          </Button>
          <Button variant="ghost" className="size-8">
            <MoreHorizontalIcon />
          </Button>
        </ChatHeaderEnd>
      </ChatHeader>

      <CodeBlock language="jsx" code={codeString} showLineNumbers />
    </div>
  );
}

const codeString = `<ChatHeader className="border-b">
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
    `;
