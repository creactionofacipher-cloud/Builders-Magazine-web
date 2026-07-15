import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { RichText as RichTextValue } from "@/types/content";
import { cn } from "@/utils/cn";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { List } from "./List";
import { Quote } from "./Quote";
import { Link } from "./Link";

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <Text variant="body">{children}</Text>,
    h2: ({ children }) => <Heading level={2}>{children}</Heading>,
    h3: ({ children }) => <Heading level={3}>{children}</Heading>,
    h4: ({ children }) => <Heading level={4}>{children}</Heading>,
    blockquote: ({ children }) => <Quote>{children}</Quote>,
  },
  list: {
    bullet: ({ children }) => <List as="ul">{children}</List>,
    number: ({ children }) => <List as="ol">{children}</List>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => <Link href={(value?.href as string) ?? "#"}>{children}</Link>,
  },
};

interface RichTextProps {
  value: RichTextValue;
  className?: string;
}

export function RichText({ value, className }: RichTextProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <PortableText value={value} components={portableTextComponents} />
    </div>
  );
}
