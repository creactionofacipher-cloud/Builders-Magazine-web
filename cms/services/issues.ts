import type { Issue } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { ALL_ISSUES_QUERY, ISSUE_BY_SLUG_QUERY } from "@/cms/queries/issue";
import { mapIssue, type RawIssue } from "@/cms/mappers/issue";
import { mockIssues } from "./mock-data";

function byReleaseDateDesc(a: Issue, b: Issue): number {
  return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
}

// Sanity path when configured (see cms/sanity/client.ts), mock fallback
// otherwise — same signature either way, callers never change.

// Mirrors the Sanity path's PUBLISHED_FILTER (cms/queries/issue.ts) —
// an untouched status field is treated as visible, only an explicit
// "draft" hides it.
function isPublished(issue: Issue): boolean {
  return issue.status !== "draft";
}

export async function getAllIssues(): Promise<Issue[]> {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawIssue[]>(ALL_ISSUES_QUERY);
    return raw.map(mapIssue);
  }
  return [...mockIssues].filter(isPublished).sort(byReleaseDateDesc);
}

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

export async function getLatestIssuesForSale(limit = 2): Promise<Issue[]> {
  const issues = await getAllIssues();
  return issues.filter(hasBuyLink).sort(byNumberDesc).slice(0, limit);
}

export async function getIssueBySlug(slug: string): Promise<Issue | null> {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawIssue | null>(ISSUE_BY_SLUG_QUERY, { slug });
    return raw ? mapIssue(raw) : null;
  }
  const issue = mockIssues.find((i) => i.slug === slug);
  return issue && isPublished(issue) ? issue : null;
}
