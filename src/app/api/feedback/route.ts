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
    const { eventId, rating, comment } = await request.json()

    const feedback = await prisma.feedback.create({
      data: {
        rating,
        comment,
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

    // Update event's average rating
    await updateEventAverageRating(eventId)

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Failed to submit feedback:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}

async function updateEventAverageRating(eventId: number) {
  const aggregations = await prisma.feedback.aggregate({
    where: { eventId },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  })

  await prisma.event.update({
    where: { id: eventId },
    data: {
      averageRating: aggregations._avg.rating,
      feedbackCount: aggregations._count.rating,
    },
  })
}
