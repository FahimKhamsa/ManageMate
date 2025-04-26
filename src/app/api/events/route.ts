import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = await prisma.event.findMany({
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, date, location, ticketPrices } = body

    if (!title || !description || !date || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const validatedPrices = {
      EARLY_BIRD: ticketPrices?.EARLY_BIRD || 0,
      REGULAR: ticketPrices?.REGULAR || 0,
      VIP: ticketPrices?.VIP || 0,
    }

    for (const [type, price] of Object.entries(validatedPrices)) {
      if (isNaN(Number(price))) {
        return NextResponse.json(
          { error: `Invalid price for ${type} ticket` },
          { status: 400 }
        )
      }
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        ticketPrices: validatedPrices,
        organizerId: parseInt(session.user.id),
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
