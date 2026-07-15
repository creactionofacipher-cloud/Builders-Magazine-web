import type { BuildersCup } from "@/types/content";
import { mockBuildersCupEvents } from "./mock-data";

function byDateDesc(a: BuildersCup, b: BuildersCup): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

// Mock implementations — Milestone 10 replaces each body with a Sanity
// fetch behind the same signature. Callers never change.

export async function getAllBuildersCupEvents(): Promise<BuildersCup[]> {
  return [...mockBuildersCupEvents].sort(byDateDesc);
}

export async function getLatestBuildersCup(): Promise<BuildersCup | null> {
  const events = await getAllBuildersCupEvents();
  return events[0] ?? null;
}

export async function getBuildersCupEventBySlug(slug: string): Promise<BuildersCup | null> {
  return mockBuildersCupEvents.find((event) => event.slug === slug) ?? null;
}
