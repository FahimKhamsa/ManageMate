'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [isEditing, setIsEditing] = useState(false)

  const [name, setName] = useState(session?.user?.name || '')
  const [email, setEmail] = useState(session?.user?.email || '')

  const handleSave = async () => {
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })

      if (res.ok) {
        toast.success('Profile updated successfully!')

        await update({ name, email })

        setName(name)
        setEmail(email)

        setIsEditing(false)
      } else {
        const data = await res.json()
        toast.error(data.message || 'Failed to update profile.')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred while updating.')
    }
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold text-white'>Profile</h1>

      <Card className='bg-gray-800 border-gray-700'>
        <CardHeader>
          <div className='flex items-center space-x-4'>
            <Avatar className='h-20 w-20'>
              <AvatarImage
                src={session?.user?.image || 'https://github.com/shadcn.png'}
              />
              <AvatarFallback>
                <UserIcon className='h-12 w-12' />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className='text-2xl font-semibold text-white'>{name}</h2>
              <p className='text-gray-400'>{email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name' className='text-white'>
                Name
              </Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className='bg-gray-700 border-gray-600 text-white'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-white'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className='bg-gray-700 border-gray-600 text-white'
              />
            </div>
          </div>

          <div className='flex justify-end space-x-4'>
            <Button
              variant='outline'
              onClick={() => setIsEditing(!isEditing)}
              className='border-gray-600 text-white hover:bg-gray-700'
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
            {isEditing && (
              <Button
                className='bg-blue-600 hover:bg-blue-700 text-white'
                onClick={handleSave}
              >
                Save Changes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
