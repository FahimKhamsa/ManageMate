/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar, MapPin, Users, Clock, ArrowLeft } from "lucide-react";
import { Event } from "@/lib/types";

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [eventData, setEventData] = useState<Event | null>(null);
  const [attendeeCount, setAttendeeCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await fetch(`/api/events/${params.id}`);
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const { event } = await res.json();
        console.log("Event --> ", event);
        setEventData(event);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAttendeeCount = async () => {
      try {
        const res = await fetch(`/api/events/${params.id}/attendees`);
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const { count } = await res.json();
        setAttendeeCount(count);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
    fetchAttendeeCount();
  }, [params.id]);

  // useEffect(() => {
  //   if (eventData?.images) {
  //     const interval = setInterval(() => {
  //       setCurrentImageIndex((prev) =>
  //         prev === eventData.images.length - 1 ? 0 : prev + 1
  //       );
  //     }, 5000);

  //     return () => clearInterval(interval);
  //   }
  // }, [eventData?.images]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {error}
      </div>
    );
  if (!eventData)
    return (
      <div className="flex justify-center items-center h-screen">
        Event not found
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="variant-ghost size-sm hover:bg-gray-800 text-gray-400 hover:text-white -mt-3"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Return to previous page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <h1 className="text-xl font-bold text-white">{eventData.title}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* <div className="lg:w-3/5">
          <div className="relative aspect-[16/9] bg-gray-800 rounded-lg overflow-hidden">
            <Image
              src={eventData.images[currentImageIndex]}
              alt={`${eventData.title} image ${currentImageIndex + 1}`}
              fill
              className="object-cover rounded-t-lg"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {eventData.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full ${
                    currentImageIndex === idx ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div> */}
        <div className="lg:w-3/5">
          <div className="relative aspect-[16/9] bg-gray-800 rounded-lg overflow-hidden">
            <Image
              src={eventData.imageUrl || "https://picsum.photos/800/400"}
              alt={`${eventData.title} Thumbnail`}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
        </div>

        <div className="lg:w-2/5">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="p-4">
              <CardDescription className="text-xs text-gray-100 mt-1">
                {eventData.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="space-y-1.5 text-gray-400 text-xs">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  {new Date(eventData.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1.5" />
                  {/* {eventData.time} */}
                  9:00 AM - 6:00 PM
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1.5" />
                  {eventData.location}
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1.5" />
                  {attendeeCount} attendees
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white">
                  Organizer Details
                </h3>
                <div className="space-y-1.5 text-gray-300 text-xs">
                  <div>
                    <strong>Name:</strong> {eventData.organizer.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {eventData.organizer.email}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700 mt-6">
        <CardHeader className="p-4">
          <CardTitle className="text-sm text-white">About This Event</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 prose prose-invert max-w-none">
          {eventData.description.split("\n").map((p, i) => (
            <p key={i} className="text-xs text-gray-300 mb-3">
              {p}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
