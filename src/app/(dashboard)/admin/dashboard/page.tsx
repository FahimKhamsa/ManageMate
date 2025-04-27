"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, Users } from "lucide-react";

export default function AdminDashboardPage() {
  // In a real app, these would come from an API
  const stats = {
    pendingEvents: 12,
    upcomingEvents: 8,
    totalAttendees: 450,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-100">
                  Pending Events
                </p>
                <h2 className="text-4xl font-bold text-white mt-2">
                  {stats.pendingEvents}
                </h2>
              </div>
              <Clock className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">
                  Upcoming Events
                </p>
                <h2 className="text-4xl font-bold text-white mt-2">
                  {stats.upcomingEvents}
                </h2>
              </div>
              <CalendarDays className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-800 border-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-100">
                  Total Attendees
                </p>
                <h2 className="text-4xl font-bold text-white mt-2">
                  {stats.totalAttendees}
                </h2>
              </div>
              <Users className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Recent Event Requests
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">
                      Tech Conference 2024
                    </p>
                    <p className="text-sm text-gray-300">
                      Submitted 2 hours ago
                    </p>
                  </div>
                  <div className="text-sm text-gray-300">Pending Review</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">Digital Summit</p>
                    <p className="text-sm text-gray-300">March 15, 2024</p>
                  </div>
                  <div className="text-sm text-green-400">150 Attendees</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
