'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Home,
  History,
  Settings,
  User,
  LogOut,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_ITEMS = [
  { name: 'Momentum', icon: Home, href: '/' },
  { name: 'History', icon: History, href: '/history' },
];

export function Sidebar() {
  const path = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-black border-r border-white/10 z-50 flex flex-col justify-between transition-all duration-300 w-20 hover:w-64 group isolate"
    >
      <div className="flex flex-col flex-1 px-3">
        {/* Branding */}
        <div className="h-20 flex items-center justify-center group-hover:justify-start group-hover:px-4 transition-all overflow-hidden relative">
          <div className="w-10 h-10 shrink-0 relative">
            <Image
              src="/logo.png"
              alt="Life Chart"
              fill
              className="object-contain invert" // Invert if black logo on black bg, assume white or use specific class
              sizes="40px"
            />
          </div>
          <span className="ml-4 font-serif text-xl font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Life Chart
          </span>
        </div>

        {/* Main Nav */}
        <nav className="flex flex-col gap-2 mt-8">
          <button className="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 text-gray-400 hover:bg-white/10 hover:text-white group/btn mb-4">
            <div className="w-6 h-6 shrink-0 flex items-center justify-center border border-dashed border-gray-500 rounded-full text-lg font-bold">+</div>
            <span className="whitespace-nowrap font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              New Chart
            </span>
          </button>

          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center p-3 rounded-xl transition-all duration-300 group/item overflow-hidden ${path === item.href ? 'bg-[#444444] text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
            >
              <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                <item.icon className="h-5 w-5" />
              </div>
              <span className={`ml-4 font-mono text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${path === item.href ? 'font-bold' : ''}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer / User */}
      <div className="flex flex-col w-full px-3 gap-2 pb-4 relative">
        {/* User Menu Popover */}
        {showUserMenu && (
          <div className="absolute bottom-full left-3 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden mb-2 z-50">
            <div className="p-2 space-y-1">
              <button className="flex items-center gap-3 w-full p-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors text-left">
                <User className="w-4 h-4" /> Account
              </button>
              <button className="flex items-center gap-3 w-full p-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors text-left">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button className="flex items-center gap-3 w-full p-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors text-left">
                <Globe className="w-4 h-4" /> Language
              </button>
              <div className="h-[1px] bg-white/10 my-1" />
              <button className="flex items-center gap-3 w-full p-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors text-left">
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          </div>
        )}

        <div className="w-full h-[1px] bg-white/10 my-2" />

        {/* User Avatar */}
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors group/user text-left w-full outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 shrink-0 border border-white/20" />
          <div className="flex flex-col overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto">
            <span className="text-sm font-sans font-bold text-white whitespace-nowrap">Hao Wu</span>
            <span className="text-xs text-gray-400 font-mono whitespace-nowrap">Free Plan</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
