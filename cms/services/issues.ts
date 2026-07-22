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

export async function getCurrentIssue(): Promise<Issue | null> {
  const issues = await getAllIssues();
  return issues[0] ?? null;
}

export async function getIssueBySlug(slug: string): Promise<Issue | null> {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawIssue | null>(ISSUE_BY_SLUG_QUERY, { slug });
    return raw ? mapIssue(raw) : null;
  }
  const issue = mockIssues.find((i) => i.slug === slug);
  return issue && isPublished(issue) ? issue : null;
}
