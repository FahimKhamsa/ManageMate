/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const upcomingEvents = await prisma.event.findMany({
      where: {
        date: { gte: now.toISOString() },
        status: "approved",
      },
      orderBy: { date: "asc" },
    });
    return NextResponse.json({ events: upcomingEvents });
  } catch (err: any) {
    console.error("Error fetching upcoming events:", err);
    return NextResponse.json({ events: [] }, { status: 500 });
  }
}
