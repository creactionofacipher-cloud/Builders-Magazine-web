import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

// Exit path for a browser stuck in draft mode after previewing — without
// this, enabling draft mode would be a one-way trip for that browser.
export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  return NextResponse.redirect(new URL("/", request.url));
}
