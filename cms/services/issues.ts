import { cache } from "react";
import type { Issue } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { ALL_ISSUES_QUERY, ISSUE_BY_SLUG_QUERY } from "@/cms/queries/issue";
import { mapIssue, type RawIssue } from "@/cms/mappers/issue";
import { mockIssues } from "./mock-data";

function byReleaseDateDesc(a: Issue, b: Issue): number {
  return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
}

// Sanity path when configured (see cms/sanity/client.ts), mock fallback
// otherwise — same signature either way, callers never change. Every
// exported function here is wrapped in React's cache() so multiple call
// sites within the same render (e.g. a detail page's generateMetadata()
// plus its page body) share one underlying fetch instead of each
// triggering its own (see cms/services/siteSettings.ts's getSiteSettings
// for the original precedent of this pattern).

// Mirrors the Sanity path's PUBLISHED_FILTER (cms/queries/issue.ts) —
// an untouched status field is treated as visible, only an explicit
// "draft" hides it.
function isPublished(issue: Issue): boolean {
  return issue.status !== "draft";
}

export const getAllIssues = cache(async (): Promise<Issue[]> => {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawIssue[]>(ALL_ISSUES_QUERY);
    return raw.map(mapIssue);
  }
  return [...mockIssues].filter(isPublished).sort(byReleaseDateDesc);
});

// Number desc, Year desc tiebreaker — the Buy page's "latest issues for
// sale" showcase, not release-date order (an issue can be released later
// but assigned an earlier Number, e.g. a delayed reprint).
function byNumberDesc(a: Issue, b: Issue): number {
  if (b.number !== a.number) return b.number - a.number;
  return b.year - a.year;
}

// Only issues an editor has actually given a *working* purchase link —
// matches FeaturedIssue/IssueCard's own existing
// `issue.buyLinks?.[0]?.url` convention for "is this issue buyable".
// Checking array length alone isn't enough: a buyLinks entry can exist
// with a label but no url yet (Studio doesn't require it), which would
// pass a length check but render no Купить button at all.
function hasBuyLink(issue: Issue): boolean {
  return Boolean(issue.buyLinks?.[0]?.url);
}

export const getLatestIssuesForSale = cache(async (limit = 2): Promise<Issue[]> => {
  const issues = await getAllIssues();
  return issues.filter(hasBuyLink).sort(byNumberDesc).slice(0, limit);
});

export const getIssueBySlug = cache(async (slug: string): Promise<Issue | null> => {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawIssue | null>(ISSUE_BY_SLUG_QUERY, { slug });
    return raw ? mapIssue(raw) : null;
  }
  const issue = mockIssues.find((i) => i.slug === slug);
  return issue && isPublished(issue) ? issue : null;
});
