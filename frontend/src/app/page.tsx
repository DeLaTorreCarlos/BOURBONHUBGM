"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchFromAPI } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [liquidHeight, setLiquidHeight] = useState('h-0');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);

    try {
      // Post auth logic
      const response = await fetchFromAPI('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.message) {
        throw new Error("Invalid response");
      }

      setIsLoggingIn(true);
      
      // Store JWT token locally
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
      }
      
      if (response.user.role === 'superadmin') {
        setIsSuperadmin(true);
        localStorage.setItem('userRole', 'superadmin');
        localStorage.setItem('userName', response.user.full_name || response.user.email);
        
        // Wait longer for the giant rabbit animation to complete
        setTimeout(() => {
          router.push('/dashboard');
        }, 3600);
      } else {
        localStorage.setItem('userRole', response.user.role || 'user');
        localStorage.setItem('userName', response.user.full_name || response.user.email);
        
        // Start the pouring animation after a tiny delay so CSS transitions trigger correctly
        setTimeout(() => {
          setLiquidHeight('h-[85%]');
        }, 100);

        // Redirect to dashboard right as the glass fills up
        setTimeout(() => {
          router.push('/dashboard');
        }, 2200);
      }

    } catch (err: unknown) {
      setError("Invalid username or password");
    }
  };

  if (isLoggingIn) {
    if (isSuperadmin) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-sans p-4 relative overflow-hidden">
          <div className="mb-12 flex flex-col items-center gap-4 animate-pulse">
            <span className="text-3xl font-serif tracking-widest text-white/80 text-center">MASTER OVERRIDE</span>
            <span className="text-xl tracking-widest text-[#c95a00]">Initializing Superadmin Protocols...</span>
          </div>

          {/* Giant Rabbit SVG Animation */}
          <div className="relative w-[86rem] h-[86rem] animate-[bounce_1.5s_ease-in-out_infinite] mt-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-white drop-shadow-[0_0_35px_rgba(201,90,0,1)] rotate-180">
              {/* Ears */}
              <path d="M13 16a3 3 0 0 1 2.24 5c-2.47-2.37-1.07-4.14-1.07-4.14A1.9 1.9 0 0 0 13 16Z" />
              <path d="M11 16a3 3 0 0 0-2.24 5c2.47-2.37 1.07-4.14 1.07-4.14A1.9 1.9 0 0 1 11 16Z" />
              {/* Head Outline */}
              <path d="M12 16a4 4 0 0 0 4-4 4 4 0 0 0-4-4 4 4 0 0 0-4 4 4 4 0 0 0 4 4Z" />
              {/* Eyes */}
              <circle cx="10" cy="11" r="0.5" fill="currentColor" />
              <circle cx="14" cy="11" r="0.5" fill="currentColor" />
            </svg>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-sans p-4 relative">
        
        <div className="mb-12 flex items-center gap-4 animate-pulse">
          <span className="text-3xl font-serif tracking-widest text-white/50">BOURBON</span>
        </div>

        {/* Whisky Glass Animation Container */}
        <div className="relative w-40 h-52 border-[6px] border-t-0 border-white rounded-b-2xl overflow-hidden flex items-end">
          
          {/* Liquid Pouring */}
          <div className={`w-full bg-[#c95a00] opacity-80 ${liquidHeight} transition-all duration-[2000ms] ease-out relative`}>
            
            {/* Ice Cubes floating inside liquid */}
            <div className="absolute -top-4 left-4 w-12 h-12 bg-white/40 border-2 border-white/60 rounded-md rotate-[15deg] animate-[bounce_3s_ease-in-out_infinite]"></div>
            <div className="absolute top-8 right-3 w-14 h-14 bg-white/30 border-2 border-white/50 rounded-md -rotate-[22deg] animate-[bounce_3.5s_ease-in-out_infinite] delay-150"></div>
            <div className="absolute top-24 left-6 w-12 h-12 bg-white/20 border-2 border-white/40 rounded-md rotate-[45deg] animate-[bounce_4s_ease-in-out_infinite] delay-[300ms]"></div>
            
            {/* Liquid Surface highlight */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/40"></div>
          </div>
        </div>

        <div className="mt-8 tracking-widest text-sm text-white font-bold uppercase animate-pulse">
          Pouring Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-sans p-4">
      <div className="mb-16 flex items-center gap-4">
        <span className="text-5xl font-serif tracking-widest">BOURBON</span>
        <span className="text-5xl font-bold tracking-wide">HUB</span>
      </div>
      <form className="w-full max-w-sm flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="USERNAME" 
          className="bg-transparent border border-white px-4 py-3 outline-none text-white placeholder-white text-sm tracking-widest" 
        />
        <div className="relative flex w-full">
          <input 
            type={showPassword ? "text" : "password"} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PASSWORD" 
            className="w-full bg-transparent border border-white px-4 py-3 outline-none text-white placeholder-white text-sm tracking-widest" 
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-xs tracking-widest font-bold"
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        </div>
        {error && <div className="text-red-500 text-sm font-bold text-center">{error}</div>}
        <div className="flex justify-center mt-6">
          <button 
            onClick={handleLogin} 
            className="border border-white px-12 py-3 font-bold hover:bg-white hover:text-black transition-colors text-sm tracking-widest"
          >
            LOGIN
          </button>
        </div>
      </form>
    </div>
  );
}