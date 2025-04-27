import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = parseInt(params.id)

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const attendee = await prisma.attendee.findFirst({
      where: { userId },
    })

    if (!attendee) {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 })
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        type: true,
        eventId: true,
        price: true,
        status: true,
      },
    })

    return NextResponse.json({ user, tickets })
  } catch (error) {
    console.error('Failed to fetch user info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user info' },
      { status: 500 }
    )
  }
}
