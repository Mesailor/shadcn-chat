"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { XIcon } from "lucide-react";

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
  title: string;
  isMobile: boolean;
  children: React.ReactNode;
}

export function ChatSidebar({
  open,
  onClose,
  title,
  isMobile,
  children,
}: ChatSidebarProps) {
  if (isMobile) {
    return (
      <Sheet
        open={open}
        onOpenChange={(o) => {
          if (!o) onClose();
        }}
      >
        <SheetContent side="right" className="flex flex-col gap-0 p-0">
          <SheetHeader className="border-b px-4 py-3 flex-row items-center space-y-0">
            <SheetTitle className="text-sm font-medium">{title}</SheetTitle>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col border-l bg-sidebar text-sidebar-foreground overflow-hidden",
        open ? "@3xl/chat:w-96 @2xl/chat:w-80 w-0" : "w-0",
      )}
    >
      <SidebarHeader className="border-b flex-row items-center justify-between">
        <span className="text-sm font-medium truncate">{title}</span>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <XIcon />
        </Button>
      </SidebarHeader>
      <SidebarContent className="gap-0">{children}</SidebarContent>
    </div>
  );
}
