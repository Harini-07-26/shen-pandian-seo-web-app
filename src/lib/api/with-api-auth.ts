import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { AuthorizationError, requirePermission } from "@/lib/rbac";
import type { Permission } from "@/lib/rbac";

type Handler<T = unknown> = (
  request: Request,
  context: {
    sessionUser: Awaited<ReturnType<typeof getSessionUser>>;
  }
) => Promise<T | Response>;

export function withApiAuth<T = unknown>(permission: Permission, handler: Handler<T>) {
  return async (request: Request) => {
    try {
      const sessionUser = await getSessionUser();
      requirePermission(sessionUser, permission);
      const result = await handler(request, { sessionUser });
      if (result instanceof Response) {
        return result;
      }
      return NextResponse.json({ data: result });
    } catch (error) {
      if (error instanceof AuthorizationError) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  };
}
