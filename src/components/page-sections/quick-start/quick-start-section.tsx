"use client";

import { useState } from "react";
import { Anchor } from "@/components/common/anchor";
import {
  PackageManager,
  PackageManagerCodeBlock,
} from "@/components/page-sections/installation/package-manager-code-block";
import { TypographyInlineCode } from "@/components/ui/typography";

const QUICK_START_COMMANDS: Record<PackageManager, string> = {
  pnpm: "pnpm dlx shadcn@latest add https://shadcn-chat.vercel.app/r/chat-basic.json",
  npm: "npx shadcn@latest add https://shadcn-chat.vercel.app/r/chat-basic.json",
  yarn: "yarn dlx shadcn@latest add https://shadcn-chat.vercel.app/r/chat-basic.json",
  bun: "bunx --bun shadcn@latest add https://shadcn-chat.vercel.app/r/chat-basic.json",
};

export function QuickStartSection() {
  const [pm, setPm] = useState<PackageManager>("pnpm");

  return (
    <section className="py-8 w-full max-w-4xl px-4 md:px-6 space-y-4">
      <Anchor id="quick-start" className="border-b pb-2">
        <h2 className="text-2xl font-semibold">Quick Start</h2>
      </Anchor>
      <p className="text-muted-foreground">
        Get a complete, ready-to-use chat page added to your project in one
        command. This installs a fully wired-up{" "}
        <TypographyInlineCode className="font-normal">
          app/chat/page.tsx
        </TypographyInlineCode>{" "}
        with sample data and message components.
      </p>
      <PackageManagerCodeBlock
        commands={QUICK_START_COMMANDS}
        pm={pm}
        onPmChange={setPm}
      />
      <p className="text-sm text-muted-foreground">
        Then visit{" "}
        <TypographyInlineCode className="font-normal">
          /chat
        </TypographyInlineCode>{" "}
        in your browser to see the result.
      </p>
    </section>
  );
}
