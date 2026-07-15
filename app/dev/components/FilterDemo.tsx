"use client";

import { useState } from "react";
import { Filter } from "@/components/ui/Filter";
import { storyCategories } from "./fixtures";

export function FilterDemo() {
  const [value, setValue] = useState<(typeof storyCategories)[number] | null>(null);

  return <Filter options={storyCategories} value={value} onChange={setValue} allLabel="Все" />;
}
