"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [upcomingCount, setUpcomingCount] = useState<number>(0);
  const [attendeeCount, setAttendeeCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [pendingRes, upcomingRes, attendeesRes] = await Promise.all([
          fetch("/api/events/pending/count"),
          fetch("/api/events/upcoming/count"),
          fetch("/api/tickets/count"),
        ]);

        if (!pendingRes.ok || !upcomingRes.ok || !attendeesRes.ok) {
          throw new Error("Failed to fetch stats");
        }

        const { count: p } = await pendingRes.json();
        const { count: u } = await upcomingRes.json();
        const { count: a } = await attendeesRes.json();

        setPendingCount(p);
        setUpcomingCount(u);
        setAttendeeCount(a);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-gray-300">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card
          onClick={() => router.push("/admin/events")}
          className="bg-gradient-to-br from-purple-600 to-purple-800 border-none"
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-100">
                  Pending Events
                </p>
                <h2 className="text-4xl font-bold text-white mt-2">
                  {pendingCount}
                </h2>
              </div>
              <Clock className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => router.push("/admin/events/upcoming")}
          className="bg-gradient-to-br from-blue-600 to-blue-800 border-none"
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">
                  Upcoming Events
                </p>
                <h2 className="text-4xl font-bold text-white mt-2">
                  {upcomingCount}
                </h2>
              </div>
              <CalendarDays className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card
          // onClick={() => router.push("/admin/events?status=pending")}
          className="bg-gradient-to-br from-green-600 to-green-800 border-none"
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-100">
                  Total Attendees
                </p>
                <h2 className="text-4xl font-bold text-white mt-2">
                  {attendeeCount}
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
