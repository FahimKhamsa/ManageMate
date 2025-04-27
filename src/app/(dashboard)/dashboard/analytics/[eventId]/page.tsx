'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function AnalyticsPage() {
  const { eventId } = useParams() as { eventId: string }
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(`/api/analytics/${eventId}`)
        const data = await response.json()
        setAnalytics(data.analytics)
      } catch (error) {
        console.error('Failed to load analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [eventId])

  if (loading) {
    return <div className='text-white'>Loading analytics...</div>
  }

  if (!analytics) {
    return <div className='text-white'>No analytics found.</div>
  }

  const pieChartData = [
    {
      name: 'Early Bird',
      value: analytics.earlyBirdSales || 0,
    },
    { name: 'Regular', value: analytics.regularSales || 0 },
    { name: 'VIP', value: analytics.vipSales || 0 },
  ]

  return (
    <div>
      <h1 className='text-2xl font-bold text-white mb-6'>
        Analytics for {analytics.event.title}
      </h1>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6'>
        <Card className='bg-gray-800 border-gray-700'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-300'>
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-white'>
              ${parseFloat(analytics.totalSales).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gray-800 border-gray-700'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-300'>
              Total Tickets Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-white'>
              {analytics.totalTickets}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card className='bg-gray-800 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-white'>
              Ticket Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx='50%'
                    cy='50%'
                    labelLine={true}
                    outerRadius={100}
                    fill='#8884d8'
                    dataKey='value'
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
