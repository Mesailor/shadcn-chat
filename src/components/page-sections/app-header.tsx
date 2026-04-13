import { Button } from "@/components/ui/button";
import { MessageCircleIcon, StarIcon } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  return (
    <header className="px-4 py-3 fixed top-0 left-0 w-full backdrop-blur-lg border-b z-50">
      <div className="ml-auto w-fit flex items-center gap-2">
        <Button
          size="sm"
          className="min-w-20 bg-linear-to-br from-yellow-700 to-amber-500 hover:opacity-90 text-white"
          asChild
        >
          <a
            href="https://github.com/Mesailor/shadcn-chat"
            target="_blank"
            rel="noreferrer"
          >
            <StarIcon />
            Star on GitHub
          </a>
        </Button>

        <Button
          className="dark:bg-background dark:hover:bg-accent"
          size="sm"
          variant="outline"
          asChild
        >
          <a
            href="https://github.com/Mesailor/shadcn-chat/issues"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircleIcon />
            Feedback
          </a>
        </Button>

        <ThemeToggle />
      </div>
    </header>
  );
}
