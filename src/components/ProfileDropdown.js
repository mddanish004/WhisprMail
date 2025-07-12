"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../lib/auth-context";
import { Settings, LogOut, ChevronDown } from "lucide-react";

export default function ProfileDropdown() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors font-medium"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-custom-blue transition-colors"
      >
        <div className="w-8 h-8 bg-custom-blue rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.user_metadata?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-medium">
          {user.user_metadata?.username || user.email}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <Link
            href="/settings"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </Link>
          <button
            onClick={() => {
              handleSignOut();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
} 