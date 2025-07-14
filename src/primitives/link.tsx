import * as Headless from "@headlessui/react";
import NextLink from "next/link";
import React, { forwardRef } from "react";

export const Link = forwardRef(function Link(
  props: { href: string } & React.ComponentPropsWithoutRef<"a">,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  // Check if the link is external (starts with http/https or has target="_blank")
  const isExternal =
    props.href.startsWith("http") ||
    props.href.startsWith("https") ||
    props.target === "_blank";

  return (
    <Headless.DataInteractive>
      {isExternal ? (
        <a {...props} ref={ref} />
      ) : (
        <NextLink {...props} ref={ref} />
      )}
    </Headless.DataInteractive>
  );
});
