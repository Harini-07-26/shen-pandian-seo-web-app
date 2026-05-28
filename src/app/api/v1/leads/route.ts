import { NextResponse } from "next/server";
import { z } from "zod";

import { withApiAuth } from "@/lib/api/with-api-auth";
import { prisma } from "@/lib/db/prisma";
import { withTenant, withTenantData } from "@/lib/tenant/with-tenant";

const createLeadSchema = z.object({
  name: z.string().min(2),
  email: z.email().optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
  status: z
    .enum(["NEW", "CONTACTED", "PROPOSAL_SENT", "CONVERTED", "LOST"])
    .optional(),
  notes: z.string().optional(),
  clientId: z.string().optional(),
  assignedToId: z.string().optional(),
  nextFollowUp: z.string().datetime().optional(),
});

export const GET = withApiAuth("lead:read", async (_request, { sessionUser }) => {
  const leads = await prisma.lead.findMany({
    where: withTenant(sessionUser.tenantId),
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      client: {
        select: {
          id: true,
          companyName: true,
        },
      },
    },
  });

  return {
    leads,
    meta: { count: leads.length },
  };
});

export const POST = withApiAuth("lead:write", async (request, { sessionUser }) => {
  try {
    const body = await request.json();
    const input = createLeadSchema.parse(body);

    const lead = await prisma.lead.create({
      data: withTenantData(sessionUser.tenantId, {
        ...input,
        nextFollowUp: input.nextFollowUp ? new Date(input.nextFollowUp) : undefined,
      }),
    });

    return NextResponse.json({ data: lead }, { status: 201 });
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
