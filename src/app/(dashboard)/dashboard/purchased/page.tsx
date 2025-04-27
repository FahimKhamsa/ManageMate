'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Calendar, MapPin, PlusIcon, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface Ticket {
  id: string
  eventId: string
  userId: string
  type: string
  price: number
  purchaseDate: string
  status: string
}

export default function EventsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [tickets, setTickets] = useState<Ticket[]>([])

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (!userId) return
        const response = await fetch(`/api/tickets/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch tickets')
        }
        const data = await response.json()
        setTickets(data.tickets)
      } catch (error) {
        console.error('Error fetching tickets:', error)
      }
    }

    fetchTickets()
  }, [userId])

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-white'>Your Tickets</h1>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {tickets.map((ticket) => (
          <Card
            key={ticket.id}
            className='bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105'
            onClick={() => router.push(`/dashboard/purchased/${ticket.id}`)}
          >
            <CardHeader className='p-4'>
              <CardTitle className='text-white capitalize'>
                {ticket.event.title} {ticket.type} Ticket
              </CardTitle>
              <CardDescription className='text-xs text-gray-400 mt-1'>
                Status: {ticket.status}
              </CardDescription>
            </CardHeader>
            <CardContent className='p-4 pt-0'>
              <div className='space-y-2'>
                <div className='flex items-center text-gray-300 text-xs'>
                  <Calendar className='h-3 w-3 mr-1.5' />
                  Purchased on:{' '}
                  {new Date(ticket.purchaseDate).toLocaleDateString()}
                </div>
                <div className='flex items-center text-gray-300 text-xs'>
                  <MapPin className='h-3 w-3 mr-1.5' />
                  Event ID: {ticket.eventId}
                </div>
                <div className='flex items-center text-gray-300 text-xs'>
                  <Users className='h-3 w-3 mr-1.5' />
                  Price: ${ticket.price}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
