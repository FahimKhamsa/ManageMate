/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ eventId: string }> }
) {
  // 1. unwrap the params promise
  const { eventId } = await context.params;
  const id = parseInt(eventId, 10);

  try {
    const attendeeCount = await prisma.ticket.count({
      where: { eventId: id },
    });

    return NextResponse.json({ count: attendeeCount });
  } catch (error: any) {
    return NextResponse.json({ count: 0 });
  }
}
