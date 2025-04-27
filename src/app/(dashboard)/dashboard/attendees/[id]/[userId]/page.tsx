'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Ticket {
  id: string
  type: 'EARLY_BIRD' | 'REGULAR' | 'VIP'
  eventId: number
  price: string
  status: 'PAID' | 'REFUNDED'
}

interface User {
  id: number
  name: string
  email: string
}

export default function AttendeeDetailsPage({
  params,
}: {
  params: { id: string; userId: string }
}) {
  const { id: eventId, userId } = params
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`/api/attendees/user/${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user info')
        }
        const data = await response.json()
        setUser(data.user)

        const eventTickets = data.tickets.filter(
          (ticket: Ticket) => ticket.eventId === parseInt(eventId)
        )
        setTickets(eventTickets)
      } catch (error) {
        console.error('Error fetching attendee details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [eventId, userId])

  if (loading) {
    return (
      <div className='text-center text-gray-300 mt-10'>
        Loading attendee details...
      </div>
    )
  }

  if (!user) {
    return (
      <div className='text-center text-gray-300 mt-10'>Attendee not found.</div>
    )
  }

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <Card className='bg-gray-800 border-gray-700 text-white'>
        <CardHeader>
          <CardTitle>Attendee Details</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div>
            <h2 className='text-xl font-semibold'>Name:</h2>
            <p>{user.name}</p>
          </div>
          <div>
            <h2 className='text-xl font-semibold'>Email:</h2>
            <p>{user.email}</p>
          </div>

          <div>
            <h2 className='text-xl font-semibold'>Tickets:</h2>
            {tickets.length > 0 ? (
              <ul className='space-y-2'>
                {tickets.map((ticket) => (
                  <li key={ticket.id} className='bg-gray-700 p-3 rounded-md'>
                    <div>Type: {ticket.type}</div>
                    <div>Status: {ticket.status}</div>
                    <div>Price: ${ticket.price}</div>
                    <div>Ticket ID: ${ticket.id}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tickets found for this event.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
