import Image from "next/image";
import React from "react";

export function GitHubInvertocatIcon(
  props: Partial<React.ComponentProps<typeof Image>>
) {
  return (
    <Image
      width={16}
      height={16}
      {...props}
      src="/icons/github-mark.svg"
      alt="GitHub Invertocat Icon"
    />
  );
}
