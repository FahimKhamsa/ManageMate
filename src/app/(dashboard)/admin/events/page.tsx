/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCard from "./_components/EventCard";
import { Event } from "@/lib/types";

export default function AdminEventsPage() {
  const [isActionPperformed, setIsActionPerformed] = useState(false);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [approvedEvents, setApprovedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      setIsLoading(true);
      setError(null);
      try {
        const [pendingRes, approvedRes] = await Promise.all([
          fetch("/api/events/pending"),
          fetch("/api/events"),
        ]);
        if (!pendingRes.ok || !approvedRes.ok) {
          throw new Error("Failed to fetch events");
        }
        const pending = await pendingRes.json();
        const approved = await approvedRes.json();
        console.log("Pending events:", pending);
        console.log("Approved events:", approved);
        setPendingEvents(pending);
        setApprovedEvents(approved);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setIsActionPerformed(false);
        setIsLoading(false);
      }
    }
    fetchAll();
  }, [isActionPperformed]);

  if (isLoading) {
    return <p className="text-gray-300">Loading events…</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Event Management</h1>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-gray-800">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-gray-700 text-gray-300"
          >
            Pending Events ({pendingEvents?.length})
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="data-[state=active]:bg-gray-700 text-gray-300"
          >
            Approved Events ({approvedEvents?.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingEvents?.length > 0 ? (
            <div className="space-y-4">
              {pendingEvents.map((evt) => (
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
            <p className="text-gray-400">No pending events.</p>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {approvedEvents?.length > 0 ? (
            <div className="space-y-4">
              {approvedEvents.map((evt) => (
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
            <p className="text-gray-400">No approved events.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
