'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PurchaseTicketModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: number
  eventName: string
  prices: {
    regular: number
    early: number
    vip: number
  }
}

export default function PurchaseTicketModal({
  isOpen,
  onClose,
  eventId,
  eventName,
  prices,
}: PurchaseTicketModalProps) {
  const router = useRouter()
  const [ticketType, setTicketType] = useState<
    'EARLY_BIRD' | 'REGULAR' | 'VIP' | ''
  >('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getPrice = () => {
    if (ticketType === 'EARLY_BIRD') return prices.early
    if (ticketType === 'REGULAR') return prices.regular
    if (ticketType === 'VIP') return prices.vip
    return 0
  }

  const totalAmount = getPrice() * quantity

  const handlePurchase = async () => {
    if (!ticketType || quantity < 1) {
      setError('Please select ticket type and quantity')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          ticketType,
          quantity,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        setError(errorData.error || 'Failed to purchase')
      } else {
        onClose()
        router.push('/dashboard') // redirect to dashboard
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-gray-900 border-gray-700 text-white'>
        <DialogHeader>
          <DialogTitle>Purchase Ticket</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <Label className='text-xs'>Event</Label>
            <div className='text-sm'>{eventName}</div>
          </div>

          <div>
            <Label className='text-xs'>Ticket Type</Label>
            <Select onValueChange={(value) => setTicketType(value as any)}>
              <SelectTrigger className='mt-1 bg-gray-800 border-gray-700 text-white'>
                <SelectValue placeholder='Select ticket type' />
              </SelectTrigger>
              <SelectContent className='bg-gray-800 border-gray-700 text-white'>
                <SelectItem value='EARLY_BIRD'>
                  Early Bird - ${prices.early}
                </SelectItem>
                <SelectItem value='REGULAR'>
                  Regular - ${prices.regular}
                </SelectItem>
                <SelectItem value='VIP'>VIP - ${prices.vip}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className='text-xs'>Quantity (Max 4)</Label>
            <Input
              type='number'
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.min(4, Math.max(1, parseInt(e.target.value) || 1))
                )
              }
              className='mt-1 bg-gray-800 border-gray-700 text-white'
              min={1}
              max={4}
            />
          </div>

          <div className='flex justify-between items-center'>
            <span className='text-sm font-medium'>Total:</span>
            <span className='text-lg font-bold'>${totalAmount}</span>
          </div>

          {error && <div className='text-red-500 text-xs'>{error}</div>}

          <Button
            disabled={!ticketType || loading}
            onClick={handlePurchase}
            className='w-full'
          >
            {loading ? 'Processing...' : 'Purchase'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
