import { withApiAuth } from "@/lib/api/with-api-auth";
import { prisma } from "@/lib/db/prisma";
import { withTenant } from "@/lib/tenant/with-tenant";

type Bucket = {
  month: string;
  year: number;
  monthIndex: number;
};

function getMonthBuckets(count: number): Bucket[] {
  const now = new Date();
  const buckets: Bucket[] = [];

  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      month: date.toLocaleString("en-US", { month: "short" }),
      year: date.getFullYear(),
      monthIndex: date.getMonth(),
    });
  }

  return buckets;
}

export const GET = withApiAuth("report:read", async (_request, { sessionUser }) => {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [clients, activeCampaigns, totalLeads, convertedLeads, campaigns, leads, auditLogs] =
    await Promise.all([
      prisma.client.count({ where: withTenant(sessionUser.tenantId) }),
      prisma.campaign.count({
        where: withTenant(sessionUser.tenantId, { status: "ACTIVE" }),
      }),
      prisma.lead.count({ where: withTenant(sessionUser.tenantId) }),
      prisma.lead.count({
        where: withTenant(sessionUser.tenantId, { status: "CONVERTED" }),
      }),
      prisma.campaign.findMany({
        where: withTenant(sessionUser.tenantId, { createdAt: { gte: yearStart } }),
        select: { createdAt: true, status: true },
      }),
      prisma.lead.findMany({
        where: withTenant(sessionUser.tenantId, { createdAt: { gte: sixMonthsAgo } }),
        select: { createdAt: true, status: true },
      }),
      prisma.auditLog.findMany({
        where: withTenant(sessionUser.tenantId),
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          actor: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 1000) / 10 : 0;

  const yearBuckets = getMonthBuckets(12);
  const revenueData = yearBuckets.map((bucket) => {
    const campaignsInMonth = campaigns.filter(
      (campaign) =>
        campaign.createdAt.getFullYear() === bucket.year &&
        campaign.createdAt.getMonth() === bucket.monthIndex
    ).length;

    // Proxy metric until billing entities are modeled.
    return {
      month: bucket.month,
      revenue: campaignsInMonth * 1800,
      expenses: campaignsInMonth * 650,
    };
  });

  const conversionBuckets = getMonthBuckets(6);
  const leadConversionData = conversionBuckets.map((bucket) => {
    const leadsInMonth = leads.filter(
      (lead) =>
        lead.createdAt.getFullYear() === bucket.year &&
        lead.createdAt.getMonth() === bucket.monthIndex
    );

    return {
      month: bucket.month,
      converted: leadsInMonth.filter((lead) => lead.status === "CONVERTED").length,
      lost: leadsInMonth.filter((lead) => lead.status === "LOST").length,
    };
  });

  const campaignStatusCount = campaigns.reduce<Record<string, number>>((acc, campaign) => {
    acc[campaign.status] = (acc[campaign.status] ?? 0) + 1;
    return acc;
  }, {});

  const campaignPerformance = Object.entries(campaignStatusCount).map(
    ([status, count], index) => {
      const colors = ["#6366f1", "#a855f7", "#ec4899", "#14b8a6", "#f59e0b", "#22c55e"];
      return {
        name: status.replace("_", " "),
        value: count,
        color: colors[index % colors.length],
      };
    }
  );

  const recentActivities = auditLogs.map((log) => ({
    user: log.actor?.name ?? "System",
    action: log.action.toLowerCase(),
    target: log.entityType,
    time: log.createdAt.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: log.action.toLowerCase().includes("delete")
      ? "warning"
      : log.action.toLowerCase().includes("create")
        ? "success"
        : "info",
  }));

  return {
    summary: {
      clients,
      activeCampaigns,
      totalLeads,
      conversionRate,
    },
    revenueData,
    leadConversionData,
    campaignPerformance,
    recentActivities,
  };
});
