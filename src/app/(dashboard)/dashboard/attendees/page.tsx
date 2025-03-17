"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search } from "lucide-react";

export default function AttendeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [attendees] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      event: "Tech Conference 2025",
      registrationDate: "2024-02-15",
      status: "Confirmed",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      event: "Digital Marketing Summit",
      registrationDate: "2024-02-16",
      status: "Pending",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      event: "Startup Networking Event",
      registrationDate: "2024-02-17",
      status: "Confirmed",
    },
  ]);

  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.event.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Attendees</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search attendees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Button>Export CSV</Button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Event</TableHead>
              <TableHead className="text-gray-300">Registration Date</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendees.map((attendee) => (
              <TableRow key={attendee.id} className="border-gray-700">
                <TableCell className="font-medium text-white">
                  {attendee.name}
                </TableCell>
                <TableCell className="text-gray-300">
                  {attendee.email}
                </TableCell>
                <TableCell className="text-gray-300">
                  {attendee.event}
                </TableCell>
                <TableCell className="text-gray-300">
                  {attendee.registrationDate}
                </TableCell>
                <TableCell className="text-gray-300">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      attendee.status === "Confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {attendee.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-gray-800 border-gray-700"
                    >
                      <DropdownMenuItem className="text-gray-300 focus:bg-gray-700 focus:text-white cursor-pointer">
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 focus:bg-gray-700 focus:text-white cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 focus:bg-gray-700 focus:text-white cursor-pointer">
                        Send Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
