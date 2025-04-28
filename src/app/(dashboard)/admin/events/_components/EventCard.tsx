import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Check, Trash, X } from "lucide-react";
import Image from "next/image";
import { Event } from "@/lib/types";

export default function EventCard({
  event,
  isAdmin = false,
  navigationLink,
  setIsActionPerformed,
}: {
  event: Event;
  isAdmin?: boolean;
  navigationLink: string;
  setIsActionPerformed: (value: boolean) => void;
}) {
  const router = useRouter();

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await fetch(`/api/events/${event.id}/approve`, {
      method: "POST",
    });
    if (res.ok) {
      // router.refresh();
      setIsActionPerformed(true);
    } else {
      console.error("Failed to approve");
    }
  };

  const handleDecline = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await fetch(`/api/events/${event.id}/decline`, {
      method: "POST",
    });
    if (res.ok) {
      // router.refresh();
      setIsActionPerformed(true);
    } else {
      console.error("Failed to decline");
    }
  };

  const handleEventClick = () => {
    router.push(`${navigationLink}/${event.id}`);
  };

  return (
    <Card
      className="bg-gray-800 border-gray-700 mb-4 hover:border-gray-600 transition-all cursor-pointer"
      onClick={handleEventClick}
    >
      <div className="flex items-center p-4">
        <div className="relative w-48 h-32 flex-shrink-0">
          <Image
            src="https://picsum.photos/800/400"
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
          {isAdmin && event.status === "pending" && (
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDecline}>
                <X className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </div>
          )}
          {isAdmin && event.status === "approved" && (
            <div className="mt-4 right-0">
              <Button size="sm" variant="destructive" onClick={handleDecline}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
