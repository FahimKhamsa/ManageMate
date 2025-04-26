'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Search } from 'lucide-react'

interface Attendee {
  id: number
  user: {
    name: string
    email: string
  }
  event: {
    title: string
  }
  registeredAt: string
  status: 'registered' | 'checked_in'
}

export default function AttendeesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await fetch('/api/attendees')
        if (!response.ok) {
          throw new Error('Failed to fetch attendees')
        }
        const data = await response.json()
        setAttendees(data.attendees)
      } catch (error) {
        console.error('Error fetching attendees:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendees()
  }, [])

  const filteredAttendees = attendees.filter((attendee) => {
    const search = searchTerm.toLowerCase()
    return (
      attendee.user.name.toLowerCase().includes(search) ||
      attendee.user.email.toLowerCase().includes(search) ||
      attendee.event.title.toLowerCase().includes(search)
    )
  })

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-white'>Attendees</h1>
        <div className='flex space-x-2'>
          <div className='relative'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Search attendees...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-8 bg-gray-800 border-gray-700 text-white'
            />
          </div>
          <Button>Export CSV</Button>
        </div>
      </div>

      <div className='bg-gray-800 rounded-lg border border-gray-700'>
        {loading ? (
          <div className='p-6 text-gray-400'>Loading attendees...</div>
        ) : filteredAttendees.length === 0 ? (
          <div className='p-6 text-gray-400'>No attendees found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className='border-gray-700'>
                <TableHead className='text-gray-300'>Name</TableHead>
                <TableHead className='text-gray-300'>Email</TableHead>
                <TableHead className='text-gray-300'>Event</TableHead>
                <TableHead className='text-gray-300'>
                  Registration Date
                </TableHead>
                <TableHead className='text-gray-300'>Status</TableHead>
                <TableHead className='text-gray-300 text-right'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendees.map((attendee) => (
                <TableRow key={attendee.id} className='border-gray-700'>
                  <TableCell className='font-medium text-white'>
                    {attendee.user.name}
                  </TableCell>
                  <TableCell className='text-gray-300'>
                    {attendee.user.email}
                  </TableCell>
                  <TableCell className='text-gray-300'>
                    {attendee.event.title}
                  </TableCell>
                  <TableCell className='text-gray-300'>
                    {new Date(attendee.registeredAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className='text-gray-300'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        attendee.status === 'checked_in'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {attendee.status === 'checked_in'
                        ? 'Confirmed'
                        : 'Pending'}
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <MoreHorizontal className='h-4 w-4 text-gray-400' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align='end'
                        className='bg-gray-800 border-gray-700'
                      >
                        <DropdownMenuItem className='text-gray-300 focus:bg-gray-700 focus:text-white cursor-pointer'>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className='text-gray-300 focus:bg-gray-700 focus:text-white cursor-pointer'>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className='text-gray-300 focus:bg-gray-700 focus:text-white cursor-pointer'>
                          Send Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
