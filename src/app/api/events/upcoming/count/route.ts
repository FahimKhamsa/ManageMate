/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/events/upcoming/count/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const upcomingCount = await prisma.event.count({
      where: {
        status: "approved",
        date: { gte: now.toISOString() },
      },
    });
    return NextResponse.json({ count: upcomingCount });
  } catch (err: any) {
    console.error("Error fetching upcoming count:", err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
