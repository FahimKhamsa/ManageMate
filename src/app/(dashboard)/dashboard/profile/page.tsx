"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Profile</h1>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={session?.user?.image || "https://github.com/shadcn.png"}
              />
              <AvatarFallback>
                <UserIcon className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {session?.user?.name}
              </h2>
              <p className="text-gray-400">{session?.user?.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Name
              </Label>
              <Input
                id="name"
                defaultValue={session?.user?.name || ""}
                disabled={!isEditing}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue={session?.user?.email || ""}
                disabled={!isEditing}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
            {isEditing && (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Changes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
