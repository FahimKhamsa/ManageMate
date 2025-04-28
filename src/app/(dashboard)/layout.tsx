"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
// import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/sign-in");
    },
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar (Fixed) */}
      <Header session={session} />

      {/* Sidebar (Fixed) */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        pathname={pathname}
        session={session}
      />

      {/* Main Content (Scrollable) */}
      <div
        className="ml-[10rem] pt-16 p-6 overflow-auto"
        style={{ height: "calc(100vh - 1rem)" }}
      >
        {children}
      </div>
    </div>
  );
}
