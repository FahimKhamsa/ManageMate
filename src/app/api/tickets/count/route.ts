/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.ticket.count();
    return NextResponse.json({ count });
  } catch (err: any) {
    console.error("Error fetching total attendee count:", err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
