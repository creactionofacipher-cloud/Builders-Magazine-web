interface HighlightTextProps {
  text: string;
  query?: string;
}

// Wraps the first occurrence of `query` inside `text` in a <mark> — used
// by search result cards (see each card's optional `highlightQuery`
// prop) to show why a result matched. A no-op (renders `text` unchanged)
// whenever there's no query or no match, so it's safe to use unconditionally.
export function HighlightText({ text, query }: HighlightTextProps) {
  const trimmed = query?.trim();
  if (!trimmed) return <>{text}</>;

  const index = text.toLowerCase().indexOf(trimmed.toLowerCase());
  if (index === -1) return <>{text}</>;

  const before = text.slice(0, index);
  const match = text.slice(index, index + trimmed.length);
  const after = text.slice(index + trimmed.length);

  return (
    <>
      {before}
      <mark className="bg-transparent font-semibold text-foreground underline decoration-2 underline-offset-2">
        {match}
      </mark>
      {after}
    </>
  );
}
