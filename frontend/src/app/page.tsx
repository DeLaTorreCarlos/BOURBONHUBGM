"use client";

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-sans p-4">
      <div className="mb-16 flex items-center gap-4">
        <span className="text-5xl font-serif tracking-widest">BOURBON</span>
        <span className="text-5xl font-bold tracking-wide">HUB</span>
      </div>
      <form className="w-full max-w-sm flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <input 
          type="text" 
          placeholder="USERNAME" 
          className="bg-transparent border border-white px-4 py-3 outline-none text-white placeholder-white text-sm tracking-widest" 
        />
        <input 
          type="password" 
          placeholder="PASSWORD" 
          className="bg-transparent border border-white px-4 py-3 outline-none text-white placeholder-white text-sm tracking-widest" 
        />
        <div className="flex justify-center mt-6">
          <Link href="/dashboard" className="border border-white px-12 py-3 font-bold hover:bg-white hover:text-black transition-colors text-sm tracking-widest">
            LOGIN
          </Link>
        </div>
      </form>
    </div>
  );
}