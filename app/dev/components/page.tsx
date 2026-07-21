import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Grid } from "@/components/layout/Grid";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { List } from "@/components/ui/List";
import { Quote } from "@/components/ui/Quote";
import { RichText } from "@/components/ui/RichText";
import { Divider } from "@/components/ui/Divider";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SearchInput } from "@/components/ui/SearchInput";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Image } from "@/components/ui/Image";
import { Gallery } from "@/components/ui/Gallery";
import { ImageGrid } from "@/components/ui/ImageGrid";
import { IssueCard } from "@/components/editorial/IssueCard";
import { StoryCard } from "@/components/editorial/StoryCard";
import { BikeCard } from "@/components/editorial/BikeCard";
import { BuilderCard } from "@/components/editorial/BuilderCard";
import { FilterDemo } from "./FilterDemo";
import { bike, builder, galleryImages, issue, richTextSample, story, wideImage } from "./fixtures";

// Full literal class names — Tailwind's static scanner cannot resolve
// dynamically interpolated class strings like `bg-neutral-${step}`.
const NEUTRAL_SWATCHES = [
  { step: 50, className: "bg-neutral-50" },
  { step: 100, className: "bg-neutral-100" },
  { step: 200, className: "bg-neutral-200" },
  { step: 300, className: "bg-neutral-300" },
  { step: 400, className: "bg-neutral-400" },
  { step: 500, className: "bg-neutral-500" },
  { step: 600, className: "bg-neutral-600" },
  { step: 700, className: "bg-neutral-700" },
  { step: 800, className: "bg-neutral-800" },
  { step: 900, className: "bg-neutral-900" },
  { step: 950, className: "bg-neutral-950" },
] as const;

function Catalog({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <Heading level={3}>{title}</Heading>
      {children}
    </div>
  );
}

// Internal design-system catalog — not part of the public site, not
// locale-routed. Unavailable in production (404s below), but noindex
// regardless as defense-in-depth (also disallowed in app/robots.ts).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DevComponentsPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <Container className="flex flex-col gap-16 py-16">
      <div className="flex flex-col gap-2">
        <Badge>Milestone 2</Badge>
        <Heading level={1}>Design System Catalog</Heading>
        <Text variant="muted">
          Every reusable component from docs/04_TECH_STACK.md and docs/07_TASKS.md, rendered with
          representative mock data. Internal tool — not reachable in production.
        </Text>
      </div>

      <Divider />

      <Catalog title="Color">
        <div className="flex flex-wrap gap-4">
          {NEUTRAL_SWATCHES.map(({ step, className }) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <div
                className={`h-16 w-16 rounded-[var(--radius-sm)] border border-border ${className}`}
              />
              <Text variant="muted" className="text-xs">
                {step}
              </Text>
            </div>
          ))}
        </div>
      </Catalog>

      <Divider />

      <Catalog title="Typography">
        <div className="flex flex-col gap-4">
          <Heading level={1}>Heading level 1</Heading>
          <Heading level={2}>Heading level 2</Heading>
          <Heading level={3}>Heading level 3</Heading>
          <Heading level={4}>Heading level 4</Heading>
          <Text variant="lead">Lead text — used for section intros and standfirsts.</Text>
          <Text variant="body">
            Body text — the default reading paragraph style, tuned for comfortable line length and
            rhythm.
          </Text>
          <Text variant="small">Small text — captions and metadata.</Text>
          <Text variant="muted">Muted text — secondary information.</Text>
          <List as="ul">
            <li>Unordered list item one</li>
            <li>Unordered list item two</li>
          </List>
          <List as="ol">
            <li>Ordered list item one</li>
            <li>Ordered list item two</li>
          </List>
          <Quote>“A pull quote, set larger and indented from the body copy.”</Quote>
        </div>
      </Catalog>

      <Divider />

      <Catalog title="Rich Text (Portable Text)">
        <RichText value={richTextSample} />
      </Catalog>

      <Divider />

      <Catalog title="Buttons">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" size="sm">
            Primary / sm
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <ButtonLink href="#" variant="secondary">
            ButtonLink
          </ButtonLink>
        </div>
      </Catalog>

      <Divider />

      <Catalog title="Badge & Tag">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Culture</Badge>
          <Badge>Interview</Badge>
          <Tag>Unselected</Tag>
          <Tag selected>Selected</Tag>
        </div>
      </Catalog>

      <Divider />

      <Catalog title="Divider">
        <Divider />
        <div className="flex h-8 items-center gap-4">
          <Text variant="small">Left</Text>
          <Divider orientation="vertical" />
          <Text variant="small">Right</Text>
        </div>
      </Catalog>

      <Divider />

      <Catalog title="Media">
        <Grid columns={3}>
          <Image asset={wideImage} preset="editorial" showCaption sizes="(min-width: 1024px) 33vw, 100vw" />
        </Grid>
        <Text variant="muted">Gallery</Text>
        <Gallery images={galleryImages} />
        <Text variant="muted">ImageGrid</Text>
        <ImageGrid images={galleryImages} />
      </Catalog>

      <Divider />

      <Catalog title="Interactive">
        <div className="flex max-w-sm flex-col gap-6">
          <SearchInput placeholder="Поиск по журналу..." />
          <FilterDemo />
          <div className="flex items-center gap-3">
            <Text variant="muted">Тема:</Text>
            <ThemeToggle className="border border-border" />
          </div>
        </div>
      </Catalog>

      <Divider />

      <Catalog title="Editorial Cards">
        <Grid columns={3}>
          <IssueCard issue={issue} locale="ru" />
          <StoryCard story={story} locale="ru" />
          <BikeCard bike={bike} />
          <BuilderCard builder={builder} />
        </Grid>
      </Catalog>

      <Divider />

      <Catalog title="Header">
        <div className="border border-border">
          <Header locale="ru" siteTitle="Builders Magazine" />
        </div>
      </Catalog>

      <Catalog title="Footer">
        <div className="border border-border">
          <Footer
            locale="ru"
            siteTitle="Builders Magazine"
            footerText="Builders Magazine — независимый печатный журнал, посвящённый культуре кастомных мотоциклов."
          />
        </div>
      </Catalog>

      <Divider />

      <Catalog title="Section (with surface background)">
        <div className="border border-border">
          <Section surface>
            <Container>
              <Text>Section owns vertical rhythm; surface toggles the subtle background.</Text>
            </Container>
          </Section>
        </div>
      </Catalog>
    </Container>
  );
}
