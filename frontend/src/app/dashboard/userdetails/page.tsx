"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserDropdown from '@/components/dashboard/UserDropdown';

export default function UserDetailsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  // Set initial tab based on URL search query if it exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tab = new URLSearchParams(window.location.search).get('tab');
      // Wrap in setTimeout to avoid React's cascading render warning on mount
      setTimeout(() => {
        if (tab === 'settings') setActiveTab('settings');
        else if (tab === 'profile') setActiveTab('profile');
      }, 0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col p-8 text-white font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
          <span className="text-3xl font-serif tracking-widest">BOURBON</span>
          <span className="text-3xl font-bold tracking-wide">HUB</span>
        </Link>
        <UserDropdown />
      </div>

      <div className="text-2xl mb-8 tracking-wide">User Details</div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-white/30 mb-8 max-w-4xl">
        <button 
          className={`pb-2 tracking-widest text-sm uppercase ${activeTab === 'profile' ? 'border-b-2 border-white font-bold' : 'text-gray-400 hover:text-white transition-colors'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`pb-2 tracking-widest text-sm uppercase ${activeTab === 'settings' ? 'border-b-2 border-white font-bold' : 'text-gray-400 hover:text-white transition-colors'}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Content Area */}
      <div className="w-full max-w-4xl flex-grow">
        {activeTab === 'profile' ? (
          <div className="flex flex-col gap-6 w-full max-w-xl">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 uppercase tracking-widest">Full Name</label>
              <input type="text" defaultValue="Mr Wizard" className="bg-transparent border border-white/50 px-4 py-3 outline-none text-white focus:border-white transition-colors text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 uppercase tracking-widest">Email Address</label>
              <input type="email" defaultValue="wizard@bourbonhub.com" className="bg-transparent border border-white/50 px-4 py-3 outline-none text-white focus:border-white transition-colors text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 uppercase tracking-widest">Job Role</label>
              <input type="text" defaultValue="Lead Developer & Administrator" disabled className="bg-white/10 border border-white/30 px-4 py-3 outline-none text-gray-300 cursor-not-allowed text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 uppercase tracking-widest">Phone Number</label>
              <input type="tel" defaultValue="+52 55 1234 5678" className="bg-transparent border border-white/50 px-4 py-3 outline-none text-white focus:border-white transition-colors text-sm" />
            </div>
            <button className="border border-white px-8 py-3 font-bold hover:bg-white hover:text-black transition-colors w-fit mt-6 text-sm tracking-widest">
              SAVE CHANGES
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8 w-full max-w-xl mt-4">
            
            <div className="flex items-center justify-between border-b border-white/20 pb-6">
              <div>
                <div className="text-md font-bold tracking-wide">Email Notifications</div>
                <div className="text-sm text-gray-400 mt-1">Receive daily alerts regarding background scrape job statuses.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between border-b border-white/20 pb-6">
              <div>
                <div className="text-md font-bold tracking-wide">Default Media Storage</div>
                <div className="text-sm text-gray-400 mt-1">S3 Bucket (us-east-1) - Current utilization 109 GB.</div>
              </div>
              <button className="text-xs border border-white/50 px-4 py-2 hover:bg-white hover:text-black transition-colors tracking-widest uppercase font-bold">Manage</button>
            </div>

            <div className="flex items-center justify-between border-b border-white/20 pb-6">
              <div>
                <div className="text-md font-bold tracking-wide">Scraper Concurrency</div>
                <div className="text-sm text-gray-400 mt-1">Max simultaneous worker threads processing the queue.</div>
              </div>
              <select className="bg-black border border-white/50 px-3 py-2 text-sm outline-none cursor-pointer">
                <option>5 Workers</option>
                <option>10 Workers</option>
                <option defaultValue="true">20 Workers (App Max)</option>
              </select>
            </div>

            <button className="border border-white px-8 py-3 font-bold hover:bg-white hover:text-black transition-colors w-fit mt-4 text-sm tracking-widest">
              UPDATE SETTINGS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}