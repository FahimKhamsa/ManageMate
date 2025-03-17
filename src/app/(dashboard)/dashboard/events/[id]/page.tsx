/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, MapPin, Users, Clock, DollarSign } from "lucide-react";

// In a real app, this would come from your database
const eventData = {
  id: 1,
  title: "Tech Conference 2025",
  date: "March 15, 2025",
  time: "9:00 AM - 6:00 PM",
  location: "San Francisco Convention Center, CA",
  attendees: 250,
  description:
    "Join us for the biggest tech conference of the year featuring industry leaders and innovative workshops.",
  detailedDescription: `
    Join us for an immersive three-day experience that will transform your perspective on technology and innovation. The Tech Conference 2025 brings together the brightest minds in the industry to share insights, showcase breakthrough technologies, and foster meaningful connections.

    What to Expect:
    • Keynote speeches from industry leaders
    • Interactive workshops and hands-on sessions
    • Networking opportunities with tech professionals
    • Product demonstrations and exhibitions
    • Panel discussions on emerging technologies

    Featured Topics:
    • Artificial Intelligence and Machine Learning
    • Blockchain and Cryptocurrency
    • Cybersecurity in the Digital Age
    • Cloud Computing and Edge Technologies
    • Future of Web Development
    
    Who Should Attend:
    • Software Developers
    • IT Professionals
    • Tech Entrepreneurs
    • Business Leaders
    • Students and Academics
  `,
  price: {
    regular: 599,
    early: 499,
    vip: 999,
  },
  images: [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000",
  ],
};

export default function EventDetailsPage() {
  const params = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === eventData.images.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-white mb-4">{eventData.title}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image Slideshow - 3/5 width */}
        <div className="lg:w-3/5">
          <div className="relative aspect-[16/9] bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={eventData.images[currentImageIndex]}
              alt={`Slide ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {eventData.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full ${
                    currentImageIndex === index ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Event Info - 2/5 width */}
        <div className="lg:w-2/5">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="p-4">
              {/* <CardTitle className="text-lg text-white">
                {eventData.title}
              </CardTitle> */}
              <CardDescription className="text-xs text-gray-100 mt-1">
                {eventData.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center text-gray-400 text-xs">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  {eventData.date}
                </div>
                <div className="flex items-center text-gray-400 text-xs">
                  <Clock className="h-3 w-3 mr-1.5" />
                  {eventData.time}
                </div>
                <div className="flex items-center text-gray-400 text-xs">
                  <MapPin className="h-3 w-3 mr-1.5" />
                  {eventData.location}
                </div>
                <div className="flex items-center text-gray-400 text-xs">
                  <Users className="h-3 w-3 mr-1.5" />
                  {eventData.attendees} attendees
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white">
                  Ticket Options
                </h3>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-gray-300 text-xs">
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1.5" />
                      Early Bird Ticket
                    </div>
                    <span>${eventData.price.early}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300 text-xs">
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1.5" />
                      Regular Ticket
                    </div>
                    <span>${eventData.price.regular}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300 text-xs">
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1.5" />
                      VIP Ticket
                    </div>
                    <span>${eventData.price.vip}</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-3 text-xs">
                  Purchase Tickets
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Description */}
      <Card className="bg-gray-800 border-gray-700 mt-6">
        <CardHeader className="p-4">
          <CardTitle className="text-sm text-white">About This Event</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="prose prose-invert max-w-none">
            {eventData.detailedDescription
              .split("\n")
              .map((paragraph, index) => (
                <p key={index} className="text-xs text-gray-300 mb-3">
                  {paragraph}
                </p>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
