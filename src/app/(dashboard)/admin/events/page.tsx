"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";
import Image from "next/image";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  status: "pending" | "approved";
  organizer: {
    name: string;
    email: string;
  };
}

export default function AdminEventsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pending");

  // In a real app, these would come from an API
  const events: Event[] = [
    {
      id: 1,
      title: "Tech Conference 2024",
      description:
        "Annual technology conference featuring the latest innovations",
      date: "2024-03-15",
      location: "San Francisco, CA",
      imageUrl: "https://picsum.photos/800/400",
      status: "pending",
      organizer: {
        name: "John Doe",
        email: "john@example.com",
      },
    },
    // Add more mock events as needed
  ];

  const handleEventClick = (eventId: number) => {
    router.push(`/admin/events/${eventId}`);
  };

  const EventCard = ({ event }: { event: Event }) => (
    <Card
      className="bg-gray-800 border-gray-700 mb-4 hover:border-gray-600 transition-all cursor-pointer"
      onClick={() => handleEventClick(event.id)}
    >
      <div className="flex items-center p-4">
        <div className="relative w-48 h-32 flex-shrink-0">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="ml-6 flex-grow">
          <h3 className="text-xl font-semibold text-white">{event.title}</h3>
          <p className="text-gray-300 mt-2 line-clamp-2">{event.description}</p>
        </div>
        <div className="ml-6 flex-shrink-0 text-right">
          <p className="text-gray-300">
            {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="text-gray-400 mt-1">{event.location}</p>
          {event.status === "pending" && (
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle approve
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle deny
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Event Management</h1>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-gray-800">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-gray-700"
          >
            Pending Events
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="data-[state=active]:bg-gray-700"
          >
            Approved Events
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {events
              .filter((event) => event.status === "pending")
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="approved" className="mt-6">
          <div className="space-y-4">
            {events
              .filter((event) => event.status === "approved")
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
