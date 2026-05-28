import type { Role } from "@/types";

import { hasPermission, type Permission } from "./permissions";

export class AuthorizationError extends Error {
  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export type AuthorizationContext = {
  tenantId: string;
  userId: string;
  role: Role;
};

export function requirePermission(
  context: AuthorizationContext,
  permission: Permission
): void {
  if (!hasPermission(context.role, permission)) {
    throw new AuthorizationError(
      `Missing permission '${permission}' for role '${context.role}'.`
    );
  }
}

export function can(context: AuthorizationContext, permission: Permission): boolean {
  return hasPermission(context.role, permission);
}
