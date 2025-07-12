import { MessageCircle, Send, CheckCircle } from "lucide-react";
import PublicMessageForm from "./PublicMessageForm";

export default async function PublicMessagePage({ params }) {
  const { username } = await params;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MessageCircle className="h-8 w-8 text-custom-blue" />
            <span className="text-2xl font-bold text-gray-900 font-primary">whisprmail</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-primary">
            Send a message to <span className="text-custom-blue">@{username}</span>
          </h1>
          <p className="text-gray-600 font-secondary">Your message will be completely anonymous</p>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <PublicMessageForm username={username} />
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