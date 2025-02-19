import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">ManageMate</h1>
        <div className="space-x-4">
          <Link href="/sign-in">
            <Button variant="outline" className="border-white text-gray-800 hover:bg-white hover:text-gray-600 transition-colors">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-colors">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">Streamline Your Event Management</h2>
          <p className="text-xl text-gray-300 mb-8">
            ManageMate helps you create, manage, and track events effortlessly. From small meetups to large conferences,
            we've got you covered.
          </p>
          <div className="space-x-4">
            <Link href="/sign-up">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 transition-colors">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="border-white text-gray-800 hover:bg-white hover:text-gray-600 text-lg px-8 py-3 transition-colors">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            title="Easy Event Creation"
            description="Create and customize events in minutes with our intuitive interface."
          />
          <FeatureCard
            title="Smart Management"
            description="Track RSVPs, send updates, and manage attendees effortlessly."
          />
          <FeatureCard
            title="Detailed Analytics"
            description="Get insights into your events with comprehensive analytics and reports."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transform hover:-translate-y-1 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
