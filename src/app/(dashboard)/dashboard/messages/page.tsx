"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(1);
  const [messages] = useState([
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "https://github.com/shadcn.png",
        initials: "JD",
      },
      messages: [
        {
          id: 1,
          content: "Hi, I have a question about the Tech Conference.",
          timestamp: "10:30 AM",
          sender: "user",
        },
        {
          id: 2,
          content:
            "Hello! I'd be happy to help. What would you like to know about the Tech Conference?",
          timestamp: "10:32 AM",
          sender: "admin",
        },
      ],
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        avatar: "https://github.com/shadcn.png",
        initials: "JS",
      },
      messages: [
        {
          id: 1,
          content: "When does the Digital Marketing Summit start?",
          timestamp: "9:15 AM",
          sender: "user",
        },
      ],
    },
  ]);

  const filteredChats = messages.filter((chat) =>
    chat.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedChatData = messages.find((chat) => chat.id === selectedChat);

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-4">
      {/* Chat List */}
      <Card className="w-1/3 bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Messages</CardTitle>
          <CardDescription className="text-gray-400">
            Your conversations
          </CardDescription>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedChat === chat.id
                    ? "bg-gray-700"
                    : "hover:bg-gray-700/50"
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={chat.user.avatar} />
                    <AvatarFallback>{chat.user.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">{chat.user.name}</p>
                    <p className="text-sm text-gray-400">
                      {chat.messages[chat.messages.length - 1].content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="flex-1 bg-gray-800 border-gray-700">
        {selectedChatData ? (
          <>
            <CardHeader className="border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={selectedChatData.user.avatar} />
                  <AvatarFallback>
                    {selectedChatData.user.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-white">
                    {selectedChatData.user.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Online
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100%-12rem)]">
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {selectedChatData.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "admin"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === "admin"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button>Send</Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <p className="text-gray-400">Select a conversation to start</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
