import { MessageCircle, Send, CheckCircle } from "lucide-react";

export default function PublicMessagePage({ params }) {
  const { username } = params;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">whisprmail</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Send a message to <span className="text-blue-600">@{username}</span>
          </h1>
          <p className="text-gray-600">Your message will be completely anonymous</p>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Write your anonymous message here..."
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Maximum 500 characters
                </p>
                <span className="text-xs text-gray-500">
                  <span id="char-count">0</span>/500
                </span>
              </div>
            </div>

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
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
            >
              <Send className="h-5 w-5 mr-2" />
              Send Anonymous Message
            </button>
          </form>

          {/* Success Message (hidden by default) */}
          <div className="hidden mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Message sent successfully!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Your anonymous message has been delivered to @{username}
            </p>
          </div>

          {/* Conversion Modal Trigger */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-blue-900 font-medium mb-2">Want to receive anonymous messages too?</h3>
            <p className="text-blue-800 text-sm mb-3">
              Create your own account and start receiving honest feedback from others.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Create Your Account
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Powered by{" "}
            <span className="font-medium text-gray-700">whisprmail</span>
          </p>
        </div>
      </div>
    </div>
  );
} 