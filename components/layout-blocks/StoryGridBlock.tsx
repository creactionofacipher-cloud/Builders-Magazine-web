import type { EnabledLocale } from "@/lib/i18n/locales";
import type { StoryGridBlock as StoryGridBlockType } from "@/types/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/ui/Heading";
import { StoryCard } from "@/components/editorial/StoryCard";
import { getBlockSectionProps, resolveContainerWidth } from "./blockSettings";

interface StoryGridBlockProps {
  block: StoryGridBlockType;
  locale: EnabledLocale;
}

// dataSource ("manual" vs "automatic") is resolved upstream — by the time
// this renders, `block.stories` is already a plain Story[] regardless of
// where it came from (see cms/services/layoutBlocks.ts's
// resolveDynamicBlocks()). This component doesn't know or care which
// mode produced them.
export function StoryGridBlock({ block, locale }: StoryGridBlockProps) {
  const stories = block.stories ?? [];
  if (stories.length === 0) return null;

  const sectionProps = getBlockSectionProps(block.settings);
  const width = resolveContainerWidth(block.settings);

  if (block.layout === "editorial") {
    const [first, ...rest] = stories;
    return (
      <Section {...sectionProps}>
        <Container width={width} className="flex flex-col gap-8">
          {block.title && <Heading level={2}>{block.title}</Heading>}
          <div className="grid gap-[var(--spacing-gutter-lg)] lg:grid-cols-3">
            <StoryCard story={first} locale={locale} className="lg:col-span-2" />
            <div className="flex flex-col gap-8">
              {rest.slice(0, 2).map((story, index) => (
                <StoryCard key={`${index}-${story.id}`} story={story} locale={locale} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  const columns = block.layout === "2-columns" ? 2 : 3;

  return (
    <Section {...sectionProps}>
      <Container width={width} className="flex flex-col gap-8">
        {block.title && <Heading level={2}>{block.title}</Heading>}
        <Grid columns={columns}>
          {stories.map((story, index) => (
            <StoryCard key={`${index}-${story.id}`} story={story} locale={locale} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
