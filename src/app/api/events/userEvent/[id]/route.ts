import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;

    const session = await getServerSession(authOptions);
    console.log("Session", session);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (params.id !== session?.user?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const organizerId = parseInt(params.id);
    if (isNaN(organizerId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const events = await prisma.event.findMany({
      where: {
        organizerId: organizerId,
      },
      include: {
        organizer: true,
        attendees: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const transformedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date.toISOString(),
      location: event.location,
      imageUrl: event.imageUrl || null,
      organizer: {
        name: event.organizer.name,
        email: event.organizer.email,
      },
      attendeesCount: event.attendees.length,
    }));

    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error("Failed to fetch user events:", error);
    return NextResponse.json(
      { error: "Failed to fetch user events" },
      { status: 500 }
    );
  }
}
