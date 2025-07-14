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
  const [showCopyToast, setShowCopyToast] = useState(false);

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
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Toast Notification */}
      {showCopyToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-custom-blue text-white px-6 py-3 rounded shadow-lg font-medium text-sm animate-fade-in-out">
            Link copied to clipboard!
          </div>
        </div>
      )}
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-2 sm:px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-between">
              <div className="flex items-center space-x-2">
                <img src="/pentastudio.svg" alt="PentaStudio Logo" className="h-8 w-8" />
                <span className="text-2xl font-bold text-gray-900 font-primary">whisprmail</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
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

      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 mb-6 lg:mb-0 w-full">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 space-y-5 sm:space-y-6">
              {/* Public Link Section */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-primary">Your Public Link</h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <LinkIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Share this link to receive messages</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      value={currentUser.publicLink}
                      readOnly
                      className="flex-1 text-xs sm:text-sm bg-white border border-gray-300 rounded px-3 py-2"
                    />
                    <button
                      onClick={() => copyToClipboard(currentUser.publicLink)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                      title="Copy link"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-primary">Statistics</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Total Messages</span>
                    <span className="font-semibold">{messages.length}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Active Messages</span>
                    <span className="font-semibold">{activeMessages.length}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Archived</span>
                    <span className="font-semibold">{archivedMessages.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 w-full">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-primary">Messages</h2>
                    <p className="text-gray-600 mt-1 font-secondary text-sm sm:text-base">View and manage your anonymous messages</p>
                  </div>
                  {error && (
                    <div className="text-red-600 text-xs sm:text-sm">{error}</div>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="p-8 sm:p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-blue mx-auto mb-4"></div>
                  <p className="text-gray-600 text-sm sm:text-base">Loading messages...</p>
                </div>
              )}

              {/* Message List */}
              {!loading && (
                <div className="divide-y divide-gray-200">
                  {messages.map((message) => (
                    <div key={message.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 w-full">
                          <p className="text-gray-900 mb-2 text-sm sm:text-base break-words">{message.content}</p>
                          <div className="flex flex-wrap items-center space-x-2 text-xs sm:text-sm text-gray-500">
                            <span>{formatDate(new Date(message.created_at))}</span>
                            {message.status === 'archived' && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                Archived
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row flex-wrap items-center space-x-2 sm:space-x-2 ml-0 sm:ml-4 gap-y-2">
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
                <div className="p-8 sm:p-12 text-center">
                  <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Share your public link to start receiving anonymous messages
                  </p>
                  <button
                    onClick={() => copyToClipboard(currentUser.publicLink)}
                    className="bg-custom-blue text-white px-4 py-2 rounded-lg hover:bg-custom-blue transition-colors inline-flex items-center text-xs sm:text-sm"
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
      {/* Custom Footer (copied from homepage) */}
      <footer className="w-full border-t bg-white mt-auto" style={{fontFamily: 'var(--font-bricolage-grotesque), Arial, sans-serif'}}>
        <div className="container mx-auto px-2 sm:px-4 pt-6 pb-2">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            {/* Left: Brand */}
            <div className="flex items-center">
              <span className="text-lg font-bold select-none">
                <span className="text-black">WhisprMail</span>
              </span>
            </div>
            {/* Center: Credit */}
            <div className="text-sm text-gray-700 select-none">
              Developed by <a href="https://mddanish.me/" target="_blank" rel="noopener noreferrer" className="text-custom-blue underline hover:text-custom-blue">Md Danish Ansari</a>
            </div>
            {/* Right: Socials */}
            <div className="flex items-center space-x-4">
              <a href="https://github.com/mddanish004" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-black hover:text-[#FFB300]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z" />
                </svg>
              </a>
              <a href="https://x.com/DanishonX" target="_blank" rel="noopener noreferrer" aria-label="X">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50" className="w-5 h-5 text-black hover:text-[#FFB300]">
                  <path fill="currentColor" d="M 11 4 C 7.1456661 4 4 7.1456661 4 11 L 4 39 C 4 42.854334 7.1456661 46 11 46 L 39 46 C 42.854334 46 46 42.854334 46 39 L 46 11 C 46 7.1456661 42.854334 4 39 4 L 11 4 z M 11 6 L 39 6 C 41.773666 6 44 8.2263339 44 11 L 44 39 C 44 41.773666 41.773666 44 39 44 L 11 44 C 8.2263339 44 6 41.773666 6 39 L 6 11 C 6 8.2263339 8.2263339 6 11 6 z M 13.085938 13 L 22.308594 26.103516 L 13 37 L 15.5 37 L 23.4375 27.707031 L 29.976562 37 L 37.914062 37 L 27.789062 22.613281 L 36 13 L 33.5 13 L 26.660156 21.009766 L 21.023438 13 L 13.085938 13 z M 16.914062 15 L 19.978516 15 L 34.085938 35 L 31.021484 35 L 16.914062 15 z"></path>
                </svg>
              </a>
              <a href="https://linkedin.com/in/mddanish004" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50" className="w-5 h-5 text-black hover:text-[#FFB300]">
                  <path fill="currentColor" d="M 9 4 C 6.2504839 4 4 6.2504839 4 9 L 4 41 C 4 43.749516 6.2504839 46 9 46 L 41 46 C 43.749516 46 46 43.749516 46 41 L 46 9 C 46 6.2504839 43.749516 4 41 4 L 9 4 z M 9 6 L 41 6 C 42.668484 6 44 7.3315161 44 9 L 44 41 C 44 42.668484 42.668484 44 41 44 L 9 44 C 7.3315161 44 6 42.668484 6 41 L 6 9 C 6 7.3315161 7.3315161 6 9 6 z M 14 11.011719 C 12.904779 11.011719 11.919219 11.339079 11.189453 11.953125 C 10.459687 12.567171 10.011719 13.484511 10.011719 14.466797 C 10.011719 16.333977 11.631285 17.789609 13.691406 17.933594 A 0.98809878 0.98809878 0 0 0 13.695312 17.935547 A 0.98809878 0.98809878 0 0 0 14 17.988281 C 16.27301 17.988281 17.988281 16.396083 17.988281 14.466797 A 0.98809878 0.98809878 0 0 0 17.986328 14.414062 C 17.884577 12.513831 16.190443 11.011719 14 11.011719 z M 14 12.988281 C 15.392231 12.988281 15.94197 13.610038 16.001953 14.492188 C 15.989803 15.348434 15.460091 16.011719 14 16.011719 C 12.614594 16.011719 11.988281 15.302225 11.988281 14.466797 C 11.988281 14.049083 12.140703 13.734298 12.460938 13.464844 C 12.78117 13.19539 13.295221 12.988281 14 12.988281 z M 11 19 A 1.0001 1.0001 0 0 0 10 20 L 10 39 A 1.0001 1.0001 0 0 0 11 40 L 17 40 A 1.0001 1.0001 0 0 0 18 39 L 18 33.134766 L 18 20 A 1.0001 1.0001 0 0 0 17 19 L 11 19 z M 20 19 A 1.0001 1.0001 0 0 0 19 20 L 19 39 A 1.0001 1.0001 0 0 0 20 40 L 26 40 A 1.0001 1.0001 0 0 0 27 39 L 27 29 C 27 28.170333 27.226394 27.345035 27.625 26.804688 C 28.023606 26.264339 28.526466 25.940057 29.482422 25.957031 C 30.468166 25.973981 30.989999 26.311669 31.384766 26.841797 C 31.779532 27.371924 32 28.166667 32 29 L 32 39 A 1.0001 1.0001 0 0 0 33 40 L 39 40 A 1.0001 1.0001 0 0 0 40 39 L 40 28.261719 C 40 25.300181 39.122788 22.95433 37.619141 21.367188 C 36.115493 19.780044 34.024172 19 31.8125 19 C 29.710483 19 28.110853 19.704889 27 20.423828 L 27 20 A 1.0001 1.0001 0 0 0 26 19 L 20 19 z M 12 21 L 16 21 L 16 33.134766 L 16 38 L 12 38 L 12 21 z M 21 21 L 25 21 L 25 22.560547 A 1.0001 1.0001 0 0 0 26.798828 23.162109 C 26.798828 23.162109 28.369194 21 31.8125 21 C 33.565828 21 35.069366 21.582581 36.167969 22.742188 C 37.266572 23.901794 38 25.688257 38 28.261719 L 38 38 L 34 38 L 34 29 C 34 27.833333 33.720468 26.627107 32.990234 25.646484 C 32.260001 24.665862 31.031834 23.983076 29.517578 23.957031 C 27.995534 23.930001 26.747519 24.626988 26.015625 25.619141 C 25.283731 26.611293 25 27.829667 25 29 L 25 38 L 21 38 L 21 21 z"></path>
                </svg>
              </a>
            </div>
          </div>
          {/* Mobile Layout */}
          <div className="md:hidden space-y-4">
            {/* Top Row: Brand and Socials */}
            <div className="flex items-center justify-between">
              {/* Brand */}
              <div className="flex items-center">
                <span className="text-base font-bold select-none">
                  <span className="text-black">WhisprMail</span>
                </span>
              </div>
              {/* Socials */}
              <div className="flex items-center space-x-3">
                <a href="https://github.com/mddanish004" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-black hover:text-[#FFB300]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z" />
                  </svg>
                </a>
                <a href="https://x.com/DanishonX" target="_blank" rel="noopener noreferrer" aria-label="X">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50" className="w-4 h-4 text-black hover:text-[#FFB300]">
                    <path fill="currentColor" d="M 11 4 C 7.1456661 4 4 7.1456661 4 11 L 4 39 C 4 42.854334 7.1456661 46 11 46 L 39 46 C 42.854334 46 46 42.854334 46 39 L 46 11 C 46 7.1456661 42.854334 4 39 4 L 11 4 z M 11 6 L 39 6 C 41.773666 6 44 8.2263339 44 11 L 44 39 C 44 41.773666 41.773666 44 39 44 L 11 44 C 8.2263339 44 6 41.773666 6 39 L 6 11 C 6 8.2263339 8.2263339 6 11 6 z M 13.085938 13 L 22.308594 26.103516 L 13 37 L 15.5 37 L 23.4375 27.707031 L 29.976562 37 L 37.914062 37 L 27.789062 22.613281 L 36 13 L 33.5 13 L 26.660156 21.009766 L 21.023438 13 L 13.085938 13 z M 16.914062 15 L 19.978516 15 L 34.085938 35 L 31.021484 35 L 16.914062 15 z"></path>
                  </svg>
                </a>
                <a href="https://linkedin.com/in/mddanish004" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50" className="w-4 h-4 text-black hover:text-[#FFB300]">
                    <path fill="currentColor" d="M 9 4 C 6.2504839 4 4 6.2504839 4 9 L 4 41 C 4 43.749516 6.2504839 46 9 46 L 41 46 C 43.749516 46 46 43.749516 46 41 L 46 9 C 46 6.2504839 43.749516 4 41 4 L 9 4 z M 9 6 L 41 6 C 42.668484 6 44 7.3315161 44 9 L 44 41 C 44 42.668484 42.668484 44 41 44 L 9 44 C 7.3315161 44 6 42.668484 6 41 L 6 9 C 6 7.3315161 7.3315161 6 9 6 z M 14 11.011719 C 12.904779 11.011719 11.919219 11.339079 11.189453 11.953125 C 10.459687 12.567171 10.011719 13.484511 10.011719 14.466797 C 10.011719 16.333977 11.631285 17.789609 13.691406 17.933594 A 0.98809878 0.98809878 0 0 0 13.695312 17.935547 A 0.98809878 0.98809878 0 0 0 14 17.988281 C 16.27301 17.988281 17.988281 16.396083 17.988281 14.466797 A 0.98809878 0.98809878 0 0 0 17.986328 14.414062 C 17.884577 12.513831 16.190443 11.011719 14 11.011719 z M 14 12.988281 C 15.392231 12.988281 15.94197 13.610038 16.001953 14.492188 C 15.989803 15.348434 15.460091 16.011719 14 16.011719 C 12.614594 16.011719 11.988281 15.302225 11.988281 14.466797 C 11.988281 14.049083 12.140703 13.734298 12.460938 13.464844 C 12.78117 13.19539 13.295221 12.988281 14 12.988281 z M 11 19 A 1.0001 1.0001 0 0 0 10 20 L 10 39 A 1.0001 1.0001 0 0 0 11 40 L 17 40 A 1.0001 1.0001 0 0 0 18 39 L 18 33.134766 L 18 20 A 1.0001 1.0001 0 0 0 17 19 L 11 19 z M 20 19 A 1.0001 1.0001 0 0 0 19 20 L 19 39 A 1.0001 1.0001 0 0 0 20 40 L 26 40 A 1.0001 1.0001 0 0 0 27 39 L 27 29 C 27 28.170333 27.226394 27.345035 27.625 26.804688 C 28.023606 26.264339 28.526466 25.940057 29.482422 25.957031 C 30.468166 25.973981 30.989999 26.311669 31.384766 26.841797 C 31.779532 27.371924 32 28.166667 32 29 L 32 39 A 1.0001 1.0001 0 0 0 33 40 L 39 40 A 1.0001 1.0001 0 0 0 40 39 L 40 28.261719 C 40 25.300181 39.122788 22.95433 37.619141 21.367188 C 36.115493 19.780044 34.024172 19 31.8125 19 C 29.710483 19 28.110853 19.704889 27 20.423828 L 27 20 A 1.0001 1.0001 0 0 0 26 19 L 20 19 z M 12 21 L 16 21 L 16 33.134766 L 16 38 L 12 38 L 12 21 z M 21 21 L 25 21 L 25 22.560547 A 1.0001 1.0001 0 0 0 26.798828 23.162109 C 26.798828 23.162109 28.369194 21 31.8125 21 C 33.565828 21 35.069366 21.582581 36.167969 22.742188 C 37.266572 23.901794 38 25.688257 38 28.261719 L 38 38 L 34 38 L 34 29 C 34 27.833333 33.720468 26.627107 32.990234 25.646484 C 32.260001 24.665862 31.031834 23.983076 29.517578 23.957031 C 27.995534 23.930001 26.747519 24.626988 26.015625 25.619141 C 25.283731 26.611293 25 27.829667 25 29 L 25 38 L 21 38 L 21 21 z"></path>
                  </svg>
                </a>
              </div>
            </div>
            {/* Bottom Row: Credit */}
            <div className="text-center">
              <div className="text-xs text-gray-700 select-none">
                Developed by <a href="https://mddanish.me/" target="_blank" rel="noopener noreferrer" className="text-custom-blue underline hover:text-custom-blue">Md Danish Ansari</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 