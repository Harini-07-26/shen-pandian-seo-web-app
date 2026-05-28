import type { Role } from "@/types";

export const PERMISSIONS = [
  "tenant:manage",
  "user:invite",
  "client:read",
  "client:write",
  "lead:read",
  "lead:write",
  "campaign:create",
  "campaign:publish",
  "campaign:read",
  "campaign:write",
  "task:read",
  "task:write",
  "report:read",
  "report:export",
  "billing:read",
  "billing:write",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const rolePermissions: Record<Role, ReadonlySet<Permission>> = {
  SUPER_ADMIN: new Set(PERMISSIONS),
  ADMIN: new Set<Permission>([
    "user:invite",
    "client:read",
    "client:write",
    "lead:read",
    "lead:write",
    "campaign:create",
    "campaign:publish",
    "campaign:read",
    "campaign:write",
    "task:read",
    "task:write",
    "report:read",
    "report:export",
    "billing:read",
    "billing:write",
  ]),
  MARKETING_MANAGER: new Set<Permission>([
    "client:read",
    "lead:read",
    "lead:write",
    "campaign:create",
    "campaign:publish",
    "campaign:read",
    "campaign:write",
    "task:read",
    "task:write",
    "report:read",
    "report:export",
  ]),
  SEO_EXECUTIVE: new Set<Permission>([
    "client:read",
    "lead:read",
    "lead:write",
    "campaign:create",
    "campaign:read",
    "campaign:write",
    "task:read",
    "task:write",
    "report:read",
  ]),
  CONTENT_WRITER: new Set<Permission>([
    "campaign:read",
    "task:read",
    "task:write",
    "report:read",
  ]),
  CLIENT: new Set<Permission>([
    "client:read",
    "campaign:read",
    "report:read",
    "report:export",
  ]),
};

export function getPermissionsForRole(role: Role): ReadonlySet<Permission> {
  return rolePermissions[role];
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].has(permission);
}
