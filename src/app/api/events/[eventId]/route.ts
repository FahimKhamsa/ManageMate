import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ eventId: string }> }
) {
  // 1. unwrap the params promise
  const { eventId } = await context.params;
  const id = parseInt(eventId, 10);

  // 2. now you can use `id` safely
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: true,
        attendees: {
          include: {
            user: true,
          },
        },
        feedbacks: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}
