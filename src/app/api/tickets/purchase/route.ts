import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { eventId, ticketType, quantity = 1 } = await request.json()

    if (!eventId || !ticketType || quantity < 1) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      select: { ticketPrices: true },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (!event.ticketPrices) {
      return NextResponse.json(
        { error: 'Ticket prices not set' },
        { status: 400 }
      )
    }

    const price = event.ticketPrices[ticketType]
    if (price === undefined) {
      return NextResponse.json(
        { error: 'Invalid ticket type' },
        { status: 400 }
      )
    }

    const tickets = await prisma.$transaction(
      Array.from({ length: quantity }, () =>
        prisma.ticket.create({
          data: {
            eventId: parseInt(eventId),
            userId: parseInt(session.user.id),
            type: ticketType,
            price: price,
            status: 'PAID',
          },
        })
      )
    )

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error(
      'Ticket purchase failed:',
      error instanceof Error ? error.message : error
    )
    return NextResponse.json(
      { error: 'Failed to purchase tickets', detail: error },
      { status: 500 }
    )
  }
}
