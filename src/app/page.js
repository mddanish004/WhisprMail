import Link from "next/link";
import { MessageCircle, Shield, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Hero } from "@/components/ui/animated-hero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">whisprmail</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Animated Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose whisprmail?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">100% Anonymous</h3>
            <p className="text-gray-600">
              Senders remain completely anonymous. No registration required to send messages.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Easy to Use</h3>
            <p className="text-gray-600">
              Get your unique link instantly. Share it anywhere and start receiving messages.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Viral Growth</h3>
            <p className="text-gray-600">
              Built-in conversion funnel encourages message senders to create their own accounts.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Create Account</h3>
            <p className="text-gray-600">
              Sign up and get your unique public link instantly
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Share Your Link</h3>
            <p className="text-gray-600">
              Share your link on social media, bio, or anywhere you want feedback
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Receive Messages</h3>
            <p className="text-gray-600">
              View anonymous messages in your private dashboard
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Receiving Anonymous Messages?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of users who are already receiving honest feedback
          </p>
          <Link
            href="/auth/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MessageCircle className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">whisprmail</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-blue-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 whisprmail. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
