import { cn } from "@/lib/utils";
import {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarProps,
} from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
