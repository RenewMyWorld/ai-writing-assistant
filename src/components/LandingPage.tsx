import React from 'react';
import { Sparkles, BookOpen, Brain, Cloud } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute h-[500px] w-[500px] rounded-full bg-white blur-3xl -top-40 -left-40" />
          <div className="absolute h-[400px] w-[400px] rounded-full bg-white blur-3xl top-1/2 right-0" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center">
        {/* Hero section */}
        <div className="text-center space-y-8 animate-fade-in">
          <BookOpen className="w-16 h-16 text-white/90 mx-auto mb-6 animate-float" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Craft Your Story with
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-100 mt-2">
              AI-Powered Inspiration
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into captivating narratives with our intelligent writing assistant. 
            Let AI guide your creativity while maintaining your unique voice.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={onStart}
              className="group relative px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              <span className="flex items-center gap-2">
                Start Writing Now
                <Sparkles className="w-5 h-5 animate-pulse" />
              </span>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 text-white/90">
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg transform hover:scale-105 transition-transform duration-300">
              <Brain className="w-8 h-8 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">AI-Powered Assistance</h3>
              <p className="text-sm text-white/80">Get intelligent suggestions and prompts to overcome writer's block</p>
            </div>
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg transform hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-8 h-8 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Intuitive Interface</h3>
              <p className="text-sm text-white/80">Write and organize your stories with our beautiful book-like editor</p>
            </div>
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg transform hover:scale-105 transition-transform duration-300">
              <Cloud className="w-8 h-8 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Auto-Save & Sync</h3>
              <p className="text-sm text-white/80">Never lose your progress with automatic saving and cloud sync</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}