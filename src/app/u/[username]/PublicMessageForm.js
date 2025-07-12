"use client";

import { MessageCircle, Send, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function PublicMessageForm({ username }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    setCharCount(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    if (message.length > 500) {
      setError("Message cannot exceed 500 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          content: message.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setShowSuccess(true);
      setMessage("");
      setCharCount(0);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={handleMessageChange}
            rows={6}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Write your anonymous message here..."
            required
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              Maximum 500 characters
            </p>
            <span className={`text-xs ${charCount > 450 ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount}/500
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* reCAPTCHA placeholder */}
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600 mb-2">
            reCAPTCHA verification
          </div>
          <div className="bg-white border border-gray-300 rounded h-10 flex items-center justify-center">
            <span className="text-gray-400 text-sm">reCAPTCHA will be integrated here</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-custom-blue text-white py-3 px-4 rounded-lg hover:bg-custom-blue transition-colors font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Send Anonymous Message
            </>
          )}
        </button>
      </form>

      {/* Success Message */}
      {showSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Message sent successfully!</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Your anonymous message has been delivered to @{username}
          </p>
        </div>
      )}

      {/* Conversion Modal Trigger */}
      <div className="mt-6 p-4 bg-custom-blue/5 border border-custom-blue/20 rounded-lg">
        <h3 className="text-custom-blue font-medium mb-2 font-primary">Want to receive anonymous messages too?</h3>
        <p className="text-custom-blue text-sm mb-3 font-secondary">
          Create your own account and start receiving honest feedback from others.
        </p>
        <button className="w-full bg-custom-blue text-white py-2 px-4 rounded-lg hover:bg-custom-blue transition-colors text-sm font-medium">
          Create Your Account
        </button>
      </div>
    </>
  );
} 