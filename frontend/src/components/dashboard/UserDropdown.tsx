"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>('Mr Wizard');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check localStorage for superadmin role enforcement
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('userName');
      setUserRole(role);
      if (name) setUserName(name);
    }
  }, []);

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
      <span className="text-sm cursor-pointer tracking-wide" onClick={() => setIsOpen(!isOpen)}>{userName}</span>
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
            
            {(userRole === 'superadmin' || userRole === 'admin') && (
              <>
                <div className="h-px bg-gray-200 my-1"></div>
                <Link href="/dashboard/admin?tab=users" className="px-4 py-2 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100 transition-colors font-bold" onClick={() => setIsOpen(false)}>
                  {userRole === 'superadmin' ? 'MasterOptions' : 'Administration'}
                </Link>
              </>
            )}

            <div className="h-px bg-gray-200 my-1"></div>
            <Link href="/" className="px-4 py-2 hover:bg-gray-100 transition-colors text-red-600 font-medium" onClick={() => {
              setIsOpen(false);
              localStorage.removeItem('userRole'); // Clear session
              localStorage.removeItem('userName');
              localStorage.removeItem('token');
            }}>
              Logout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}