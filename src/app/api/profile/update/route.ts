import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { name, email } = await req.json()

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (
      existingUser &&
      existingUser.id !== session.user?.id &&
      existingUser.email !== session.user?.email
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is already in use by another account.',
        },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user?.email! },
      data: { name, email },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
