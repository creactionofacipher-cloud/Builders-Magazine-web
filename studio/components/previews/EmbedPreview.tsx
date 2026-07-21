import { detectEmbedProvider } from "../../lib/embedProvider";

interface EmbedSelection {
  url?: string;
  provider?: string;
}

const PROVIDER_GLYPH: Record<string, string> = {
  youtube: "▶ YouTube",
  vimeo: "▶ Vimeo",
  other: "🔗 Ссылка",
};

function EmbedMedia({ label }: { label: string }) {
  return (
    <div
      style={{
        width: 48,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        fontWeight: 600,
        background: "#f4f4f4",
        border: "1px solid #d0d0d0",
        borderRadius: 3,
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {label}
    </div>
  );
}

// Provider auto-detected from the URL (same rule the frontend renderer
// itself follows — see components/ui/Embed.tsx) rather than trusting the
// optional `provider` field, which an editor may have left blank.
export const embedPreview = {
  select: { url: "url", provider: "provider" },
  prepare({ url, provider }: EmbedSelection) {
    const detected = provider || detectEmbedProvider(url);
    return {
      title: url || "Embed без ссылки",
      subtitle: detected === "other" && provider ? provider : undefined,
      media: <EmbedMedia label={PROVIDER_GLYPH[detected] ?? PROVIDER_GLYPH.other} />,
    };
  },
};
