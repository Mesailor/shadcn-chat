import { Button } from "../ui/button";
import { GitHubInvertocatIcon } from "../icons/git-hub-invertocat-icon";
import { MessageCircleIcon, StarIcon } from "lucide-react";

export function BottomCTASection() {
  return (
    <section className="py-16 w-full max-w-2xl px-4 text-center space-y-4">
      <h2 className="sm:text-3xl text-2xl font-bold">
        Enjoying the Component?
      </h2>
      <p className="text-lg text-muted-foreground">
        If you found this useful, consider giving it a star on GitHub. Got ideas
        or feedback? Open an issue — every bit helps!
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
        <Button
          className="h-12 w-full sm:w-auto px-6! bg-linear-to-br from-yellow-700 to-amber-500 hover:opacity-90 text-white"
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
          className="h-12 w-full sm:w-auto px-8!"
          variant="outline"
          asChild
        >
          <a
            href="https://github.com/Mesailor/shadcn-chat/issues"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircleIcon />
            Share Feedback
          </a>
        </Button>
      </div>
    </section>
  );
}
