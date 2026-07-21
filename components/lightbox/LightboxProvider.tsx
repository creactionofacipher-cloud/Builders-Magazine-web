"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import type { ControllerRef, Slide } from "yet-another-react-lightbox";

// Dynamically imported (not a static import) so yet-another-react-lightbox
// plus its Zoom/Thumbnails plugins and CSS — otherwise part of every
// page's shared client bundle via this always-mounted provider — load as
// their own chunk instead. ssr: false because the library itself is
// browser-only (portals, matchMedia, etc.); it's already rendered with
// open={false} until a lightbox-enabled image is clicked, so there's no
// content to server-render anyway.
const Lightbox = dynamic(() => import("./Lightbox").then((mod) => mod.Lightbox), {
  ssr: false,
});

export interface LightboxContextValue {
  register: (id: string, slide: Slide) => void;
  unregister: (id: string) => void;
  openImage: (id: string) => void;
}

export const LightboxContext = createContext<LightboxContextValue | null>(null);

interface LightboxViewState {
  open: boolean;
  slides: Slide[];
  index: number;
}

const INITIAL_STATE: LightboxViewState = { open: false, slides: [], index: 0 };

// #photo-N (1-based, matching the counter/info panel's own display) — see
// the URL sync effect below.
const HASH_PREFIX = "#photo-";

function parsePhotoIndex(hash: string): number | null {
  if (!hash.startsWith(HASH_PREFIX)) return null;
  const n = Number(hash.slice(HASH_PREFIX.length));
  return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}

// Single site-wide lightbox instance — mounted once in app/[locale]/layout.tsx.
// Every lightbox-enabled Image registers itself here (see useLightbox.ts) and
// gets a `data-lightbox-id` attribute on its clickable trigger element
// (LightboxImage.tsx). Opening a gallery doesn't rely on registration
// *order* — it queries the DOM for every `[data-lightbox-id]` element
// currently on the page and reads them off in document order, which is the
// same order they were reading-order-rendered in. This is what makes the
// gallery automatically match Hero → RichText images → Gallery →
// ImageGrid → ... in whatever order a given page actually composes them,
// without any page needing to build that list itself.
export function LightboxProvider({ children }: { children: ReactNode }) {
  const registry = useRef(new Map<string, Slide>());
  const controllerRef = useRef<ControllerRef>(null);
  const [state, setState] = useState<LightboxViewState>(INITIAL_STATE);

  const register = useCallback((id: string, slide: Slide) => {
    registry.current.set(id, slide);
  }, []);

  const unregister = useCallback((id: string) => {
    registry.current.delete(id);
  }, []);

  // Shared by openImage() (user click) and the popstate/initial-load path
  // below (browser navigation) — both need the exact same "current DOM
  // order, filtered to what's actually registered" slide list.
  const collectOrderedSlides = useCallback(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-lightbox-id]"));
    const orderedIds = elements
      .map((el) => el.dataset.lightboxId)
      .filter((elId): elId is string => elId != null && registry.current.has(elId));
    const slides = orderedIds.map((elId) => registry.current.get(elId)!);
    return { orderedIds, slides };
  }, []);

  const openImage = useCallback(
    (id: string) => {
      const { orderedIds, slides } = collectOrderedSlides();
      const index = orderedIds.indexOf(id);
      if (index === -1) return;

      // Marks this history entry as "ours" so close() knows whether
      // history.back() will land on the page underneath (entry we just
      // pushed) or would leave the site entirely (e.g. the lightbox was
      // opened by loading a #photo-N URL directly, with nothing of ours
      // before it in the session history).
      window.history.pushState(
        { lightboxPhoto: index + 1 },
        "",
        `${window.location.pathname}${window.location.search}${HASH_PREFIX}${index + 1}`,
      );
      setState({ open: true, slides, index });
    },
    [collectOrderedSlides],
  );

  const close = useCallback(() => {
    if (window.history.state?.lightboxPhoto) {
      window.history.back();
      // The resulting popstate handler (below) closes the view — no
      // direct setState here, so the URL and the open/closed state can
      // never disagree with each other.
      return;
    }
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const setIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, index }));
  }, []);

  // URL sync: browser Back/Forward through a #photo-N entry opens/closes
  // the lightbox to match, and loading a #photo-N URL directly (including
  // a plain refresh) opens it immediately. This effect runs after every
  // lightbox-enabled Image on the page has already registered itself —
  // React commits child effects before parent effects on initial mount,
  // and LightboxProvider wraps every page's content — so the DOM query
  // below always sees a fully-populated registry the first time it runs.
  useEffect(() => {
    function syncFromUrl() {
      const index = parsePhotoIndex(window.location.hash);
      if (index === null) {
        setState((prev) => (prev.open ? { ...prev, open: false } : prev));
        return;
      }
      const { slides } = collectOrderedSlides();
      if (index < 0 || index >= slides.length) return;
      setState({ open: true, slides, index });
    }

    window.addEventListener("popstate", syncFromUrl);
    syncFromUrl();

    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [collectOrderedSlides]);

  // Keyboard shortcuts beyond the library's own defaults (← → and Esc
  // already work out of the box — left untouched). Home/End jump via the
  // controller ref's `count` option so it's one navigation, not N
  // sequential animated steps.
  useEffect(() => {
    if (!state.open) return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "Home":
          event.preventDefault();
          controllerRef.current?.prev({ count: state.index });
          break;
        case "End":
          event.preventDefault();
          controllerRef.current?.next({ count: state.slides.length - 1 - state.index });
          break;
        case " ":
          event.preventDefault();
          if (event.shiftKey) {
            controllerRef.current?.prev();
          } else {
            controllerRef.current?.next();
          }
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.open, state.index, state.slides.length]);

  const contextValue = useMemo<LightboxContextValue>(
    () => ({ register, unregister, openImage }),
    [register, unregister, openImage],
  );

  return (
    <LightboxContext.Provider value={contextValue}>
      {children}
      <Lightbox
        open={state.open}
        slides={state.slides}
        index={state.index}
        close={close}
        onIndexChange={setIndex}
        controllerRef={controllerRef}
      />
    </LightboxContext.Provider>
  );
}
