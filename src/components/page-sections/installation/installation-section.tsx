"use client";

import Link from "next/link";
import { useState } from "react";
import { Anchor } from "@/components/common/anchor";
import { cn } from "@/lib/utils";
import {
  PackageManager,
  PackageManagerCodeBlock,
} from "./package-manager-code-block";

const INSTALL_COMMANDS: Record<PackageManager, string> = {
  pnpm: "pnpm dlx shadcn@latest add https://shadcn-chat.vercel.app/r/chat.json",
  npm: "npx shadcn@latest add https://shadcn-chat.vercel.app/r/chat.json",
  yarn: "yarn dlx shadcn@latest add https://shadcn-chat.vercel.app/r/chat.json",
  bun: "bunx --bun shadcn@latest add https://shadcn-chat.vercel.app/r/chat.json",
};

const DEPENDENCY_COMMANDS: Record<PackageManager, string> = {
  pnpm: "pnpm dlx shadcn@latest add avatar button textarea",
  npm: "npx shadcn@latest add avatar button textarea",
  yarn: "yarn dlx shadcn@latest add avatar button textarea",
  bun: "bunx --bun shadcn@latest add avatar button textarea",
};

export function InstallationSection() {
  const [tab, setTab] = useState<"command" | "manual">("command");
  const [pm, setPm] = useState<PackageManager>("pnpm");

  return (
    <section className="py-8 w-full max-w-4xl px-4 md:px-6 space-y-6">
      <Anchor id="installation" className="border-b pb-2">
        <h2 className="text-2xl font-semibold">Installation</h2>
      </Anchor>
      <div className="space-y-4">
        <div className="bg-accent/50 p-4 rounded-lg">
          <p className="font-medium">Prerequisites</p>
          <p className="text-muted-foreground">
            The chat component is compatible with any environment that supports{" "}
            <strong>React</strong> and has <strong>shadcn/ui</strong>{" "}
            configured.
          </p>
          <p className="text-muted-foreground">
            This guide assumes you are already familiar with both of these
            technologies. If you are not, you can review their documentation
            here.
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>
              <Link
                href="https://react.dev/learn"
                className="underline underline-offset-4 hover:text-primary"
                target="_blank"
                rel="noreferrer"
              >
                React
              </Link>
            </li>
            <li>
              <Link
                href="https://ui.shadcn.com/docs"
                className="underline underline-offset-4 hover:text-primary"
                target="_blank"
                rel="noreferrer"
              >
                shadcn/ui
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="flex gap-2 border-b mb-4">
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                tab === "command"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setTab("command")}
            >
              Command
            </button>
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                tab === "manual"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setTab("manual")}
            >
              Manual
            </button>
          </div>

          {tab === "command" ? (
            <>
            <p className="text-muted-foreground mb-4">
              This will install all the chat components and their dependencies
              into your project.
            </p>
              <PackageManagerCodeBlock
                commands={INSTALL_COMMANDS}
                pm={pm}
                onPmChange={setPm}
              />
            </>
          ) : (
            <ol className="list-decimal list-inside space-y-5 border-l pl-4">
              <li>
                <span className="font-medium">Install shadcn/ui:</span>{" "}
                <span className="text-muted-foreground">
                  If you haven&apos;t already, initialize shadcn/ui in your
                  project by following the{" "}
                  <Link
                    href="https://ui.shadcn.com/docs/installation"
                    className="underline underline-offset-4 hover:text-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    official installation guide
                  </Link>
                  .
                </span>
              </li>
              <li>
                <span className="font-medium">Install Dependencies:</span>{" "}
                <span className="text-muted-foreground">
                  Ensure you have the necessary primitives installed.
                </span>
                <PackageManagerCodeBlock
                  commands={DEPENDENCY_COMMANDS}
                  pm={pm}
                  onPmChange={setPm}
                  className="text-sm mt-2"
                />
              </li>
              <li>
                <span className="font-medium">Copy the Chat Component:</span>{" "}
                <span className="text-muted-foreground">
                  Copy the chat component files from the{" "}
                  <Link
                    href="https://github.com/Mesailor/shadcn-chat/tree/main/registry/new-york/chat"
                    className="underline underline-offset-4 hover:text-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    repository
                  </Link>{" "}
                  into your project&apos;s components directory (e.g.,{" "}
                  <code className="text-sm bg-accent py-0.5 px-1 rounded-xs">
                    @/components/chat
                  </code>
                  ).
                </span>
              </li>
              <li>
                <span className="font-medium">Import and Use:</span>{" "}
                <span className="text-muted-foreground">
                  Import the component into your page and use it as needed.
                </span>
              </li>
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
