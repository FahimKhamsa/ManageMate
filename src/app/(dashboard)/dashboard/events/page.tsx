"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Users } from "lucide-react";

export default function EventsPage() {
  const router = useRouter();
  const [events] = useState([
    {
      id: 1,
      title: "Tech Conference 2025",
      date: "March 15, 2025",
      location: "San Francisco, CA",
      attendees: 250,
      description:
        "Join us for the biggest tech conference of the year featuring industry leaders and innovative workshops.",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000",
    },
    {
      id: 2,
      title: "Digital Marketing Summit",
      date: "April 20, 2025",
      location: "New York, NY",
      attendees: 150,
      description:
        "Learn the latest digital marketing strategies from experts in the field.",
      image:
        "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=1000",
    },
    {
      id: 3,
      title: "Startup Networking Event",
      date: "May 10, 2025",
      location: "Austin, TX",
      attendees: 100,
      description:
        "Connect with fellow entrepreneurs and investors in this exclusive networking event.",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000",
    },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Events</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Event</Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription className="text-gray-400">
                Fill in the details for your new event.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter location"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter description"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  placeholder="Enter image URL"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <Button className="w-full">Create Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card
            key={event.id}
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors overflow-hidden cursor-pointer"
            onClick={() => router.push(`/dashboard/events/${event.id}`)}
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg text-white">
                {event.title}
              </CardTitle>
              <CardDescription className="text-xs text-gray-400 line-clamp-2 mt-1">
                {event.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-1.5">
                <div className="flex items-center text-gray-300 text-xs">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  {event.date}
                </div>
                <div className="flex items-center text-gray-300 text-xs">
                  <MapPin className="h-3 w-3 mr-1.5" />
                  {event.location}
                </div>
                <div className="flex items-center text-gray-300 text-xs">
                  <Users className="h-3 w-3 mr-1.5" />
                  {event.attendees} attendees
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add edit functionality
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/events/${event.id}`);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
