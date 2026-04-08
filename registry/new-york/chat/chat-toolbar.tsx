/**
 * @module chat-toolbar
 *
 * Sticky bottom input area for message composition. Compose
 * `ChatToolbarTextarea`, `ChatToolbarAddon`, and `ChatToolbarButton`
 * inside a `ChatToolbar` container.
 *
 * Typical structure:
 * ```
 * ChatToolbar
 * ├── ChatToolbarAddon (align="inline-start")  ← left button(s)
 * │   └── ChatToolbarButton
 * ├── ChatToolbarTextarea                       ← auto-growing input
 * └── ChatToolbarAddon (align="inline-end")     ← right button(s)
 *     └── ChatToolbarButton (×N)
 * ```
 *
 * The `align` prop on `ChatToolbarAddon` controls position via CSS
 * `order`:
 * - `"inline-start"` → left of the textarea
 * - `"inline-end"` → right of the textarea
 * - `"block-start"` → full-width row above the textarea
 * - `"block-end"` → full-width row below the textarea
 */

"use client";

import * as React from "react";
import { FileTextIcon, PaperclipIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/registry/new-york/ui/textarea";
import { Button } from "@/registry/new-york/ui/button";

export interface ChatToolbarProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
}

/**
 * Sticky bottom container for the message input and action buttons.
 * Renders a bordered, rounded inner wrapper with flex-wrap layout.
 *
 * @example
 * ```tsx
 * <ChatToolbar>
 *   <ChatToolbarAddon align="inline-start">
 *     <ChatToolbarButton><PlusIcon /></ChatToolbarButton>
 *   </ChatToolbarAddon>
 *
 *   <ChatToolbarTextarea
 *     value={message}
 *     onChange={(e) => setMessage(e.target.value)}
 *     onSubmit={() => handleSendMessage()}
 *   />
 *
 *   <ChatToolbarAddon align="inline-end">
 *     <ChatToolbarButton><GiftIcon /></ChatToolbarButton>
 *     <ChatToolbarButton><SendIcon /></ChatToolbarButton>
 *   </ChatToolbarAddon>
 * </ChatToolbar>
 * ```
 */
