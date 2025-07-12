"use client";

import { MessageCircle, Copy, Settings, LogOut, Archive, Trash2, User, Link as LinkIcon, RotateCcw } from "lucide-react";
import { formatDate, truncateText } from "@/lib/utils";
import ProfileDropdown from "@/components/ProfileDropdown";
import Link from "next/link";
import { useAuth } from "../../lib/auth-context";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingMessage, setUpdatingMessage] = useState(null);

  // Get user data from auth context
  const currentUser = user ? {
    username: user.username || user.user_metadata?.username || user.email?.split("@")[0] || "user",
    email: user.email,
    publicLink: `${typeof window !== 'undefined' ? window.location.origin : 'https://whisprmail.mddanish.me'}/u/${user.username || user.user_metadata?.username || user.email?.split("@")[0] || "user"}`
  } : null;

  // Debug logging
  console.log('Dashboard - authLoading:', authLoading);
  console.log('Dashboard - user:', user);
  console.log('Dashboard - currentUser:', currentUser);

  useEffect(() => {
    if (user && !authLoading) {
      fetchMessages();
    }
  }, [user, authLoading]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // No need to get token from localStorage, cookies are sent automatically
      const response = await fetch('/api/messages');

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      setUpdatingMessage(messageId);
      // No need to get token from localStorage, cookies are sent automatically
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update message');
      }

      // Update the message in the local state
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: newStatus }
            : msg
        )
      );
    } catch (error) {
      console.error('Error updating message:', error);
      setError('Failed to update message');
    } finally {
      setUpdatingMessage(null);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    try {
      setUpdatingMessage(messageId);
      // No need to get token from localStorage, cookies are sent automatically
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      // Remove the message from the local state
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== messageId)
      );
    } catch (error) {
      console.error('Error deleting message:', error);
      setError('Failed to delete message');
    } finally {
      setUpdatingMessage(null);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const activeMessages = messages.filter(m => m.status === 'active');
  const archivedMessages = messages.filter(m => m.status === 'archived');

  // Show loading state if auth is still loading or user is not available
  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-blue mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authLoading ? 'Loading authentication...' : 'Loading dashboard...'}
          </p>
        </div>
      </div>
    );
  }

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
                    <span className="font-semibold">{activeMessages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Archived</span>
                    <span className="font-semibold">{archivedMessages.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-primary">Messages</h2>
                    <p className="text-gray-600 mt-1 font-secondary">View and manage your anonymous messages</p>
                  </div>
                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-blue mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading messages...</p>
                </div>
              )}

              {/* Message List */}
              {!loading && (
                <div className="divide-y divide-gray-200">
                  {messages.map((message) => (
                    <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-900 mb-2">{message.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{formatDate(new Date(message.created_at))}</span>
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
                              <button 
                                onClick={() => updateMessageStatus(message.id, 'archived')}
                                disabled={updatingMessage === message.id}
                                className="p-2 text-gray-500 hover:text-yellow-600 transition-colors disabled:opacity-50" 
                                title="Archive"
                              >
                                {updatingMessage === message.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                                ) : (
                                  <Archive className="h-4 w-4" />
                                )}
                              </button>
                              <button 
                                onClick={() => deleteMessage(message.id)}
                                disabled={updatingMessage === message.id}
                                className="p-2 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50" 
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {message.status === 'archived' && (
                            <button 
                              onClick={() => updateMessageStatus(message.id, 'active')}
                              disabled={updatingMessage === message.id}
                              className="p-2 text-gray-500 hover:text-custom-blue transition-colors disabled:opacity-50" 
                              title="Restore"
                            >
                              {updatingMessage === message.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-custom-blue"></div>
                              ) : (
                                <RotateCcw className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && messages.length === 0 && (
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