import Image from "next/image";
import React from "react";

export function GitHubInvertocatIcon(
  props: Partial<React.ComponentProps<typeof Image>>
) {
  return (
    <>
      <Image
        className="invert dark:invert-0"
        width={16}
        height={16}
        {...props}
        src={"/icons/github-mark-white.svg"}
        alt="GitHub Invertocat Icon"
      />
    </>
  );
}
