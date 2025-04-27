"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params.id;

  // In a real app, fetch event details using the ID
  const event = {
    id: eventId,
    title: "Tech Conference 2024",
    description:
      "Annual technology conference featuring the latest innovations and trends in software development, AI, and cloud computing. Join us for three days of inspiring talks, workshops, and networking opportunities.",
    date: "2024-03-15",
    location: "San Francisco Convention Center, CA",
    imageUrl: "https://picsum.photos/800/400",
    status: "pending",
    organizer: {
      name: "John Doe",
      email: "john@example.com",
    },
    attendees: 150,
    ticketPrice: "$299",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">Event Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <div className="relative w-full h-64">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {event.title}
                  </h2>
                  <p className="text-gray-400 mt-1">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                {event.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                      <X className="h-4 w-4 mr-2" />
                      Deny
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{event.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <h3 className="text-xl font-semibold text-white">
                Event Details
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white">{event.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Expected Attendees</p>
                  <p className="text-white">{event.attendees}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Ticket Price</p>
                  <p className="text-white">{event.ticketPrice}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <h3 className="text-xl font-semibold text-white">Organizer</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-white">{event.organizer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{event.organizer.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
