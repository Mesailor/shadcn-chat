import { EventContent, EventFile } from "@/data/messages";
import { FileTextIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MessageContent({ content }: { content: EventContent }) {
  const hasText = !!content.text;
  const hasFiles = !!(content.files && content.files.length > 0);

  return (
    <>
      {hasText && <span>{content.text}</span>}
      {hasFiles && (
        <div className="flex flex-col gap-2 mt-1">
          {content.files!.map((file, i) => (
            <FileCard key={i} file={file} />
          ))}
        </div>
      )}
    </>
  );
}

function FileCard({ file }: { file: EventFile }) {
  return (
    <div className="h-16 max-w-80 rounded-md border bg-muted flex items-center gap-2 px-4 py-3">
      <FileTextIcon className="shrink-0 size-6 @md/chat:size-7 text-muted-foreground stroke-[1.5px]" />
      <div className="min-w-0">
        <a
          href={file.url}
          download={file.fileName}
          className="block text-sm text-sky-500 dark:text-sky-600 leading-tight max-w-40 truncate hover:underline"
        >
          {file.fileName}
        </a>
        {file.mimeType && (
          <div className="text-xs text-muted-foreground/70 leading-tight truncate">
            {file.mimeType}
          </div>
        )}
      </div>
    </div>
  );
}
