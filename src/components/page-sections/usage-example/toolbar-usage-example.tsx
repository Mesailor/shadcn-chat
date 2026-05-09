"use client";

import {
  ChatToolbar,
  ChatToolbarAddon,
  ChatToolbarAttachment,
  ChatToolbarAttachmentButton,
  ChatToolbarButton,
  ChatToolbarTextarea,
} from "@/registry/new-york/chat/chat-toolbar";
import { CodeBlock } from "@/components/common/code-block";
import { PlusIcon, SendIcon, SmileIcon } from "lucide-react";
import { Anchor } from "@/components/common/anchor";
import { HighlightedComponent } from "@/components/ui/typography";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useState } from "react";

export function ToolbarUsageExample() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [emojiOpen, setEmojiOpen] = useState(false);

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

      <ChatToolbar className="p-0 static">
        {files.length > 0 && (
          <ChatToolbarAddon
            align="block-start"
            className="mb-2 overflow-x-auto gap-2"
          >
            {files.map((file, i) => (
              <ChatToolbarAttachment
                key={file.name + i}
                fileName={file.name}
                onRemove={() =>
                  setFiles((prev) => prev.filter((_, idx) => idx !== i))
                }
              />
            ))}
          </ChatToolbarAddon>
        )}

        <ChatToolbarAddon
          align="inline-start"
          className="order-2 flex-1 md:order-1 md:flex-none"
        >
          <ChatToolbarAttachmentButton
            onFilesSelected={(files) => {
              setFiles((prev) => [...prev, ...files]);
            }}
          >
            <PlusIcon />
          </ChatToolbarAttachmentButton>
          <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
            <PopoverTrigger asChild>
              <ChatToolbarButton>
                <SmileIcon />
              </ChatToolbarButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="top">
              <EmojiPicker
                theme={Theme.AUTO}
                onEmojiClick={(emojiData: EmojiClickData) => {
                  setInput((prev) => prev + emojiData.emoji);
                  setEmojiOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </ChatToolbarAddon>

        <div className="w-full min-w-0 order-1 pb-1 md:pb-0 md:flex-1 md:w-auto md:order-2">
          <ChatToolbarTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <ChatToolbarAddon align="inline-end">
          <ChatToolbarButton
            variant="default"
            disabled={!input.trim() && files.length === 0}
          >
            <SendIcon />
          </ChatToolbarButton>
        </ChatToolbarAddon>
      </ChatToolbar>

      <CodeBlock language="jsx" code={codeString} showLineNumbers />
    </div>
  );
}

const codeString = `<ChatToolbar>
  {/* Attached files preview section */}
  {files.length > 0 && (
    <ChatToolbarAddon
      align="block-start"
      className="mb-2 overflow-x-auto gap-2"
    >
      {files.map((file, i) => (
        <ChatToolbarAttachment
          key={file.name + i}
          fileName={file.name}
          onRemove={() =>
            setFiles((prev) => prev.filter((_, idx) => idx !== i))
          }
        />
      ))}
    </ChatToolbarAddon>
  )}

  {/* Additional action buttons */}
  <ChatToolbarAddon
    align="inline-start"
    className="order-2 flex-1 @2xl/chat:order-1 @2xl/chat:flex-none"
  >
    {/* Attachment button */}
    <ChatToolbarAttachmentButton
      onFilesSelected={(files) => {
        setFiles((prev) => [...prev, ...files]);
      }}
    >
      <PlusIcon />
    </ChatToolbarAttachmentButton>
    {/* Emoji picker popover */}
    <EmojiPickerPopover />
  </ChatToolbarAddon>

  {/* Textarea section */}
  <div className="w-full min-w-0 order-1 pb-1 @2xl/chat:pb-0 @2xl/chat:flex-1 @2xl/chat:w-auto @2xl/chat:order-2">
    <ChatToolbarTextarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onSubmit={() => handleSubmit()}
    />
  </div>

  {/* Submit button */}
  <ChatToolbarAddon align="inline-end">
    <ChatToolbarButton
      variant="default"
      disabled={!input.trim() && files.length === 0}
      onClick={() => handleSubmit()}
    >
      <SendIcon />
    </ChatToolbarButton>
  </ChatToolbarAddon>
</ChatToolbar>
`;
