import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { eventId } = await request.json()

    const attendee = await prisma.attendee.create({
      data: {
        status: 'registered',
        user: {
          connect: { id: session.user.id },
        },
        event: {
          connect: { id: eventId },
        },
      },
      include: {
        user: true,
        event: true,
      },
    })

    return NextResponse.json(attendee)
  } catch (error) {
    console.error('Failed to register attendee:', error)
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { attendeeId, status } = await request.json()

    const updatedAttendee = await prisma.attendee.update({
      where: { id: attendeeId },
      data: { status },
      include: {
        user: true,
        event: true,
      },
    })

    return NextResponse.json(updatedAttendee)
  } catch (error) {
    console.error('Failed to update attendee:', error)
    return NextResponse.json(
      { error: 'Failed to update attendee status' },
      { status: 500 }
    )
  }
}
