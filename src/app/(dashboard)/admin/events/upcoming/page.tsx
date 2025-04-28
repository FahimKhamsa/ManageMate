/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCard from "../_components/EventCard";
import { Event } from "@/lib/types";

export default function UpcomingEventsPage() {
  const [isActionPerformed, setIsActionPerformed] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUpcoming() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/events/upcoming");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const { events: data } = await res.json();
        setEvents(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setIsActionPerformed(false);
        setIsLoading(false);
      }
    }
    fetchUpcoming();
  }, [isActionPerformed]);

  if (isLoading) {
    return <p className="text-gray-300">Loading upcoming events…</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Upcoming Events</h1>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="bg-gray-800">
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-gray-700 text-gray-300"
          >
            Upcoming Events ({events.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  isAdmin
                  navigationLink="/admin/events"
                  setIsActionPerformed={setIsActionPerformed}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No upcoming events.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
