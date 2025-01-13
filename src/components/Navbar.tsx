import React, { useState } from 'react';
import { BookOpen, Library, User, Settings, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPage: 'editor' | 'saved' | 'profile' | 'settings';
  onNavigate: (page: 'editor' | 'saved' | 'profile' | 'settings') => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'editor', label: 'Editor', icon: BookOpen },
    { id: 'saved', label: 'Saved Stories', icon: Library },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/80 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Cerebo</span>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                    flex items-center space-x-2
                    ${currentPage === id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/80 backdrop-blur-lg">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  onNavigate(id);
                  setIsMenuOpen(false);
                }}
                className={`
                  w-full flex items-center px-3 py-2 rounded-md text-base font-medium
                  ${currentPage === id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}