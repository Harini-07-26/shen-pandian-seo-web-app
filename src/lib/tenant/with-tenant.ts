type TenantScopedWhere = {
  tenantId?: string;
  [key: string]: unknown;
};

export function withTenant<T extends TenantScopedWhere>(
  tenantId: string,
  where?: T
): T & { tenantId: string } {
  return {
    ...(where ?? ({} as T)),
    tenantId,
  };
}

type TenantScopedData = {
  tenantId?: string;
  [key: string]: unknown;
};

export function withTenantData<T extends TenantScopedData>(
  tenantId: string,
  data: T
): T & { tenantId: string } {
  return {
    ...data,
    tenantId,
  };
}
