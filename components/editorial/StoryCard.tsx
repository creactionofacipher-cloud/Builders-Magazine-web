import type { Story } from "@/types/content";
import type { EnabledLocale } from "@/lib/i18n/locales";
import { Link } from "@/components/ui/Link";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";

interface StoryCardProps {
  story: Story;
  locale: EnabledLocale;
  className?: string;
}

export function StoryCard({ story, locale, className }: StoryCardProps) {
  return (
    <Link
      href={`/${locale}/stories/${story.slug}`}
      variant="plain"
      className={cn("group flex flex-col gap-3", className)}
    >
      <Image
        asset={story.coverImage}
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="transition-opacity duration-[var(--duration-base)] ease-[var(--ease-standard)] group-hover:opacity-90"
      />
      <div className="flex flex-col gap-2">
        <Badge>{story.category}</Badge>
        <Heading level={4}>{story.title}</Heading>
        <Text variant="small" className="text-muted">
          {story.shortDescription}
        </Text>
      </div>
    </Link>
  );
}
