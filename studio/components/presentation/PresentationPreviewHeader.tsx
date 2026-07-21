import type { PreviewHeaderProps } from "sanity/presentation";
import { DeviceSwitcher } from "./DeviceSwitcher";

// Registered as presentationTool's components.unstable_header in
// sanity.config.ts — the one Presentation Tool extension point that
// exposes a ref to its own live preview iframe (`iframeRef`). Renders
// Presentation's existing header unchanged via renderDefault (URL bar,
// Edit toggle, share, etc.). DeviceSwitcher renders nothing inline here —
// it portals its own desktop/tablet/phone menu into the native header's
// own viewport-toggle slot once renderDefault has mounted it (see
// DeviceSwitcher.tsx for why).
export function PresentationPreviewHeader(props: PreviewHeaderProps) {
  return (
    <>
      {props.renderDefault(props)}
      <DeviceSwitcher iframeRef={props.iframeRef} />
    </>
  );
}
