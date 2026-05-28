import { headers } from "next/headers";

import { Role } from "@/types";
import { parseSessionToken } from "@/lib/auth/token";

export type SessionUser = {
  userId: string;
  tenantId: string;
  role: Role;
  email?: string;
};

export class AuthenticationError extends Error {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "AuthenticationError";
  }
}

function parseRole(value: string | null): Role | null {
  if (!value) {
    return null;
  }

  const roles = Object.values(Role) as string[];
  return roles.includes(value) ? (value as Role) : null;
}

/**
 * Reads the authenticated user from request headers set by auth middleware.
 * Replace this with your NextAuth/JWT provider session lookup as needed.
 */
export async function getSessionUser(): Promise<SessionUser> {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("x-user-id");
  const tenantId = requestHeaders.get("x-tenant-id");
  const role = parseRole(requestHeaders.get("x-user-role"));

  if (!userId || !tenantId || !role) {
    const fallbackToken = requestHeaders.get("authorization")?.replace("Bearer ", "");
    if (fallbackToken) {
      const claims = parseSessionToken(fallbackToken);
      if (claims) {
        return claims;
      }
    }
  }

  if (!userId || !tenantId || !role) {
    throw new AuthenticationError(
      "Missing authentication headers (x-user-id, x-tenant-id, x-user-role)."
    );
  }

  return {
    userId,
    tenantId,
    role,
    email: requestHeaders.get("x-user-email") ?? undefined,
  };
}
