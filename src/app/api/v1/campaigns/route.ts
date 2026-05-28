import { NextResponse } from "next/server";
import { z } from "zod";

import { withApiAuth } from "@/lib/api/with-api-auth";
import { prisma } from "@/lib/db/prisma";
import { withTenant, withTenantData } from "@/lib/tenant/with-tenant";

const createCampaignSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  clientId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  budget: z.number().positive().optional(),
});

export const GET = withApiAuth("campaign:read", async (_request, { sessionUser }) => {
    const campaigns = await prisma.campaign.findMany({
      where: withTenant(sessionUser.tenantId),
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });

    return {
      campaigns,
      meta: { count: campaigns.length },
    };
});

export const POST = withApiAuth("campaign:create", async (request, { sessionUser }) => {
  try {
    const body = await request.json();
    const input = createCampaignSchema.parse(body);

    const campaign = await prisma.campaign.create({
      data: withTenantData(sessionUser.tenantId, {
        name: input.name,
        description: input.description,
        clientId: input.clientId,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        budget: input.budget,
        ownerId: sessionUser.userId,
      }),
    });

    return NextResponse.json({ data: campaign }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid payload", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
});
