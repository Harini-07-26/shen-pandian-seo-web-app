import { Role } from "@/types";

export type SessionClaims = {
  userId: string;
  tenantId: string;
  role: Role;
  email?: string;
};

function parseRole(value: unknown): Role | null {
  if (typeof value !== "string") {
    return null;
  }

  const roles = Object.values(Role) as string[];
  return roles.includes(value) ? (value as Role) : null;
}

/**
 * Decodes a base64url-encoded JSON token.
 * Starter format: btoa(JSON.stringify({ userId, tenantId, role, email? })).
 */
export function parseSessionToken(token: string): SessionClaims | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const payload = JSON.parse(decoded) as Record<string, unknown>;
    const role = parseRole(payload.role);

    if (
      typeof payload.userId !== "string" ||
      typeof payload.tenantId !== "string" ||
      role === null
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      tenantId: payload.tenantId,
      role,
      email: typeof payload.email === "string" ? payload.email : undefined,
    };
  } catch {
    return null;
  }
}
