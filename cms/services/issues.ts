import type { Issue } from "@/types/content";
import { mockIssues } from "./mock-data";

function byReleaseDateDesc(a: Issue, b: Issue): number {
  return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
}

// Mock implementations — Milestone 10 replaces each body with a Sanity
// fetch behind the same signature. Callers never change.

export async function getAllIssues(): Promise<Issue[]> {
  return [...mockIssues].sort(byReleaseDateDesc);
}

export async function getCurrentIssue(): Promise<Issue | null> {
  const issues = await getAllIssues();
  return issues[0] ?? null;
}

export async function getIssueBySlug(slug: string): Promise<Issue | null> {
  return mockIssues.find((issue) => issue.slug === slug) ?? null;
}
