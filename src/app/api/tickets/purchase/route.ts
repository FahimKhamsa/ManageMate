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

    const userId = parseInt(session.user.id)

    const tickets = await prisma.$transaction(async (tx) => {
      // create tickets
      const createdTickets = await tx.ticket.createMany({
        data: Array.from({ length: quantity }, () => ({
          eventId: parseInt(eventId),
          userId: userId,
          type: ticketType,
          price: price,
          status: 'PAID',
        })),
      })

      // ensure the attendee exists (create if not exists)
      await tx.attendee.upsert({
        where: {
          userId_eventId: {
            userId: userId,
            eventId: parseInt(eventId),
          },
        },
        update: {},
        create: {
          userId: userId,
          eventId: parseInt(eventId),
          status: 'registered', // default
        },
      })

      return createdTickets
    })

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error(
      'Ticket purchase failed:',
      error instanceof Error ? error.message : error
    )
    return NextResponse.json(
      { error: 'Failed to purchase tickets', detail: String(error) },
      { status: 500 }
    )
  }
}
