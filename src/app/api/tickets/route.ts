import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { ticketId: string } }
) {
  try {
    const ticketId = params.ticketId
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: true,
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { ticketId: string } }
) {
  try {
    const ticketId = params.ticketId

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Decrement attendee count
    const attendee = await prisma.attendee.findUnique({
      where: {
        userId_eventId: {
          userId: ticket.userId,
          eventId: ticket.eventId,
        },
      },
    })

    if (attendee) {
      if (attendee.count > 1) {
        await prisma.attendee.update({
          where: {
            userId_eventId: {
              userId: ticket.userId,
              eventId: ticket.eventId,
            },
          },
          data: {
            count: {
              decrement: 1,
            },
          },
        })
      } else {
        await prisma.attendee.delete({
          where: {
            userId_eventId: {
              userId: ticket.userId,
              eventId: ticket.eventId,
            },
          },
        })
      }
    }

    // Delete the ticket
    await prisma.ticket.delete({
      where: { id: ticketId },
    })

    return NextResponse.json({ message: 'Ticket refunded successfully' })
  } catch (error) {
    console.error('Error refunding ticket:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
