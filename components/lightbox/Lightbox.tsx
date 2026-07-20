"use client";

import { useSyncExternalStore, type RefObject } from "react";
import { createPortal } from "react-dom";
import YarlLightbox, { type ControllerRef, type Slide } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import type { AppSlide } from "./useLightbox";

interface LightboxProps {
  open: boolean;
  slides: Slide[];
  index: number;
  close: () => void;
  onIndexChange: (index: number) => void;
  controllerRef: RefObject<ControllerRef | null>;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// useSyncExternalStore, not useState+useEffect: this reads external
// browser state (a media query), which is exactly what the hook exists
// for — no extra render pass, and no SSR/client mismatch (server
// snapshot is always `false`, since the lightbox itself never renders
// server-side content that depends on this value).
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => false);
}

// The library's lightbox root (.yarl__root.yarl__portal) is a fixed,
// full-viewport layer at z-index 9999 with an opaque black backdrop
// painted on its .yarl__container child. render.controls/slideHeader/etc.
// all render *inside* that tree — wherever they land, they're still
// behind that opaque backdrop, and which module's subtree they land in
// depends on which plugins are active (empirically, with Thumbnails
// enabled, render.controls output ends up nested inside the thumbnails
// module rather than the root). A portal straight to document.body sidesteps
// all of that: true fixed-viewport positioning, independent of yarl's
// internal DOM structure, at a z-index just below the lightbox root so it
// shows through once that root's own backdrop is made translucent (see
// the `styles.container` override on <YarlLightbox> below).
const BACKGROUND_Z_INDEX = 9998;

// Ambient, magazine-style backdrop instead of a flat black background —
// a heavily blurred, darkened, slightly upscaled (so blurred edges never
// show) version of whatever slide is currently open.
function AmbientBackground({ src }: { src?: string }) {
  if (!src || typeof document === "undefined") return null;
  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      // isolation: isolate forces a well-defined stacking context here —
      // without it, Chromium can promote the page's sticky <Header> to
      // its own compositing layer that ignores normal z-index ordering
      // against this filter/transform-heavy layer, letting it paint
      // through the blur despite its much lower z-index.
      style={{ zIndex: BACKGROUND_Z_INDEX, isolation: "isolate" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative
          backdrop only, deliberately not next/image (no responsive/lazy
          behavior needed for an aria-hidden blur layer) */}
      <img
        src={src}
        alt=""
        className="h-full w-full scale-[1.15] object-cover blur-[50px] brightness-[0.7]"
      />
    </div>,
    document.body,
  );
}

// Thin, project-specific configuration wrapper around the yet-another-react-lightbox
// package — the only file that touches its plugin/prop API. LightboxProvider
// owns state, URL sync, and the auto-collected slide list; this file owns
// presentation.
export function Lightbox({
  open,
  slides,
  index,
  close,
  onIndexChange,
  controllerRef,
}: LightboxProps) {
  const reducedMotion = usePrefersReducedMotion();
  // A single-image "gallery" has nothing to page through — a thumbnail
  // strip with one thumbnail in it is just clutter.
  const showThumbnails = slides.length > 1;

  return (
    <YarlLightbox
      open={open}
      close={close}
      slides={slides}
      index={index}
      on={{ view: ({ index: nextIndex }) => onIndexChange(nextIndex) }}
      plugins={showThumbnails ? [Zoom, Thumbnails] : [Zoom]}
      controller={{ closeOnBackdropClick: true, ref: controllerRef }}
      carousel={{ preload: 2 }}
      // Translucent instead of the library's opaque default — lets the
      // AmbientBackground portal (rendered behind this at z-index 9998)
      // show through instead of being fully hidden by it.
      styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.55)" } }}
      animation={reducedMotion ? { fade: 0, swipe: 0 } : { fade: 250, swipe: 400 }}
      zoom={{
        maxZoomPixelRatio: 4,
        scrollToZoom: true,
        // Improved pinch-zoom implementation (opt-in ahead of it becoming
        // the library default) — noticeably smoother two-finger zoom on
        // touch devices than the legacy implementation.
        pinchZoomV4: true,
      }}
      thumbnails={{
        position: "bottom",
        width: 72,
        height: 72,
        border: 1,
        borderRadius: 4,
        gap: 8,
        padding: 0,
        vignette: true,
      }}
      render={{
        controls: () => (
          <AmbientBackground src={(slides[index] as AppSlide | undefined)?.backgroundSrc} />
        ),
        slideFooter: ({ slide }) => {
          const s = slide as AppSlide;
          const position = slides.indexOf(slide);
          const showCounter = slides.length > 1 && position !== -1;

          if (!s.caption && !s.photographer && !s.credit && !showCounter) {
            return null;
          }

          return (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-12 pb-4 text-center text-white">
              {s.caption && <p className="text-sm font-medium">{s.caption}</p>}
              {(s.photographer || s.credit || showCounter) && (
                <p className="mt-1 text-xs text-white/70">
                  {[
                    s.photographer,
                    s.credit,
                    showCounter ? `${position + 1} / ${slides.length}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </div>
          );
        },
      }}
    />
  );
}
