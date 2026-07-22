"use client";

import { useRouter, usePathname } from "next/navigation";
import { Filter } from "@/components/ui/Filter";
import { STORY_CATEGORIES, type StoryCategory } from "@/types/content";

interface StoryCategoryNavProps {
  active: StoryCategory | null;
  className?: string;
}

// Thin routing wrapper around the existing Filter primitive — category
// selection is a real navigation (updates the URL's ?category= param via
// router.push), not local-only client state. That makes filtered views
// shareable/bookmarkable and lets the page filter server-side, so this
// covers both "Filtering" and "Category navigation" as one mechanism.
export function StoryCategoryNav({ active, className }: StoryCategoryNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(category: StoryCategory | null) {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    router.push(`${pathname}${query}`);
  }

  return (
    <Filter
      options={STORY_CATEGORIES}
      value={active}
      onChange={handleChange}
      allLabel="Все"
      ariaLabel="Фильтр по категории"
      className={className}
    />
  );
}
