import type { Product } from "@/types/content";
import type { EnabledLocale } from "@/lib/i18n/locales";
import { formatPrice } from "@/lib/formatPrice";
import { Link } from "@/components/ui/Link";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { HighlightText } from "@/components/ui/HighlightText";
import { cn } from "@/utils/cn";

interface ProductCardProps {
  product: Product;
  locale: EnabledLocale;
  className?: string;
  /** Highlights the matching substring in the title — set when this card
   * renders inside search results. Omitted everywhere else. */
  highlightQuery?: string;
}

// Whole card is a Link to the detail page, same pattern as StoryCard —
// no nested anchor issue because there's no second interactive element
// on the card. The external purchase button lives only on the detail
// page (/buy/merchandise/[slug]).
export function ProductCard({ product, locale, className, highlightQuery }: ProductCardProps) {
  const priceLabel = formatPrice(product.price, product.currency);

  return (
    <Link
      href={`/${locale}/buy/merchandise/${product.slug}`}
      variant="plain"
      className={cn("group flex flex-col gap-3", className)}
    >
      <Image
        asset={product.mainImage}
        preset="card"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="transition-opacity duration-[var(--duration-base)] ease-[var(--ease-standard)] group-hover:opacity-90"
      />
      <div className="flex flex-col gap-1">
        {product.soldOut ? (
          // Plain element, not <Text variant="muted">, deliberately: cn()
          // is a non-merging string join (utils/cn.ts), so stacking a
          // color override className on top of a variant that already
          // sets text-muted would leave which one wins to Tailwind's
          // generated CSS order rather than intent. text-error is the
          // theme's existing semantic color for exactly this kind of
          // state (styles/tokens.css) — no new color introduced.
          <p className="font-body text-xs font-bold tracking-wide text-error uppercase">
            Sold Out
          </p>
        ) : (
          <Text variant="muted" className="text-xs tracking-wide uppercase">
            {priceLabel}
          </Text>
        )}
        <Heading level={3}>
          <HighlightText text={product.name} query={highlightQuery} />
        </Heading>
        <Text variant="muted">{product.shortDescription}</Text>
      </div>
    </Link>
  );
}
