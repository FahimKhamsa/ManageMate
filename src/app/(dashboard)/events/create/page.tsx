/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const MAX_FILE_SIZE = 5000000 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

const eventFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  organizerName: z.string().min(1, 'Organizer name is required'),
  organizerEmail: z.string().email('Invalid email address'),
  image: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Image is required')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      'Max file size is 5MB'
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    ),
  earlyBirdPrice: z.coerce.number().min(0, 'Price cannot be negative'),
  regularPrice: z.coerce.number().min(0, 'Price cannot be negative'),
  vipPrice: z.coerce.number().min(0, 'Price cannot be negative'),
})

type EventFormValues = z.infer<typeof eventFormSchema>

export default function CreateEventPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      location: '',
      organizerName: '',
      organizerEmail: '',
      earlyBirdPrice: 0,
      regularPrice: 0,
      vipPrice: 0,
    },
  })

  const onSubmit = async (data: EventFormValues) => {
    try {
      setSubmitting(true)

      // First, upload the image
      const imageFile = data.image[0]
      const formData = new FormData()
      formData.append('file', imageFile)

      // const uploadResponse = await fetch("/api/upload", {
      //   method: "POST",
      //   body: formData,
      // });

      // if (!uploadResponse.ok) {
      //   throw new Error("Failed to upload image");
      // }

      // const { imageUrl } = await uploadResponse.json();

      // Prepare ticket prices
      const ticketPrices = {
        EARLY_BIRD: data.earlyBirdPrice,
        REGULAR: data.regularPrice,
        VIP: data.vipPrice,
      }

      // Then create the event with the image URL
      const eventResponse = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          date: data.date,
          location: data.location,
          imageUrl: 'test',
          ticketPrices,
          organizer: {
            name: data.organizerName,
            email: data.organizerEmail,
          },
        }),
      })

      if (!eventResponse.ok) {
        throw new Error('Failed to create event')
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to create event:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-white mb-8'>Create New Event</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white'>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className='bg-gray-700 border-gray-600'
                    placeholder='Event title'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white'>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className='bg-gray-700 border-gray-600'
                    placeholder='Event description'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white'>Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='date'
                    className='bg-gray-700 border-gray-600'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='location'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white'>Location</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className='bg-gray-700 border-gray-600'
                    placeholder='Event location'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='image'
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel className='text-white'>Event Image</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='file'
                    accept='image/*'
                    onChange={(e) => onChange(e.target.files)}
                    className='bg-gray-700 border-gray-600'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='organizerName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white'>Organizer Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className='bg-gray-700 border-gray-600'
                    placeholder='Organizer name'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='organizerEmail'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white'>Organizer Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='email'
                    className='bg-gray-700 border-gray-600'
                    placeholder='Organizer email'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <FormField
              control={form.control}
              name='earlyBirdPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white'>
                    Early Bird Price ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      min='0'
                      step='0.01'
                      className='bg-gray-700 border-gray-600'
                      placeholder='50.00'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='regularPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white'>
                    Regular Price ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      min='0'
                      step='0.01'
                      className='bg-gray-700 border-gray-600'
                      placeholder='75.00'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='vipPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white'>VIP Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      min='0'
                      step='0.01'
                      className='bg-gray-700 border-gray-600'
                      placeholder='120.00'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.push('/dashboard')}
              className='w-full'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white'
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
