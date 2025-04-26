/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PlusIcon } from '@radix-ui/react-icons'
import Image from 'next/image'

interface Event {
  id: number
  title: string
  description: string
  date: string
  location: string
  imageUrl?: string
  organizer: {
    name: string
    email: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { data: session } = useSession()
  const userId = session?.user?.id

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/events/userEvent/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = () => {
    router.push('/events/create')
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[50vh]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-white'>Your Events</h1>
        <Button
          onClick={handleCreateEvent}
          className='bg-blue-600 hover:bg-blue-700 text-white'
        >
          <PlusIcon className='mr-2 h-4 w-4' />
          Create Event
        </Button>
      </div>

      {error && (
        <Alert variant='destructive' className='bg-red-900 border-red-800'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {events.length === 0 ? (
        <Card className='bg-gray-800 border-gray-700'>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <p className='text-gray-400 text-lg mb-4'>No events found</p>
            <Button
              onClick={handleCreateEvent}
              className='bg-blue-600 hover:bg-blue-700 text-white'
            >
              <PlusIcon className='mr-2 h-4 w-4' />
              Create Your First Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {events.map((event) => (
            <Card
              key={event.id}
              className='bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors'
            >
              {event.imageUrl && (
                <div className='relative w-full h-48'>
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className='object-cover rounded-t-lg'
                  />
                </div>
              )}
              <CardHeader>
                <h3 className='text-xl font-semibold text-white'>
                  {event.title}
                </h3>
                <div className='text-sm text-gray-400 mt-2'>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <p>{event.location}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-gray-300'>{event.description}</p>
                <div className='mt-4 pt-4 border-t border-gray-700'>
                  <p className='text-sm text-gray-400'>
                    Organized by: {event.organizer.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