export function ChatToolbar({
  children,
  className,
  ...props
}: ChatToolbarProps) {
  return (
    <div
      className={cn("sticky bottom-0 p-2 pt-0 bg-background", className)}
      {...props}
    >
      <div
        className={cn(
          "border rounded-md py-2 px-3",
          "flex flex-wrap items-start gap-x-2",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Modifier key that allows inserting a new line instead of submitting */
const NEWLINE_MODIFIER_KEY = "shiftKey" as const;

export interface ChatToolbarTextareaProps extends React.ComponentProps<
  typeof Textarea
> {
  /** Called when the user presses Enter (without Shift). Use this to trigger message sending. */
  onSubmit?: () => void;
}

/**
 * Auto-growing textarea with built-in submit handling.
 *
 * - **Enter** → calls `onSubmit()`
 * - **Shift+Enter** → inserts a new line
 *
 * Accepts all standard `<textarea>` / shadcn `Textarea` props
 * (`value`, `onChange`, `placeholder`, etc.).
 *
 * @example
 * ```tsx
 * const [message, setMessage] = useState("");
 *
 * <ChatToolbarTextarea
 *   value={message}
 *   onChange={(e) => setMessage(e.target.value)}
 *   onSubmit={() => {
 *     sendMessage(message);
 *     setMessage("");
 *   }}
 * />
 * ```
 */
export function ChatToolbarTextarea({
  className,
  onSubmit,
  onKeyDown,
  ...props
}: ChatToolbarTextareaProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e[NEWLINE_MODIFIER_KEY]) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  return (
    <div className="flex-1 min-w-0 order-2 grid">
      <Textarea
        id="toolbar-input"
        placeholder="Type your message..."
        className={cn(
          "h-fit min-h-10 max-h-30 px-1 @md/chat:text-base",
          "border-none shadow-none focus-visible:border-none focus-visible:ring-0 placeholder:whitespace-nowrap resize-none",
          className,
        )}
        rows={1}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </div>
  );
}

const chatToolbarAddonAlignStyles = {
  "inline-start": "order-1",
  "inline-end": "order-3",
  "block-start": "order-0 w-full h-auto",
  "block-end": "order-4 w-full h-auto",
};

export interface ChatToolbarAddonProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
  /**
   * Position of this addon relative to the textarea.
   * - `"inline-start"` — left of the textarea (default)
   * - `"inline-end"` — right of the textarea
   * - `"block-start"` — full-width row above the textarea
   * - `"block-end"` — full-width row below the textarea
   */
  align?: "inline-start" | "inline-end" | "block-start" | "block-end";
}

/**
 * Groups action buttons at a specific position within the toolbar.
 * Use the `align` prop to control placement relative to the textarea.
 *
 * @example
 * ```tsx
 * // Left side
 * <ChatToolbarAddon align="inline-start">
 *   <ChatToolbarButton><PlusIcon /></ChatToolbarButton>
 * </ChatToolbarAddon>
 *
 * // Right side
 * <ChatToolbarAddon align="inline-end">
 *   <ChatToolbarButton><SendIcon /></ChatToolbarButton>
 * </ChatToolbarAddon>
 *
 * // Full-width row above
 * <ChatToolbarAddon align="block-start">
 *   <ChatToolbarButton><AttachIcon /></ChatToolbarButton>
 * </ChatToolbarAddon>
 * ```
 */
export function ChatToolbarAddon({
  children,
  className,
  align = "inline-start",
  ...props
}: ChatToolbarAddonProps) {
  return (
    <div
      className={cn(
        "h-10 flex items-center gap-1.5",
        chatToolbarAddonAlignStyles[align],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ChatToolbarButtonProps extends React.ComponentProps<
  typeof Button
> {
  children?: React.ReactNode;
}

/**
 * Pre-styled ghost icon button for toolbar actions. Responsive sizing
 * via container queries. SVG icons inside are automatically sized.
 *
 * @example
 * ```tsx
 * <ChatToolbarButton>
 *   <SendIcon />
 * </ChatToolbarButton>
 * ```
 */
export function ChatToolbarButton({
  children,
  className,
  ...props
}: ChatToolbarButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "size-8 @md/chat:size-9 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='size-'])]:@md/chat:size-5 [&_svg]:stroke-[1.7px]",
        className,
      )}
      type="button"
      {...props}
    >
      {children}
    </Button>
  );
}

export interface ChatToolbarAttachmentButtonProps extends Omit<
  ChatToolbarButtonProps,
  "onClick"
> {
  /** Called with the selected files when the user picks one or more files. */
  onFilesSelected?: (files: File[]) => void;
  /** Comma-separated MIME types or extensions to accept (e.g. `"image/*,.pdf"`). */
  accept?: string;
  /** Allow selecting multiple files. Defaults to `true`. */
  multiple?: boolean;
}

/**
 * Toolbar button that opens a native file picker on click.
 * Renders a hidden `<input type="file">` and forwards selected files
 * via the `onFilesSelected` callback.
 *
 * @example
 * ```tsx
 * <ChatToolbarAttachmentButton
 *   accept="image/*,.pdf"
 *   onFilesSelected={(files) => setAttachments(files)}
 * />
 * ```
 */
export interface ChatToolbarAttachmentProps extends React.ComponentProps<"div"> {
  /** The file name to display. */
  fileName: string;
  /** Called when the user clicks the remove button. */
  onRemove?: () => void;
}

/**
 * Displays a file attachment preview as a square card with a file icon,
 * file name, and a small remove button in the top-right corner.
 * Discord-style attachment preview for the toolbar.
 *
 * @example
 * ```tsx
 * <ChatToolbarAddon align="block-start">
 *   {files.map((file, i) => (
 *     <ChatToolbarAttachment
 *       key={i}
 *       file={file}
 *       onRemove={() => removeFile(i)}
 *     />
 *   ))}
 * </ChatToolbarAddon>
 * ```
 */
export function ChatToolbarAttachment({
  fileName,
  onRemove,
  className,
  ...props
}: ChatToolbarAttachmentProps) {
  return (
    <div
      className={cn(
        "relative group size-20 @md/chat:size-30 rounded-md border bg-muted flex flex-col items-center justify-center gap-1 shrink-0",
        className,
      )}
      {...props}
    >
      <FileTextIcon className="size-5 @md/chat:size-6 text-muted-foreground stroke-[1.5px]" />
      <span className="text-[10px] @md/chat:text-xs text-muted-foreground leading-tight max-w-[calc(100%-8px)] truncate">
        {fileName}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-0 right-0 size-4 @md/chat:size-5 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <XIcon className="size-2.5 @md/chat:size-3" />
        </button>
      )}
    </div>
  );
}

export function ChatToolbarAttachmentButton({
  children,
  onFilesSelected,
  accept,
  multiple = true,
  ...props
}: ChatToolbarAttachmentButtonProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected?.(Array.from(files));
    }
    // Reset so the same file can be re-selected
    e.target.value = "";
  };

  return (
    <>
      <ChatToolbarButton onClick={handleClick} {...props}>
        {children ?? <PaperclipIcon />}
      </ChatToolbarButton>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
    </>
  );
}
