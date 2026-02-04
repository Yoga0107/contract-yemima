'use client';

import { Heart, Sparkles, FileHeart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Heart className="w-24 h-24 text-rose-500 fill-rose-500 animate-pulse" />
              <Sparkles className="w-8 h-8 text-rose-400 absolute -top-2 -right-2" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-rose-900 leading-tight">
            Make It
            <span className="block text-rose-600 mt-2">Official</span>
          </h1>

          <p className="text-xl md:text-2xl text-rose-700 max-w-2xl mx-auto leading-relaxed">
            A romantic way to officially become boyfriend and girlfriend.
            Create a meaningful contract together and celebrate your commitment.
          </p>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border-2 border-rose-200 shadow-xl">
            <h2 className="text-2xl font-semibold text-rose-900 mb-6">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-3">
                  <FileHeart className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="font-semibold text-rose-900">Create Contract</h3>
                <p className="text-sm text-rose-700">
                  Write your relationship promises and agreements together
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-3">
                  <Heart className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="font-semibold text-rose-900">Both Sign</h3>
                <p className="text-sm text-rose-700">
                  Each person adds their name and a special message
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="font-semibold text-rose-900">Celebrate</h3>
                <p className="text-sm text-rose-700">
                  Keep your beautiful contract as a special memory
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/create">
              <Button
                size="lg"
                className="bg-rose-600 hover:bg-rose-700 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Create Our Contract
                <Heart className="ml-2 w-5 h-5 fill-white" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-rose-600 mt-8">
            A special moment deserves something special
          </p>
        </div>
      </div>
    </div>
  );
}
