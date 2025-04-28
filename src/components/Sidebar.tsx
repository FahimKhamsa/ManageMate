/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import {
  Calendar,
  Users,
  BarChart,
  MessageSquare,
  Home,
  TicketCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  Contact,
} from "lucide-react";
// import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Events", href: "/dashboard/events", icon: Calendar },
  { title: "Purchased", href: "/dashboard/purchased", icon: TicketCheck },
  { title: "Attendees", href: "/dashboard/attendees", icon: Users },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart },
  { title: "Messages", href: "/dashboard/messages", icon: MessageSquare },
];

const adminSidebarItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: Home },
  { title: "Events", href: "/admin/events", icon: Calendar },
  { title: "Upcoming", href: "/admin/events/upcoming", icon: Download },
  { title: "Organizers", href: "/admin/organizers", icon: Contact },
];

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  pathname,
  session,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  pathname: string;
  session: any;
}) {
  const [displaySidebarItems, setDisplaySidebarItems] = useState(sidebarItems);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      setDisplaySidebarItems(adminSidebarItems);
    }
  }, [session]);

  return (
    <div
      className={`fixed top-12 left-0 h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col`}
      style={{ width: isSidebarOpen ? "10rem" : "4rem" }}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        className="absolute -right-5 top-5 bg-gray-700 hover:bg-gray-600 p-1 rounded-full text-white shadow-md"
      >
        {isSidebarOpen ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>

      <nav className="mt-10 px-2 space-y-2">
        {displaySidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md relative group 
                  ${isSidebarOpen ? "justify-start" : "justify-center"} 
                  ${isActive ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
            >
              <item.icon className="h-5 w-5" />

              {/* Smooth Fade-in Text */}
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    className="ml-2"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip when Sidebar is Collapsed */}
              {!isSidebarOpen && (
                <span className="absolute left-16 bg-gray-700 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
