import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { sanityPreviewClient } from "@/cms/sanity/client";
import { isAllowedPreviewPath } from "@/lib/preview";

// Two callers hit this route, with two different auth mechanisms:
//
// 1. Sanity Studio's Presentation tool (sanity.config.ts's
//    presentationTool `previewUrl.previewMode.enable`) — it mints its
//    own short-lived secret (stored as a sanity.previewUrlSecret
//    document in the dataset) and appends it as a query param.
//    validatePreviewUrl() checks that against the Content Lake itself,
//    so no shared secret needs to be configured for this path — it's
//    what actually establishes the Presentation iframe's live preview
//    connection.
// 2. The "Open Preview" document action (studio/lib/openPreviewAction.tsx)
//    — a simpler new-tab flow that doesn't go through the Studio's own
//    secret-minting API, so it uses a static shared secret
//    (SANITY_PREVIEW_SECRET, matching SANITY_STUDIO_PREVIEW_SECRET in
//    studio/.env.local) instead.
export async function GET(request: NextRequest) {
  if (sanityPreviewClient) {
    const { isValid, redirectTo } = await validatePreviewUrl(sanityPreviewClient, request.url);
    if (isValid) {
      const draft = await draftMode();
      draft.enable();
      return NextResponse.redirect(new URL(redirectTo || "/", request.url));
    }
  }

  const secret = request.nextUrl.searchParams.get("secret");
  const path = request.nextUrl.searchParams.get("path");

  if (!process.env.SANITY_PREVIEW_SECRET || secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new NextResponse("Invalid preview secret", { status: 401 });
  }
  if (!path || !isAllowedPreviewPath(path)) {
    return new NextResponse("Invalid preview path", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(path, request.url));
}
