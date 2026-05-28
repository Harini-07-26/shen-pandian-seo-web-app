import { NextResponse } from "next/server";
import { z } from "zod";

import { withApiAuth } from "@/lib/api/with-api-auth";
import { prisma } from "@/lib/db/prisma";
import { withTenant, withTenantData } from "@/lib/tenant/with-tenant";

const createClientSchema = z.object({
  companyName: z.string().min(2),
  contactName: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const GET = withApiAuth("client:read", async (_request, { sessionUser }) => {
  const clients = await prisma.client.findMany({
    where: withTenant(sessionUser.tenantId),
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
    include: {
      _count: {
        select: {
          campaigns: true,
          leads: true,
        },
      },
    },
  });

  return {
    clients,
    meta: { count: clients.length },
  };
});

export const POST = withApiAuth("client:write", async (request, { sessionUser }) => {
  try {
    const body = await request.json();
    const input = createClientSchema.parse(body);

    const client = await prisma.client.create({
      data: withTenantData(sessionUser.tenantId, input),
    });

    return NextResponse.json({ data: client }, { status: 201 });
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
