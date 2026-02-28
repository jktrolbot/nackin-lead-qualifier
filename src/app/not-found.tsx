import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/25">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-lg font-semibold mb-2">Page not found</p>
        <p className="text-muted-foreground text-sm mb-8">
          This page doesn&apos;t exist. Maybe the lead got away? 🏃
        </p>
        <Link href="/">
          <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            <Home className="w-4 h-4" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
