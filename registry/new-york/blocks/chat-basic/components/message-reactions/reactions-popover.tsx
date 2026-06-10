"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export const DEFAULT_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🎉"];

export function ReactionsPopover({
  children,
  onReaction,
}: {
  children: React.ReactNode;
  onReaction?: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [fullPickerOpen, setFullPickerOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setFullPickerOpen(false);
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex gap-0.5 p-1.5">
          {DEFAULT_REACTIONS.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="icon"
              className="size-8 text-base"
              onClick={() => {
                onReaction?.(emoji);
                setOpen(false);
              }}
            >
              {emoji}
            </Button>
          ))}
          <Popover open={fullPickerOpen} onOpenChange={setFullPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="More emoji reactions"
              >
                <PlusIcon aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="end"
              side="top"
              sideOffset={10}
              alignOffset={-8}
            >
              <EmojiPicker
                theme={Theme.AUTO}
                onEmojiClick={(emojiData: EmojiClickData) => {
                  onReaction?.(emojiData.emoji);
                  setFullPickerOpen(false);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </PopoverContent>
    </Popover>
  );
}
