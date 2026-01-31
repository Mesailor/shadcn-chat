import { cn } from "@/lib/utils";
import {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarProps,
} from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMemo } from "react";

type ChatEventTimeFormat =
  | "time"
  | "date"
  | "dateTime"
  | "longDate"
  | "relative";

type ChatEventTimeProps = {
  timestamp: number | Date;
  format?: ChatEventTimeFormat;
  locale?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
} & React.ComponentProps<"time">;

const FORMAT_PRESETS: Record<ChatEventTimeFormat, Intl.DateTimeFormatOptions> =
  {
    time: { timeStyle: "short" },
    date: { dateStyle: "medium" },
    dateTime: { dateStyle: "medium", timeStyle: "short" },
    longDate: { dateStyle: "long" },
    relative: { dateStyle: "medium", timeStyle: "short" },
  };

export function ChatEvent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex gap-2 px-2", className)} {...props}>
      {children}
    </div>
  );
}

export function ChatEventAddon({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-10 @md/chat:w-12 h-full flex justify-center pt-1 shrink-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ChatEventBody({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex-1 flex flex-col", className)} {...props}>
      {children}
    </div>
  );
}

export function ChatEventContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("text-sm @md/chat:text-base", className)} {...props}>
      {children}
    </div>
  );
}

export function ChatEventTitle({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-2 text-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function ChatEventAvatar({
  className,
  src,
  alt,
  fallback,
  imageProps,
  fallbackProps,
  ...props
}: {
  className?: string;
  src?: AvatarImageProps["src"];
  alt?: string;
  fallback?: React.ReactNode;
  imageProps?: AvatarImageProps;
  fallbackProps?: AvatarFallbackProps;
} & AvatarProps) {
  return (
    <Avatar
      className={cn("rounded-full size-8 @md/chat:size-10", className)}
      {...props}
    >
      <AvatarImage src={src} alt={alt} {...imageProps} />
      {fallback && (
        <AvatarFallback {...fallbackProps}>{fallback}</AvatarFallback>
      )}
    </Avatar>
  );
}

function getRelativeTimeString(date: Date, locale: string): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second");
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, "minute");
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, "hour");
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return rtf.format(-diffInDays, "day");
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function ChatEventTime({
  timestamp,
  format = "dateTime",
  locale,
  formatOptions,
  className,
  ...props
}: ChatEventTimeProps) {
  const date = useMemo(
    () => (timestamp instanceof Date ? timestamp : new Date(timestamp)),
    [timestamp],
  );

  const resolvedLocale =
    locale ?? (typeof navigator !== "undefined" ? navigator.language : "en-US");

  const formattedTime = useMemo(() => {
    if (format === "relative") {
      return getRelativeTimeString(date, resolvedLocale);
    }

    const options = formatOptions ?? FORMAT_PRESETS[format];
    return new Intl.DateTimeFormat(resolvedLocale, options).format(date);
  }, [date, format, formatOptions, resolvedLocale]);

  const isoString = useMemo(() => date.toISOString(), [date]);

  return (
    <time
      dateTime={isoString}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    >
      {formattedTime}
    </time>
  );
}
