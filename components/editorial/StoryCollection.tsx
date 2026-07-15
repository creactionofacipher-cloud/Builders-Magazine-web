import type { Story } from "@/types/content";
import type { EnabledLocale } from "@/lib/i18n/locales";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/ui/Heading";
import { StoryCard } from "./StoryCard";
import { cn } from "@/utils/cn";

interface StoryCollectionProps {
  title: string;
  stories: Story[];
  locale: EnabledLocale;
  className?: string;
}

// Titled grid of StoryCards. Reusable for any "N stories" section —
// homepage's Featured Stories and Featured Content now, later the
// Stories listing page and related-stories blocks on detail pages.
export function StoryCollection({ title, stories, locale, className }: StoryCollectionProps) {
  if (stories.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <Heading level={2}>{title}</Heading>
      <Grid columns={3}>
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} locale={locale} />
        ))}
      </Grid>
    </div>
  );
}
