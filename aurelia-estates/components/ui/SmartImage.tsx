"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { blurDataURL, type BlurTone } from "@/lib/images";
import { cn } from "@/lib/utils";

type SmartImageProps = Omit<ImageProps, "placeholder" | "blurDataURL"> & { tone?: BlurTone };

/**
 * next/image with a branded blur placeholder. If a remote image fails to load
 * the blur stays in place instead of a broken-image icon.
 */
export function SmartImage({ tone = "sand", className, alt, onError, ...props }: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      {...props}
      alt={alt}
      placeholder="blur"
      blurDataURL={blurDataURL(tone)}
      className={cn(className, failed && "opacity-0")}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
