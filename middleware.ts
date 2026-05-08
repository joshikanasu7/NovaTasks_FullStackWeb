import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Keep middleware edge-safe for Railway/Next runtime.
 * Avoid importing Node-only libraries here.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}
