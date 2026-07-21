import { useCallback } from "react";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";
import { LaunchIcon } from "@sanity/icons/Launch";
import { getFrontendOrigin, isPreviewableType, resolvePreviewPath } from "./previewUrl";

interface SlugValue {
  current?: string;
}

// A document-header action — "Add 'Open Preview' to Story, Issue,
// Builders Cup and Product documents." Opens the same draft-mode-enabling
// URL the Presentation tool's own preview panel resolves via previewUrl
// (sanity.config.ts), just in a new tab instead of an in-Studio split
// pane. Registered from sanity.config.ts's existing `document.actions`
// callback (the one already used for the Site Settings singleton
// restriction) rather than a second, separate actions config.
export const openPreviewAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { type, published, draft } = props;
  const doc = (draft ?? published) as { slug?: SlugValue } | null;
  const slug = doc?.slug?.current;
  const previewable = isPreviewableType(type);

  const handleClick = useCallback(() => {
    if (!isPreviewableType(type) || !slug) return;
    const path = resolvePreviewPath(type, slug);
    const secret = process.env.SANITY_STUDIO_PREVIEW_SECRET ?? "";
    const url = `${getFrontendOrigin()}/api/draft-mode/enable?secret=${encodeURIComponent(secret)}&path=${encodeURIComponent(path)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [type, slug]);

  if (!previewable) return null;

  return {
    label: "Открыть предпросмотр",
    icon: LaunchIcon,
    disabled: !slug,
    title: slug ? undefined : "Сначала укажите slug",
    onHandle: handleClick,
  };
};
