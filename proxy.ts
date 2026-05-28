import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { parseSessionToken } from "@/lib/auth/token";

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const bearer = requestHeaders.get("authorization")?.replace("Bearer ", "");
  const cookieToken = request.cookies.get("app_session")?.value;
  const token = bearer || cookieToken;

  if (!token) {
    return NextResponse.next();
  }

  const claims = parseSessionToken(token);
  if (!claims) {
    return NextResponse.next();
  }

  requestHeaders.set("x-user-id", claims.userId);
  requestHeaders.set("x-tenant-id", claims.tenantId);
  requestHeaders.set("x-user-role", claims.role);
  if (claims.email) {
    requestHeaders.set("x-user-email", claims.email);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
