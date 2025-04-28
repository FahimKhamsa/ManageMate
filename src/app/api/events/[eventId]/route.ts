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

    console.log("Event", event);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ eventId: string }> }
) {
  try {
    const body = await req.json();
    const { title, location, date, description } = body;

    const { eventId } = await context.params;
    const id = parseInt(eventId, 10);

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { title, location, date: new Date(date), description },
    });

    return NextResponse.json({ event: updatedEvent });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
