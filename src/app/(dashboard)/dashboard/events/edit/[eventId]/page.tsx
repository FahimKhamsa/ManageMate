'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Event {
  id: string
  title: string
  location: string
  date: string
  description: string
}

export default function EditEventPage({
  params,
}: {
  params: { eventId: string }
}) {
  const router = useRouter()
  const { eventId } = params

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    description: '',
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch event')
        }
        const data = await response.json()
        setEvent(data)
        setFormData({
          title: data.title,
          location: data.location,
          date: data.date.slice(0, 10),
          description: data.description,
        })
      } catch (error) {
        console.error('Error fetching event:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        throw new Error('Failed to update event')
      }
      router.push('/dashboard/events')
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  if (loading) {
    return (
      <div className='text-center text-gray-300 mt-10'>
        Loading event details...
      </div>
    )
  }

  if (!event) {
    return (
      <div className='text-center text-gray-300 mt-10'>Event not found.</div>
    )
  }

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <Card className='bg-gray-800 border-gray-700 text-white'>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <Label htmlFor='title'>Event Title</Label>
              <Input
                id='title'
                name='title'
                value={formData.title}
                onChange={handleChange}
                className='bg-gray-700 text-white'
              />
            </div>
            <div>
              <Label htmlFor='location'>Location</Label>
              <Input
                id='location'
                name='location'
                value={formData.location}
                onChange={handleChange}
                className='bg-gray-700 text-white'
              />
            </div>
            <div>
              <Label htmlFor='date'>Date</Label>
              <Input
                id='date'
                name='date'
                type='date'
                value={formData.date}
                onChange={handleChange}
                className='bg-gray-700 text-white'
              />
            </div>
            <div>
              <Label htmlFor='description'>Description</Label>
              <Input
                id='description'
                name='description'
                value={formData.description}
                onChange={handleChange}
                className='bg-gray-700 text-white'
              />
            </div>
            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700'
            >
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
