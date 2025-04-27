import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

interface Params {
  params: {
    userId: string
  }
}

export async function GET(req: Request, { params }: Params) {
  const { userId } = params

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        event: true,
      },
    })

    return NextResponse.json({ tickets }, { status: 200 })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}
