import type { GallerySettings, MediaAsset } from "@/types/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Gallery } from "@/components/ui/Gallery";

interface GallerySectionProps {
  images?: MediaAsset[];
  settings?: GallerySettings;
  surface?: boolean;
}

// The "Галерея" section shared by every detail page's own gallery field
// (Story/Issue/Builders Cup/Product) — the one place that decides how
// Gallery sits in the page layout. Grid mode keeps the original
// single-column-inside-Container shape; strip mode renders Gallery as a
// sibling of the Container (not nested inside it) so it can span full
// width the same way components/layout-blocks/HorizontalImageStripBlock.tsx
// does for the Layout Block version — Container is what caps width via
// max-w-7xl, so anything that needs to break out of it just has to not
// be inside one.
export function GallerySection({ images, settings, surface }: GallerySectionProps) {
  if (!images || images.length === 0) return null;

  if (settings?.layout === "strip") {
    return (
      <Section surface={surface}>
        <div className="flex flex-col gap-8">
          <Container>
            <Heading level={2}>Галерея</Heading>
          </Container>
          <Gallery images={images} {...settings} />
        </div>
      </Section>
    );
  }

  return (
    <Section surface={surface}>
      <Container className="flex flex-col gap-8">
        <Heading level={2}>Галерея</Heading>
        <Gallery images={images} {...settings} />
      </Container>
    </Section>
  );
}
