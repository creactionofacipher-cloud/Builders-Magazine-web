import NextImage from "next/image";
import type { SocialFeedBlock as SocialFeedBlockType } from "@/types/content";
import { SOCIAL_PROVIDER_LABELS } from "@/types/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getBlockSectionProps, resolveContainerWidth } from "./blockSettings";

interface SocialFeedBlockProps {
  block: SocialFeedBlockType;
}

// Posts are resolved upstream by cms/services/layoutBlocks.ts's
// resolveDynamicBlocks(), via cms/services/socialFeed.ts's
// provider-dispatching getSocialPosts() — this renderer never talks to
// any social API directly and never hardcodes Instagram beyond reading
// the SOCIAL_PROVIDER_LABELS map; a future provider is a new case in
// that service file, not a change here. Plain next/image (not
// components/ui/Image), since SocialPost isn't a MediaAsset and doesn't
// need the lightbox/blur-preset machinery Image wraps.
export function SocialFeedBlock({ block }: SocialFeedBlockProps) {
  const posts = block.posts ?? [];
  if (posts.length === 0) return null;

  const provider = block.provider ?? "instagram";
  // Prefer the editor-authored link; fall back to the first resolved
  // post's permalink only so the block still shows a working button
  // before an editor has filled this in (mainly relevant to the mock
  // provider — a real integration has no reliable way to hand back a
  // profile URL on its own, which is exactly why profileUrl exists).
  const profileUrl = block.profileUrl || posts[0]?.permalink;

  return (
    <Section {...getBlockSectionProps(block.settings)}>
      <Container width={resolveContainerWidth(block.settings)} className="flex flex-col gap-8">
        {block.title && <Heading level={2}>{block.title}</Heading>}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={post.caption || "Открыть публикацию в Instagram"}
              className="relative block aspect-square overflow-hidden bg-surface"
            >
              <NextImage
                src={post.imageUrl}
                alt=""
                fill
                sizes="(min-width: 768px) 16vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </a>
          ))}
        </div>
        {profileUrl && (
          <ButtonLink
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-center"
          >
            Подписаться в {SOCIAL_PROVIDER_LABELS[provider]}
          </ButtonLink>
        )}
      </Container>
    </Section>
  );
}
