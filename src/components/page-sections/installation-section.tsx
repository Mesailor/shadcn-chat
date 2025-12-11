import Link from "next/link";
import { CodeBlock } from "./usage-example/code-block";
import { Anchor } from "@/components/common/anchor";

export function InstallationSection() {
  return (
    <section className="py-8 w-full max-w-4xl px-6 space-y-6">
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
            technologies. If you are not, please review their documentation
            first.
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
          <h3 className="font-semibold text-lg mb-4">Quick Start</h3>
          <ol className="list-decimal list-inside space-y-4 border-l pl-4">
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
              <CodeBlock
                className="text-sm"
                language="bash"
                code={`pnpm dlx shadcn@latest add textarea`}
              />
            </li>
            <li>
              <span className="font-medium">Copy the Chat Component:</span>{" "}
              <span className="text-muted-foreground">
                Copy the chat component files from the{" "}
                <Link
                  href="https://github.com/Mesailor/shadcn-chat/tree/main/src/components/chat"
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
        </div>
      </div>
    </section>
  );
}
