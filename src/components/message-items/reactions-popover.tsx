"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const DEFAULT_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🎉"];

export function ReactionsPopover({
  children,
  onReaction,
}: {
  children: React.ReactNode;
  onReaction?: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-1.5">
        <div className="flex gap-0.5">
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
