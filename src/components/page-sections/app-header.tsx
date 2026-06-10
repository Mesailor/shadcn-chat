import { Button } from "@/components/ui/button";
import { MessageCircleIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  return (
    <header className="px-4 py-3 fixed top-0 left-0 w-full backdrop-blur-lg z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-sm"
          />
          <span className="font-semibold">Chat Component</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="size-9 md:size-auto md:min-w-20 bg-linear-to-br from-yellow-700 to-amber-500 hover:opacity-90 text-white"
            asChild
          >
            <a
              href="https://github.com/Mesailor/shadcn-chat"
              target="_blank"
              rel="noreferrer"
            >
              <StarIcon />
              <span className="hidden md:inline">Star on GitHub</span>
            </a>
          </Button>

          <Button
            className="size-9 md:size-auto dark:bg-background dark:hover:bg-accent"
            variant="outline"
            asChild
          >
            <a
              href="https://github.com/Mesailor/shadcn-chat/issues"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircleIcon />
              <span className="hidden md:inline">Feedback</span>
            </a>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
