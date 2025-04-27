'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Calendar, MapPin } from 'lucide-react'

interface Ticket {
  id: string
  eventId: string
  userId: string
  type: string
  price: number
  purchaseDate: string
  status: string
  event?: {
    name: string
    location: string
    date: string
  }
}

export default function TicketDetailsPage({
  params,
}: {
  params: { ticketId: string }
}) {
  const router = useRouter()
  const { ticketId } = params
  const [ticket, setTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/ticketDetails/${ticketId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch ticket')
        }
        const data = await response.json()
        setTicket(data.ticket)
      } catch (error) {
        console.error('Error fetching ticket:', error)
      }
    }

    fetchTicket()
  }, [ticketId])

  const handleRefund = async () => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to refund ticket')
      }
      router.push('/dashboard')
    } catch (error) {
      console.error('Error refunding ticket:', error)
    }
  }

  if (!ticket) {
    return (
      <div className='text-center text-gray-300 mt-10'>
        Loading ticket details...
      </div>
    )
  }

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <Card className='bg-gray-800 border-gray-700 text-white'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>{ticket.event.title} Ticket</CardTitle>
            <Button
              onClick={() =>
                router.push(`/dashboard/events/${ticket.event.id}`)
              }
            >
              View Event
            </Button>
          </div>
          <CardDescription>Status: {ticket.status}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center text-sm'>
            <Calendar className='h-4 w-4 mr-2' />
            Purchased on: {new Date(ticket.purchaseDate).toLocaleDateString()}
          </div>
          {ticket.event && (
            <>
              <div className='flex items-center text-sm'>
                <MapPin className='h-4 w-4 mr-2' />
                {ticket.event.location}
              </div>
              <div className='flex items-center text-sm'>
                <Calendar className='h-4 w-4 mr-2' />
                Event Date: {new Date(ticket.event.date).toLocaleDateString()}
              </div>
            </>
          )}
          <div className='flex items-center text-sm'>
            Price: ${ticket.price}
          </div>
          <Button
            className='w-full bg-red-600 hover:bg-red-700'
            onClick={handleRefund}
          >
            Refund Ticket
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
