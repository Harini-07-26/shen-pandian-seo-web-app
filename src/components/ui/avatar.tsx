"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/* ─────────────────────── Avatar ───────────────────────────── */
const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

/* ─────────────────── AvatarImage ──────────────────────────── */
type AvatarImageProps = Omit<
  React.ComponentProps<typeof Image>,
  "fill" | "width" | "height"
> & {
  alt?: string;
};

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, alt = "Avatar image", ...props }, ref) => (
    <Image
      ref={ref}
      fill
      sizes="40px"
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
);
AvatarImage.displayName = "AvatarImage";

/* ──────────────── AvatarFallback ──────────────────────────── */
const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
