import { useCallback, useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Button, Menu, MenuButton, MenuItem, useGlobalKeyDown } from "@sanity/ui";
import {
  applyDeviceFrame,
  DEVICE_PRESETS,
  getDevicePreset,
  getStoredDeviceId,
  matchesDeviceFrame,
  storeDeviceId,
  type DeviceId,
} from "../../lib/devices";

interface DeviceSwitcherProps {
  iframeRef: RefObject<HTMLIFrameElement | null>;
}

// Presentation's own native viewport toggle — a single icon Button that
// only flips between two fixed states (desktop/mobile) — renders with this
// exact data-testid (see sanity's preview-frame header source). There's no
// public prop to suppress just this one button from `renderDefault`'s
// otherwise-unmodified output, so this task's three-state switcher takes
// over that same toolbar slot by hiding the native button and portaling
// its own control in right after it, rather than adding a second row.
const NATIVE_VIEWPORT_TOGGLE_SELECTOR = '[data-testid="preview-viewport-toggle"]';

function isTextInputTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
  );
}

// Replaces Presentation's own preview-header viewport icon (see
// PresentationPreviewHeader.tsx, wired into studio/sanity.config.ts's
// presentationTool `components.unstable_header`) with a three-state
// desktop/tablet/phone menu in the same spot. Resizes the *same* live
// preview iframe directly — never reloads it, never touches Draft Mode.
export function DeviceSwitcher({ iframeRef }: DeviceSwitcherProps) {
  const [deviceId, setDeviceId] = useState<DeviceId>(() => getStoredDeviceId());
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  // Finds Presentation's native viewport toggle button and swaps it out
  // for a portal mount point in the same position. Presentation
  // re-renders its whole header (and this button) on every document
  // navigation, so this runs on every mount rather than once globally.
  useEffect(() => {
    const nativeButton = document.querySelector<HTMLElement>(NATIVE_VIEWPORT_TOGGLE_SELECTOR);
    if (!nativeButton) return;
    nativeButton.style.display = "none";
    const mount = document.createElement("span");
    nativeButton.insertAdjacentElement("afterend", mount);
    setMountNode(mount);
    return () => {
      mount.remove();
      nativeButton.style.display = "";
    };
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const device = getDevicePreset(deviceId);
    let resizeObserver: ResizeObserver | undefined;
    let fallbackTimer: number | undefined;

    // Presentation Tool's own preview pane can force this iframe back
    // below the selected pixel size afterward — e.g. it's a flex child of
    // Presentation's own layout, and flexbox shrinks flex children below
    // an explicit `width` whenever the container doesn't have enough
    // space, independent of max-width (see applyDeviceFrame's comments in
    // studio/lib/devices.ts). ResizeObserver reacts only to genuine
    // rendered-size changes, so it reasserts this exact size whenever
    // something else changes it, without fighting anything unrelated
    // (notably, it does *not* fire for opacity/transform changes — see
    // why that distinction matters just below).
    function enforceSize(target: HTMLIFrameElement) {
      let correcting = false;
      resizeObserver = new ResizeObserver(() => {
        if (correcting) return;
        const current = iframeRef.current;
        if (!current || matchesDeviceFrame(current, device)) return;
        correcting = true;
        applyDeviceFrame(current, device);
        requestAnimationFrame(() => {
          correcting = false;
        });
      });
      resizeObserver.observe(target);
    }

    function applyAndEnforce(target: HTMLIFrameElement) {
      applyDeviceFrame(target, device);
      storeDeviceId(deviceId);
      enforceSize(target);
    }

    // Presentation Tool plays its own opacity fade-in (a View Transition)
    // the first time this iframe becomes visible after a fresh page load.
    // Changing its size *while that's in progress* corrupts it — the
    // iframe gets stuck permanently invisible (opacity stays 0 forever),
    // because the transition's expected before/after DOM snapshot no
    // longer matches once an unrelated style mutation lands mid-flight.
    // Reproduced reliably: loading this page with a non-default device
    // already selected (from localStorage) applies a size change on the
    // very first render, exactly when that fade-in is still running.
    // Waiting for it to finish first avoids the collision; once it has
    // finished once, every later device switch applies immediately.
    if (getComputedStyle(iframe).opacity === "1") {
      applyAndEnforce(iframe);
    } else {
      const onTransitionEnd = (event: TransitionEvent) => {
        if (event.propertyName !== "opacity") return;
        iframe.removeEventListener("transitionend", onTransitionEnd);
        window.clearTimeout(fallbackTimer);
        const current = iframeRef.current;
        if (current) applyAndEnforce(current);
      };
      iframe.addEventListener("transitionend", onTransitionEnd);
      // Fallback in case no transition ever fires (e.g. the opacity was
      // already 0 for an unrelated reason, or prefers-reduced-motion
      // skips it) — apply anyway after a delay so a device switch never
      // silently does nothing.
      fallbackTimer = window.setTimeout(() => {
        iframe.removeEventListener("transitionend", onTransitionEnd);
        const current = iframeRef.current;
        if (current) applyAndEnforce(current);
      }, 1000);
    }

    return () => {
      window.clearTimeout(fallbackTimer);
      resizeObserver?.disconnect();
    };
  }, [deviceId, iframeRef]);

  const selectDevice = useCallback((id: DeviceId) => {
    setDeviceId(id);
  }, []);

  // Optional but recommended (requirement #5): 1/2/3 switch devices, but
  // only while focus isn't inside a text field — otherwise typing "Issue
  // 1" or "Chapter 2" into any document field would hijack keystrokes.
  useGlobalKeyDown((event) => {
    if (isTextInputTarget(event.target)) return;
    const preset = DEVICE_PRESETS.find((device) => device.shortcutKey === event.key);
    if (!preset) return;
    event.preventDefault();
    selectDevice(preset.id);
  });

  if (!mountNode) return null;

  const activeDevice = getDevicePreset(deviceId);

  return createPortal(
    <MenuButton
      button={
        <Button
          icon={activeDevice.icon}
          mode="bleed"
          aria-label="Toggle viewport size"
          data-testid="device-switcher"
        />
      }
      id="device-switcher-menu"
      menu={
        <Menu>
          {DEVICE_PRESETS.map((device) => (
            <MenuItem
              key={device.id}
              icon={device.icon}
              text={device.label}
              pressed={deviceId === device.id}
              onClick={() => selectDevice(device.id)}
            />
          ))}
        </Menu>
      }
      popover={{ portal: true, placement: "bottom-start" }}
    />,
    mountNode,
  );
}
