import { CodeBlock } from "@/components/common/code-block";
import { cn } from "@/lib/utils";

const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export function PackageManagerCodeBlock({
  commands,
  pm,
  onPmChange,
  className,
}: {
  commands: Record<PackageManager, string>;
  pm: PackageManager;
  onPmChange: (pm: PackageManager) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex gap-1">
        {PACKAGE_MANAGERS.map((manager) => (
          <button
            key={manager}
            className={cn(
              "px-2.5 py-1 text-xs rounded-t-md transition-colors",
              pm === manager
                ? "bg-accent text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => onPmChange(manager)}
          >
            {manager}
          </button>
        ))}
      </div>
      <CodeBlock language="bash" code={commands[pm]} />
    </div>
  );
}
