'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  ArrowLeft,
  MessageCircleQuestion,
} from 'lucide-react'

interface EventData {
  id: number
  title: string
  date: string
  time: string
  location: string
  attendees: number
  description: string
  detailedDescription: string
  price: {
    regular: number
    early: number
    vip: number
  }
  images: string[]
}

export default function EventDetailsPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  console.log(params.id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch event')
        }
        const data = await response.json()

        const transformedData: EventData = {
          id: data.id,
          title: data.title,
          date: new Date(data.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          time: '9:00 AM - 6:00 PM',
          location: data.location,
          attendees: data.attendees.length,
          description: data.description,
          detailedDescription: data.detailedDescription || data.description,
          price: {
            regular: data.ticketPrices.REGULAR,
            early: data.ticketPrices.EARLY_BIRD,
            vip: data.ticketPrices.VIP,
          },
          images: data.imageUrl
            ? [data.imageUrl]
            : [
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
                'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=1000',
                'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000',
              ],
        }

        setEventData(transformedData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEventData()
  }, [params.id])

  useEffect(() => {
    if (eventData?.images) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === eventData.images.length - 1 ? 0 : prev + 1
        )
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [eventData?.images])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Error: {error}
      </div>
    )
  }

  if (!eventData) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Event not found
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-1'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='hover:bg-gray-800 text-gray-400 hover:text-white transition-colors -mt-3'
                onClick={() => router.back()}
              >
                <ArrowLeft className='h-4 w-4 mr-1' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Return to previous page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-bold text-white'>{eventData.title}</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='hover:bg-gray-800 text-gray-400 hover:text-white transition-colors'
                >
                  <MessageCircleQuestion className='h-7 w-7' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Contact organizer</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Image Slideshow - 3/5 width */}
        <div className='lg:w-3/5'>
          <div className='relative aspect-[16/9] bg-gray-800 rounded-lg overflow-hidden'>
            <div className='relative w-full h-full'>
              <Image
                src={eventData.images[currentImageIndex]}
                alt={`Slide ${currentImageIndex + 1}`}
                fill
                className='object-cover rounded-t-lg'
              />
            </div>
            <div className='absolute bottom-4 left-0 right-0 flex justify-center space-x-2'>
              {eventData.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full ${
                    currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Event Info - 2/5 width */}
        <div className='lg:w-2/5'>
          <Card className='bg-gray-800 border-gray-700'>
            <CardHeader className='p-4'>
              <CardDescription className='text-xs text-gray-100 mt-1'>
                {eventData.description}
              </CardDescription>
            </CardHeader>
            <CardContent className='p-4 pt-0 space-y-4'>
              <div className='space-y-1.5'>
                <div className='flex items-center text-gray-400 text-xs'>
                  <Calendar className='h-3 w-3 mr-1.5' />
                  {eventData.date}
                </div>
                <div className='flex items-center text-gray-400 text-xs'>
                  <Clock className='h-3 w-3 mr-1.5' />
                  {eventData.time}
                </div>
                <div className='flex items-center text-gray-400 text-xs'>
                  <MapPin className='h-3 w-3 mr-1.5' />
                  {eventData.location}
                </div>
                <div className='flex items-center text-gray-400 text-xs'>
                  <Users className='h-3 w-3 mr-1.5' />
                  {eventData.attendees} attendees
                </div>
              </div>

              <div className='space-y-2'>
                <h3 className='text-sm font-medium text-white'>
                  Ticket Options
                </h3>
                <div className='space-y-1.5'>
                  <div className='flex items-center justify-between text-gray-300 text-xs'>
                    <div className='flex items-center'>
                      <DollarSign className='h-3 w-3 mr-1.5' />
                      Early Bird Ticket
                    </div>
                    <span>${eventData.price.early}</span>
                  </div>
                  <div className='flex items-center justify-between text-gray-300 text-xs'>
                    <div className='flex items-center'>
                      <DollarSign className='h-3 w-3 mr-1.5' />
                      Regular Ticket
                    </div>
                    <span>${eventData.price.regular}</span>
                  </div>
                  <div className='flex items-center justify-between text-gray-300 text-xs'>
                    <div className='flex items-center'>
                      <DollarSign className='h-3 w-3 mr-1.5' />
                      VIP Ticket
                    </div>
                    <span>${eventData.price.vip}</span>
                  </div>
                </div>
                <Button size='sm' className='w-full mt-3 text-xs'>
                  Purchase Tickets
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Description */}
      <Card className='bg-gray-800 border-gray-700 mt-6'>
        <CardHeader className='p-4'>
          <CardTitle className='text-sm text-white'>About This Event</CardTitle>
        </CardHeader>
        <CardContent className='p-4 pt-0'>
          <div className='prose prose-invert max-w-none'>
            {eventData.detailedDescription
              .split('\n')
              .map((paragraph, index) => (
                <p key={index} className='text-xs text-gray-300 mb-3'>
                  {paragraph}
                </p>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
