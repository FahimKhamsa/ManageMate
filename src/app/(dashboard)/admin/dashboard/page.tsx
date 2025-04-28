'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Clock, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Event {
  id: string
  title: string
  status: 'pending' | 'approved' | string
  date: string
  attendeesCount: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [pendingCount, setPendingCount] = useState<number>(0)
  const [upcomingCount, setUpcomingCount] = useState<number>(0)
  const [attendeeCount, setAttendeeCount] = useState<number>(0)
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const [pendingRes, upcomingRes, attendeesRes, eventsRes] =
          await Promise.all([
            fetch('/api/events/pending/count'),
            fetch('/api/events/upcoming/count'),
            fetch('/api/tickets/count'),
            fetch('/api/events'),
          ])

        if (
          !pendingRes.ok ||
          !upcomingRes.ok ||
          !attendeesRes.ok ||
          !eventsRes.ok
        ) {
          throw new Error('Failed to fetch stats')
        }

        const { count: p } = await pendingRes.json()
        const { count: u } = await upcomingRes.json()
        const { count: a } = await attendeesRes.json()
        const events: Event[] = await eventsRes.json()

        setPendingCount(p)
        setUpcomingCount(u)
        setAttendeeCount(a)

        const pendingEvents = events.filter(
          (event) => event.status === 'pending'
        )
        const approvedEvents = events.filter(
          (event) => event.status === 'approved'
        )

        setRecentEvents(pendingEvents)
        setUpcomingEvents(approvedEvents)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <p className='text-gray-300'>Loading dashboard…</p>
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold text-white'>Admin Dashboard</h1>

      <div className='grid gap-6 md:grid-cols-3'>
        <Card
          onClick={() => router.push('/admin/events')}
          className='bg-gradient-to-br from-purple-600 to-purple-800 border-none'
        >
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-purple-100'>
                  Pending Events
                </p>
                <h2 className='text-4xl font-bold text-white mt-2'>
                  {pendingCount}
                </h2>
              </div>
              <Clock className='h-8 w-8 text-purple-200' />
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => router.push('/admin/events/upcoming')}
          className='bg-gradient-to-br from-blue-600 to-blue-800 border-none'
        >
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-blue-100'>
                  Upcoming Events
                </p>
                <h2 className='text-4xl font-bold text-white mt-2'>
                  {upcomingCount}
                </h2>
              </div>
              <CalendarDays className='h-8 w-8 text-blue-200' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-green-600 to-green-800 border-none'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-green-100'>
                  Total Attendees
                </p>
                <h2 className='text-4xl font-bold text-white mt-2'>
                  {attendeeCount}
                </h2>
              </div>
              <Users className='h-8 w-8 text-green-200' />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Recent Event Requests */}
        <Card className='bg-gray-800 border-gray-700'>
          <CardContent className='pt-6'>
            <h3 className='text-xl font-semibold text-white mb-4'>
              Recent Event Requests
            </h3>
            <div className='space-y-4'>
              {recentEvents.length > 0 ? (
                recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className='flex items-center justify-between p-3 bg-gray-700 rounded-lg'
                  >
                    <div>
                      <p className='text-white font-medium'>{event.title}</p>
                      <p className='text-sm text-gray-300'>
                        Submitted on {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className='text-sm text-gray-300'>Pending Review</div>
                  </div>
                ))
              ) : (
                <p className='text-gray-400'>No recent requests.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className='bg-gray-800 border-gray-700'>
          <CardContent className='pt-6'>
            <h3 className='text-xl font-semibold text-white mb-4'>
              Upcoming Events
            </h3>
            <div className='space-y-4'>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className='flex items-center justify-between p-3 bg-gray-700 rounded-lg'
                  >
                    <div>
                      <p className='text-white font-medium'>{event.title}</p>
                      <p className='text-sm text-gray-300'>
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className='text-sm text-green-400'>
                      {event.attendees.reduce((sum, a) => sum + a.count, 0)}{' '}
                      Attendees
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-gray-400'>No upcoming events.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
