import type { EnabledLocale } from "@/lib/i18n/locales";
import type { MerchandiseBlock as MerchandiseBlockType } from "@/types/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/ui/Heading";
import { ProductCard } from "@/components/editorial/ProductCard";
import { getBlockSectionProps, resolveContainerWidth } from "./blockSettings";

interface MerchandiseBlockProps {
  block: MerchandiseBlockType;
  locale: EnabledLocale;
}

// Small self-contained title+Grid+ProductCard composition — mirrors
// StoryCollection's shape (title + titled Grid) but inline, since no
// reusable "product collection" component exists elsewhere yet.
export function MerchandiseBlock({ block, locale }: MerchandiseBlockProps) {
  const products = block.products ?? [];
  if (products.length === 0) return null;

  return (
    <Section {...getBlockSectionProps(block.settings, true)}>
      <Container width={resolveContainerWidth(block.settings)} className="flex flex-col gap-8">
        {block.title && <Heading level={2}>{block.title}</Heading>}
        <Grid columns={3}>
          {products.map((product, index) => (
            <ProductCard key={`${index}-${product.id}`} product={product} locale={locale} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
