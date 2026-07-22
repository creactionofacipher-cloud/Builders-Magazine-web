import type { SocialPost, SocialProvider } from "@/types/content";
import { mockSocialPosts } from "./mock-data";

// Provider-abstracted from the start: the Social Feed Layout Block never
// changes its `_type` or schema when a second network is added later —
// only this file grows a new case. Real Instagram Graph API integration
// (post-MVP) replaces the body of the "instagram" branch only; every
// caller (cms/services/layoutBlocks.ts's resolveDynamicBlocks()) keeps
// calling getSocialPosts(provider, count) unchanged.
async function getInstagramPosts(count: number): Promise<SocialPost[]> {
  return mockSocialPosts.filter((post) => post.provider === "instagram").slice(0, count);
}

export async function getSocialPosts(
  provider: SocialProvider = "instagram",
  count = 6,
): Promise<SocialPost[]> {
  switch (provider) {
    case "instagram":
      return getInstagramPosts(count);
    default:
      return [];
  }
}
