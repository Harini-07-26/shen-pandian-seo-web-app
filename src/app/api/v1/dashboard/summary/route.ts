import { withApiAuth } from "@/lib/api/with-api-auth";
import { prisma } from "@/lib/db/prisma";
import { withTenant } from "@/lib/tenant/with-tenant";

export const GET = withApiAuth("report:read", async (_request, { sessionUser }) => {
  const where = withTenant(sessionUser.tenantId);

  const [clients, activeCampaigns, totalLeads, convertedLeads] = await Promise.all([
    prisma.client.count({ where }),
    prisma.campaign.count({
      where: withTenant(sessionUser.tenantId, { status: "ACTIVE" }),
    }),
    prisma.lead.count({ where }),
    prisma.lead.count({
      where: withTenant(sessionUser.tenantId, { status: "CONVERTED" }),
    }),
  ]);

  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 1000) / 10 : 0;

  return {
    clients,
    activeCampaigns,
    totalLeads,
    conversionRate,
  };
});
