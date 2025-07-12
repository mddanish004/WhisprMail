"use client";

import { MessageCircle, Copy, Settings, LogOut, Archive, Trash2, User, Link as LinkIcon } from "lucide-react";
import { formatDate, truncateText } from "@/lib/utils";
import ProfileDropdown from "@/components/ProfileDropdown";
import Link from "next/link";
import { useAuth } from "../../lib/auth-context";

// Mock data for MVP
const mockUser = {
  username: "johndoe",
  email: "john@example.com",
  publicLink: "https://whisprmail.mddanish.me/u/johndoe"
};

const mockMessages = [
  {
    id: 1,
    content: "Hey! I really love your content. Keep up the great work!",
    createdAt: new Date("2025-01-15T10:30:00"),
    status: "active"
  },
  {
    id: 2,
    content: "Your recent post about anonymous messaging was really insightful. I've been thinking about privacy a lot lately.",
    createdAt: new Date("2025-01-14T15:45:00"),
    status: "active"
  },
  {
    id: 3,
    content: "Just wanted to say thanks for sharing your thoughts on this platform. It's really helpful!",
    createdAt: new Date("2025-01-13T09:20:00"),
    status: "archived"
  }
];

export default function DashboardPage() {
  const { user } = useAuth();
  // In a real app, fetch messages for the user here
  const currentUser = user
    ? {
        username: user.user_metadata?.username || user.email?.split("@")[0] || "user",
        email: user.email,
        publicLink: `${typeof window !== 'undefined' ? window.location.origin : 'https://whisprmail.mddanish.me'}/u/${user.user_metadata?.username || user.email?.split("@")[0] || "user"}`
      }
    : mockUser;
  const messages = mockMessages; // Replace with real messages if available

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-custom-blue" />
              <span className="text-2xl font-bold text-gray-900 font-primary">whisprmail</span>
            </div>
            <div className="flex items-center space-x-4">
              <ProfileDropdown user={currentUser} />
              <Link 
                href="/settings"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* Public Link Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-primary">Your Public Link</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <LinkIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Share this link to receive messages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={currentUser.publicLink}
                      readOnly
                      className="flex-1 text-sm bg-white border border-gray-300 rounded px-3 py-2"
                    />
                    <button
                      onClick={() => copyToClipboard(currentUser.publicLink)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Copy link"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-primary">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Messages</span>
                    <span className="font-semibold">{messages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Messages</span>
                    <span className="font-semibold">{messages.filter(m => m.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Archived</span>
                    <span className="font-semibold">{messages.filter(m => m.status === 'archived').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 font-primary">Messages</h2>
                <p className="text-gray-600 mt-1 font-secondary">View and manage your anonymous messages</p>
              </div>

              {/* Message List */}
              <div className="divide-y divide-gray-200">
                {messages.map((message) => (
                  <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-900 mb-2">{message.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatDate(message.createdAt)}</span>
                          {message.status === 'archived' && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                              Archived
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {message.status === 'active' && (
                          <>
                            <button className="p-2 text-gray-500 hover:text-yellow-600 transition-colors" title="Archive">
                              <Archive className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-red-600 transition-colors" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {message.status === 'archived' && (
                          <button className="p-2 text-gray-500 hover:text-custom-blue transition-colors" title="Restore">
                            <Archive className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {messages.length === 0 && (
                <div className="p-12 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-600 mb-4">
                    Share your public link to start receiving anonymous messages
                  </p>
                  <button
                    onClick={() => copyToClipboard(currentUser.publicLink)}
                    className="bg-custom-blue text-white px-4 py-2 rounded-lg hover:bg-custom-blue transition-colors inline-flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Your Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 