"use client";

import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function ProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <User className="h-5 w-5" />
        <span>{user.username}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          
          <div className="py-1">
            <Link 
              href="/profile"
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            <Link 
              href="/settings"
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>
          
          <div className="border-t border-gray-100 pt-1">
            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 