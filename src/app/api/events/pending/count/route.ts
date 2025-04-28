/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/events/pending/count/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pendingCount = await prisma.event.count({
      where: { status: "pending" },
    });
    return NextResponse.json({ count: pendingCount });
  } catch (err: any) {
    console.error("Error fetching pending count:", err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
