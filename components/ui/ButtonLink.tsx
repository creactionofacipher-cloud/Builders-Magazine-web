import type { ComponentProps } from "react";
import NextLink from "next/link";
import { buttonClassName, type ButtonSize, type ButtonVariant } from "./button-styles";

type ButtonLinkProps = ComponentProps<typeof NextLink> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return <NextLink className={buttonClassName(variant, size, className)} {...props} />;
}
