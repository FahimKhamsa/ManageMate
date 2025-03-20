"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Phone, Video, MoreVertical } from "lucide-react";

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(1);
  const [messages] = useState([
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        initials: "JD",
        status: "online",
        lastSeen: "Active now",
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
        {
          id: 3,
          content: "I'm wondering about the schedule for the keynote speakers.",
          timestamp: "10:33 AM",
          sender: "user",
        },
        {
          id: 4,
          content:
            "The keynote sessions are scheduled for Day 1 (9 AM - 11 AM) featuring industry leaders in AI and Cloud Computing.",
          timestamp: "10:35 AM",
          sender: "admin",
        },
      ],
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        initials: "JS",
        status: "offline",
        lastSeen: "Last seen 2h ago",
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
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800">
        <div className="p-3">
          <h1 className="text-base font-semibold text-white mb-3">Messages</h1>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-sm bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                  selectedChat === chat.id
                    ? "bg-gray-800 ring-1 ring-gray-700"
                    : "hover:bg-gray-800/50"
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={chat.user.avatar} />
                      <AvatarFallback>{chat.user.initials}</AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-gray-900 ${
                        chat.user.status === "online"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white truncate">
                        {chat.user.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {chat.messages[chat.messages.length - 1].timestamp}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {chat.messages[chat.messages.length - 1].content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={selectedChatData.user.avatar} />
                    <AvatarFallback>
                      {selectedChatData.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-gray-900 ${
                      selectedChatData.user.status === "online"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-white">
                    {selectedChatData.user.name}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {selectedChatData.user.lastSeen}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                >
                  <Video className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedChatData.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-xl px-3 py-1.5 ${
                      message.sender === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-[10px] mt-1 opacity-70">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-3 border-t border-gray-800">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Type your message..."
                  className="h-8 text-sm bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500"
                />
                <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400">
              Select a conversation to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
