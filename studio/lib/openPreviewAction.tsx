import { useCallback } from "react";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";
import { LaunchIcon } from "@sanity/icons/Launch";
import { getFrontendOrigin, isPreviewableType, resolvePreviewPath } from "./previewUrl";

interface SlugValue {
  current?: string;
}

// A document-header action — "Add 'Open Preview' to Story, Issue,
// Builders Cup, Product and Home Page documents." Opens the same
// draft-mode-enabling URL the Presentation tool's own preview panel
// resolves via previewUrl (sanity.config.ts), just in a new tab instead
// of an in-Studio split pane. Registered from sanity.config.ts's existing
// `document.actions` callback (the one already used for the singleton
// restrictions) rather than a second, separate actions config.
export const openPreviewAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { type, published, draft } = props;
  const doc = (draft ?? published) as { slug?: SlugValue } | null;
  const slug = doc?.slug?.current;
  const previewable = isPreviewableType(type);
  // homePage is a singleton with no slug field at all — it's always
  // "ready" to preview (the fixed-_id document either exists or doesn't;
  // there's no per-document slug to wait on). Every other previewable
  // type still requires one, unchanged.
  const ready = type === "homePage" || Boolean(slug);

  const handleClick = useCallback(() => {
    if (!isPreviewableType(type) || !ready) return;
    const path = resolvePreviewPath(type, slug);
    const secret = process.env.SANITY_STUDIO_PREVIEW_SECRET ?? "";
    const url = `${getFrontendOrigin()}/api/draft-mode/enable?secret=${encodeURIComponent(secret)}&path=${encodeURIComponent(path)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [type, slug, ready]);

  if (!previewable) return null;

  return {
    label: "Открыть предпросмотр",
    icon: LaunchIcon,
    disabled: !ready,
    title: ready ? undefined : "Сначала укажите slug",
    onHandle: handleClick,
  };
};
