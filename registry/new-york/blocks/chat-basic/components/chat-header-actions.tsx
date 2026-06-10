"use client";

import { useState } from "react";
import {
  BanIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
  VideoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatHeaderButton } from "@/registry/new-york/chat/chat-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsViewportWider } from "@/registry/new-york/blocks/chat-basic/hooks/use-is-viewport-wider";

interface ChatHeaderActionsProps {
  isChatWide: boolean;
  openSearch: () => void;
  openProfile: () => void;
  isBlocked: boolean;
  onUnblock: () => void;
  onBlock: () => void;
}

export function ChatHeaderActions({
  isChatWide,
  openSearch,
  openProfile,
  isBlocked,
  onUnblock,
  onBlock,
}: ChatHeaderActionsProps) {
  const isTabletOrWider = useIsViewportWider(768);
  const [dialogOpen, setDialogOpen] = useState(false);

  const trigger = (
    <ChatHeaderButton aria-label="More options">
      <MoreHorizontalIcon />
    </ChatHeaderButton>
  );

  if (isTabletOrWider) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!isChatWide && (
            <>
              <DropdownMenuItem onSelect={openSearch}>
                <SearchIcon />
                Search
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PhoneIcon />
                Start call
              </DropdownMenuItem>
              <DropdownMenuItem>
                <VideoIcon />
                Start video
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onSelect={openProfile}>
            <UserIcon />
            Show profile
          </DropdownMenuItem>
          {isBlocked ? (
            <DropdownMenuItem onSelect={onUnblock}>
              <BanIcon />
              Unblock
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem variant="destructive" onSelect={onBlock}>
              <BanIcon />
              Block
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xs p-4 gap-0">
        <DialogHeader className="mb-2">
          <DialogTitle className="sr-only">Options</DialogTitle>
          <DialogDescription className="sr-only">
            Chat actions
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <ActionItem
            icon={<SearchIcon />}
            onClick={() => {
              setDialogOpen(false);
              openSearch();
            }}
          >
            Search
          </ActionItem>
          <ActionItem icon={<PhoneIcon />}>Start call</ActionItem>
          <ActionItem icon={<VideoIcon />}>Start video</ActionItem>
          <hr className="my-1 border-border" />
          <ActionItem
            icon={<UserIcon />}
            onClick={() => {
              setDialogOpen(false);
              openProfile();
            }}
          >
            Show profile
          </ActionItem>
          {isBlocked ? (
            <ActionItem
              icon={<BanIcon />}
              onClick={() => {
                setDialogOpen(false);
                onUnblock();
              }}
            >
              Unblock
            </ActionItem>
          ) : (
            <ActionItem
              icon={<BanIcon />}
              destructive
              onClick={() => {
                setDialogOpen(false);
                onBlock();
              }}
            >
              Block
            </ActionItem>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ActionItemProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  destructive?: boolean;
}

function ActionItem({ icon, children, onClick, destructive }: ActionItemProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm w-full text-left transition-colors",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-none",
        destructive &&
          "text-destructive hover:text-destructive focus:text-destructive",
      )}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}
