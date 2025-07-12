import { Demo } from "@/components/ui/demo"

export default function NavbarDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Demo />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Navbar Component Demo
        </h1>
        <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto">
          This is a demo page showcasing the animated navbar component. 
          The navbar above demonstrates responsive design with mobile menu, 
          smooth animations, and modern UI patterns.
        </p>
      </div>
    </div>
  )
} 