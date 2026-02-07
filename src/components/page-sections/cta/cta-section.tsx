import { Button } from "../../ui/button";
import { GitHubInvertocatIcon } from "../../icons/git-hub-invertocat-icon";
import { RocketIcon } from "lucide-react";
import { V0Button } from "./v0-button";

export function CTASection() {
  return (
    <section className="py-8 w-full max-w-2xl px-4 text-center space-y-4">
      <h1 className="sm:text-4xl text-3xl font-bold">Chat Component</h1>
      <p className="text-lg text-center text-muted-foreground">
        A customizable chat window component built with Shadcn UI and React.
      </p>

      <div className="flex flex-col gap-4 w-full sm:max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <Button
            className="h-12 w-full sm:w-auto sm:flex-1 px-6! bg-linear-to-br from-sky-900 to-sky-600 hover:opacity-90 text-white"
            asChild
          >
            <a href="#installation">
              <RocketIcon />
              Quick Start
            </a>
          </Button>
          <Button
            className="h-12 w-full sm:w-auto px-8"
            variant="outline"
            asChild
          >
            <a
              href="https://github.com/Mesailor/shadcn-chat"
              target="_blank"
              rel="noreferrer"
            >
              <GitHubInvertocatIcon height={20} width={20} />
              View Source
            </a>
          </Button>
        </div>
        {/* <p className="text-muted-foreground hidden sm:block">
          ...or build with AI
        </p>
        <V0Button
          className="h-12 w-full sm:w-auto"
          url={
            "https://v0.dev/chat/api/open?url=https://shadcn-chat.vercel.app/r/chat.json"
          }
        >
          Open in
        </V0Button> */}
      </div>
    </section>
  );
}
