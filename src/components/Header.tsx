"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

export default function Header({ session }: { session: Session | null }) {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-800 border-b border-gray-700 h-12 flex items-center px-4">
      <div className="flex justify-between w-full max-w-[2000px] mx-auto">
        <Link href="/dashboard" className="text-xl font-bold text-white">
          ManageMate
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session?.user?.image || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>
                  {session?.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-gray-800 border-gray-700"
            align="end"
          >
            <DropdownMenuLabel className="text-gray-300">
              {session?.user?.name || "User"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem
              className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
              onClick={() => router.push("/dashboard/profile")}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem
              className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
