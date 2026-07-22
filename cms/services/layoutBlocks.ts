import type { LayoutBlock } from "@/types/content";
import { getStories } from "./stories";
import { getSocialPosts } from "./socialFeed";

// Resolves every "query-driven" block in an already-mapped LayoutBlock[]
// (i.e. called *after* mapLayoutBlocks(), not instead of it — see
// cms/mappers/layoutBlocks.ts). Lives in the services layer, not the
// mapper, because it needs to call other services (getStories,
// getSocialPosts) — mappers are pure raw→typed transforms and never
// import from cms/services (that would invert the dependency direction
// every other mapper in this codebase relies on).
//
// Renderers never see any of this: components/layout-blocks/StoryGridBlock.tsx
// and SocialFeedBlock.tsx just read `block.stories`/`block.posts`,
// identical in shape whether they came from a manual GROQ reference or
// from here. Every consumer of Layout Blocks (getHomepage, getLandingPageBySlug)
// calls this once, right after its own mapX() call.
export async function resolveDynamicBlocks(blocks: LayoutBlock[]): Promise<LayoutBlock[]> {
  return Promise.all(
    blocks.map(async (block) => {
      if (block._type === "storyGrid" && block.dataSource === "automatic") {
        const stories = await getStories({
          category: block.category,
          tag: block.tag,
          limit: block.count,
          sort: block.sort,
        });
        return { ...block, stories };
      }
      if (block._type === "socialFeed") {
        const posts = await getSocialPosts(block.provider, block.count);
        return { ...block, posts };
      }
      return block;
    }),
  );
}
