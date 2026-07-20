interface JsonLdProps {
  data: object;
}

// `data` is always one of the builders in lib/seo/structuredData.ts —
// built server-side from our own typed models, never raw user input — so
// this is the standard, recommended way to embed structured data in a
// Next.js App Router page (a plain <script> tag; there's no dedicated API).
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
