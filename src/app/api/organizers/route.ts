import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Find all users who have created one or more events
    const organizers = await prisma.user.findMany({
      where: { events: { some: {} } },
      select: {
        id: true,
        name: true,
        email: true,
        _count: { select: { events: true } },
      },
    });

    // Map to a simpler DTO
    const data = organizers.map((o) => ({
      id: o.id,
      name: o.name,
      email: o.email,
      eventCount: o._count.events,
    }));

    return NextResponse.json({ organizers: data });
  } catch (err: any) {
    console.error("Error fetching organizers:", err);
    return NextResponse.json({ organizers: [] }, { status: 500 });
  }
}
