import { Button } from "../ui/button";
import { GitHubInvertocatIcon } from "../icons/git-hub-invertocat-icon";
import { RocketIcon } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-8 w-full max-w-2xl px-4 text-center space-y-4">
      <h1 className="sm:text-4xl text-3xl font-bold">Chat Component</h1>
      <p className="text-lg text-center text-muted-foreground">
        A customizable chat window component built with Shadcn UI and React.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
        <Button
          className="h-12 !px-6 bg-linear-to-br from-sky-900 to-sky-600 hover:opacity-90 text-white"
          asChild
        >
          <a href="#installation">
            <RocketIcon />
            Quick Start
          </a>
        </Button>
        <Button className="h-12 px-8" variant="outline" asChild>
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
    </section>
  );
}
