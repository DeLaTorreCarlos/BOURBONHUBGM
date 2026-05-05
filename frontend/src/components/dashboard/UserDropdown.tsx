"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-3" ref={dropdownRef}>
      <span className="text-sm cursor-pointer tracking-wide" onClick={() => setIsOpen(!isOpen)}>Mr Wizard</span>
      <div 
        className="w-6 h-6 bg-white rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-5 h-5 text-black mt-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>

      {isOpen && (
        <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 shadow-lg text-black text-sm z-50">
          <div className="flex flex-col py-2">
            <Link href="/dashboard/userdetails?tab=profile" className="px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setIsOpen(false)}>
              Profile
            </Link>
            <Link href="/dashboard/userdetails?tab=settings" className="px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setIsOpen(false)}>
              Settings
            </Link>
            <div className="h-px bg-gray-200 my-1"></div>
            <Link href="/" className="px-4 py-2 hover:bg-gray-100 transition-colors text-red-600 font-medium" onClick={() => setIsOpen(false)}>
              Logout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}