import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Card, Flex, Spinner, Stack, Text, TextInput } from "@sanity/ui";
import { set, unset, useClient, type ReferenceInputProps } from "sanity";
import { previewImageUrl } from "../../lib/imageUrl";

// Sanity's built-in reference input has no documented way to control the
// sort order of its search/browse dropdown — confirmed against the
// installed `sanity` package's own TypeScript types: ReferenceBaseOptions
// only exposes `disableNew`/`creationTypeFilter`, and the `filter` option
// is GROQ-boolean-only (no order() support). Editors picking a
// just-uploaded photo want it to actually show up first, so this
// replaces the default search UI (wired via each mediaAsset reference
// field's `components.input` — see studio/schemas/*.ts) with one that
// queries mediaAsset directly, sorted _createdAt desc.
//
// Deliberately narrower than Sanity's own reference input: no inline
// "Create new" button (create media assets from the Media Asset list
// instead), no weak-reference badge (no mediaAsset reference field in
// this schema is weak). The search box stays always visible rather than
// toggling between a "selected" and "searching" state, which keeps the
// state machine simple and predictable.
const API_VERSION = "2025-01-01";
const PAGE_SIZE = 50;
const SEARCH_DEBOUNCE_MS = 200;

interface MediaAssetHit {
  _id: string;
  altText?: string;
  caption?: string;
  file?: unknown;
}

export function SortedMediaAssetReferenceInput(props: ReferenceInputProps) {
  const { value, onChange, schemaType } = props;
  const client = useClient({ apiVersion: API_VERSION });
  const types = useMemo(() => schemaType.to.map((t) => t.name), [schemaType.to]);

  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<MediaAssetHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<MediaAssetHit | null>(null);

  const currentRef = value?._ref;

  useEffect(() => {
    let cancelled = false;
    if (!currentRef) {
      setCurrent(null);
      return undefined;
    }
    client
      .fetch<MediaAssetHit | null>(`*[_id == $id][0]{_id, altText, caption, file}`, {
        id: currentRef,
      })
      .then((doc) => {
        if (!cancelled) setCurrent(doc);
      })
      .catch(() => {
        if (!cancelled) setCurrent(null);
      });
    return () => {
      cancelled = true;
    };
  }, [client, currentRef]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(() => {
      const trimmed = query.trim();
      const filter = trimmed
        ? "_type in $types && (altText match $q || caption match $q)"
        : "_type in $types";
      client
        .fetch<MediaAssetHit[]>(
          `*[${filter}] | order(_createdAt desc) [0...${PAGE_SIZE}] {_id, altText, caption, file}`,
          { types, q: `${trimmed}*` },
        )
        .then((results) => {
          if (!cancelled) setHits(results);
        })
        .catch(() => {
          if (!cancelled) setHits([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [client, query, types]);

  const select = useCallback(
    (id: string) => onChange(set({ _type: "reference", _ref: id })),
    [onChange],
  );
  const clear = useCallback(() => onChange(unset()), [onChange]);

  return (
    <Stack space={3}>
      {currentRef && (
        <Card padding={2} radius={2} tone="primary" border>
          <Flex align="center" gap={3}>
            <Thumbnail source={current?.file} label={current?.altText || current?.caption} />
            <Box flex={1}>
              <Text size={1}>{current?.altText || current?.caption || "Загрузка…"}</Text>
            </Box>
            <Button mode="bleed" tone="critical" text="Убрать" fontSize={1} onClick={clear} />
          </Flex>
        </Card>
      )}
      <TextInput
        placeholder="Поиск по названию…"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
      <Card border radius={2} style={{ maxHeight: 320, overflowY: "auto" }}>
        {loading ? (
          <Flex padding={4} justify="center">
            <Spinner muted />
          </Flex>
        ) : hits.length === 0 ? (
          <Box padding={3}>
            <Text size={1} muted>
              Ничего не найдено
            </Text>
          </Box>
        ) : (
          <Stack space={0}>
            {hits.map((hit) => (
              <Box key={hit._id}>
                <button
                  type="button"
                  onClick={() => select(hit._id)}
                  style={{
                    all: "unset",
                    display: "block",
                    width: "100%",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <Card padding={2} tone={hit._id === currentRef ? "primary" : undefined}>
                    <Flex align="center" gap={3}>
                      <Thumbnail source={hit.file} label={hit.altText || hit.caption} />
                      <Text size={1}>{hit.altText || hit.caption || hit._id}</Text>
                    </Flex>
                  </Card>
                </button>
              </Box>
            ))}
          </Stack>
        )}
      </Card>
    </Stack>
  );
}

function Thumbnail({ source, label }: { source?: unknown; label?: string }) {
  const url = previewImageUrl(source, 64);
  return (
    <Box style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 3, overflow: "hidden", background: "#e0e0e0" }}>
      {url && (
        <img
          src={url}
          alt={label ?? ""}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}
    </Box>
  );
}
