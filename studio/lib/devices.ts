import type { ComponentType } from "react";
import { DesktopIcon } from "@sanity/icons/Desktop";
import { TabletDeviceIcon } from "@sanity/icons/TabletDevice";
import { MobileDeviceIcon } from "@sanity/icons/MobileDevice";

export type DeviceId = "desktop" | "tablet" | "phone";

export interface DevicePreset {
  id: DeviceId;
  label: string;
  /** CSS width value applied directly to the Presentation preview iframe. */
  width: string;
  /** CSS height value applied directly to the Presentation preview iframe. */
  height: string;
  /** Keyboard shortcut digit (see requirement #5) — matches KeyboardEvent.key. */
  shortcutKey: string;
  /** Same icon set Presentation's own native viewport toggle uses. */
  icon: ComponentType;
}

// Single source of truth for every device preset — DeviceSwitcher.tsx
// (studio/components/presentation/) reads this list rather than hardcoding
// widths/heights/shortcuts itself.
export const DEVICE_PRESETS: DevicePreset[] = [
  { id: "desktop", label: "Desktop", width: "100%", height: "100%", shortcutKey: "1", icon: DesktopIcon },
  { id: "tablet", label: "Tablet", width: "820px", height: "1180px", shortcutKey: "2", icon: TabletDeviceIcon },
  { id: "phone", label: "Phone", width: "390px", height: "844px", shortcutKey: "3", icon: MobileDeviceIcon },
];

export const DEFAULT_DEVICE_ID: DeviceId = "desktop";

const DEVICE_STORAGE_KEY = "builders-magazine:presentation-device";

// Frame-resize animation duration — within the 180–250ms range asked for.
// Lives here, not in the component, so DeviceSwitcher.tsx never hardcodes
// it either.
export const DEVICE_TRANSITION_MS = 220;

export function getDevicePreset(id: DeviceId): DevicePreset {
  return DEVICE_PRESETS.find((device) => device.id === id) ?? DEVICE_PRESETS[0];
}

function isDeviceId(value: string | null): value is DeviceId {
  return DEVICE_PRESETS.some((device) => device.id === value);
}

export function getStoredDeviceId(): DeviceId {
  if (typeof window === "undefined") return DEFAULT_DEVICE_ID;
  const stored = window.localStorage.getItem(DEVICE_STORAGE_KEY);
  return isDeviceId(stored) ? stored : DEFAULT_DEVICE_ID;
}

export function storeDeviceId(id: DeviceId): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEVICE_STORAGE_KEY, id);
}

// Resizes the real Presentation preview iframe directly — width/height,
// not a CSS transform: scale(), so the Next.js page genuinely reflows at
// that pixel size (real responsive behavior, not a shrunk screenshot).
// `display: block` + `margin: 0 auto` centers it horizontally within
// Presentation's own existing preview pane; that pane already supplies
// the neutral background this content sits on (see the "reuse Presentation's
// own background" requirement — nothing extra needed, the pane's own
// background already shows around any iframe smaller than the pane).
//
// maxWidth/maxHeight are reset to "none" deliberately: Presentation's own
// default iframe stylesheet sets `max-height: 100%` (so its own
// desktop-fill mode never overflows the pane), which silently clamps a
// taller inline `height` like the phone/tablet presets below — max-height
// always wins over height regardless of which one is inline vs. from a
// stylesheet, they don't compete via specificity the way two `height`
// declarations would. Confirmed via a real measurement: phone's inline
// height of 844px rendered at getBoundingClientRect().height ≈ 749px
// (the pane's own height, i.e. 100% of it) until this reset was added.
//
// flexShrink is reset to "0" for the same kind of reason: the iframe is a
// flex child inside Presentation's own preview pane layout, and flexbox
// shrinks flex children below their specified `width` by default
// (flex-shrink: 1) whenever the container doesn't have enough space —
// independent of max-width, since shrinking operates on flex-basis.
// Confirmed via a real measurement: tablet's inline width of 820px
// rendered at only 800px (the pane's own available width) until this
// reset was added.
export function applyDeviceFrame(iframe: HTMLIFrameElement, device: DevicePreset): void {
  iframe.style.transition = `width ${DEVICE_TRANSITION_MS}ms ease, height ${DEVICE_TRANSITION_MS}ms ease`;
  iframe.style.display = "block";
  iframe.style.margin = "0 auto";
  iframe.style.maxWidth = "none";
  iframe.style.maxHeight = "none";
  iframe.style.flexShrink = "0";
  // Presentation's own preview pane is `align-items: center`, which
  // vertically centers the iframe as a flex item. Fine for Phone (only
  // slightly taller than the pane), but Tablet's 1180px height is much
  // taller than the available pane — centering then pushes the top of the
  // frame up past the pane's own top edge, overlapping the URL bar/toolbar
  // above it. Pinning to the top of the flex container (like every real
  // device-preview tool does) keeps any overflow below the frame instead
  // of straddling both above and below it.
  iframe.style.alignSelf = "flex-start";
  iframe.style.width = device.width;
  iframe.style.height = device.height;
}

// True once the iframe's *actual rendered* size matches the given device.
// Checks getBoundingClientRect() rather than the inline style string:
// something else (Presentation's own pane reacting to a window resize, or
// to this same iframe's own height change) can leave the *inline style*
// saying "820px" while flexbox has still rendered it narrower — see
// applyDeviceFrame's flexShrink comment above. Desktop's "100%" isn't a
// pixel value, so there's nothing meaningful to enforce for it — it
// always reports a match.
export function matchesDeviceFrame(iframe: HTMLIFrameElement, device: DevicePreset): boolean {
  if (!device.width.endsWith("px") || !device.height.endsWith("px")) return true;
  const targetWidth = parseFloat(device.width);
  const targetHeight = parseFloat(device.height);
  const rect = iframe.getBoundingClientRect();
  return Math.abs(rect.width - targetWidth) < 1 && Math.abs(rect.height - targetHeight) < 1;
}
