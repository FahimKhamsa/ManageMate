/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ eventId: string }> }
) {
  // 1. unwrap the params promise
  const { eventId } = await context.params;
  const id = parseInt(eventId, 10);

  try {
    await prisma.event.delete({
      where: { id: id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Decline error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
