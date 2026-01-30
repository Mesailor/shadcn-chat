"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarProps,
} from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function ChatHeader({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 p-2 bg-background flex items-center gap-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ChatHeaderMain({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & React.ComponentProps<"div">) {
  return (
    <div className={cn("flex-1 flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

export function ChatHeaderAddon({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
} & React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

export function ChatHeaderAvatar({
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
    <Avatar className={cn("rounded-full", className)} {...props}>
      <AvatarImage src={src} alt={alt} {...imageProps} />
      {fallback && (
        <AvatarFallback {...fallbackProps}>{fallback}</AvatarFallback>
      )}
    </Avatar>
  );
}

export function ChatHeaderButton({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & React.ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" size="icon-sm" className={cn(className)} {...props}>
      {children}
    </Button>
  );
}
