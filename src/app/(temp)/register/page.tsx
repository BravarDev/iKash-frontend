"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

function RegisterWaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      const payload = { email };
      console.log("Waitlist payload:", payload);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/users/early-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('There was an error registering your email. Please try again.');
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center text-center space-y-8 animate-[fadeInUp_0.6s_ease-out_forwards]">
      <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-[#BCED09]/20 to-[#BCED09]/5 border border-[#BCED09]/20 flex items-center justify-center text-[#BCED09] mb-2 shadow-[0_0_30px_rgba(188,237,9,0.15)]">
        <Mail className="w-12 h-12" />
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
          Mainnet is <br className="md:hidden" /> <span className="text-[#BCED09]">Coming Soon</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto font-light">
          Our application is currently in development and only accepts Testnet accounts for live usage. 
          If you want to show your interest in the project and wait for its release, add your email to our waitlist and we will reach out to you when the app is ready for general usage.
        </p>
      </div>

      {submitted ? (
        <div className="w-full max-w-md bg-[#BCED09]/10 border border-[#BCED09]/30 rounded-2xl p-8 flex flex-col items-center space-y-4 animate-[fadeInUp_0.4s_ease-out_forwards]">
          <div className="w-14 h-14 rounded-full bg-[#BCED09] flex items-center justify-center text-[#010308] shadow-[0_0_20px_rgba(188,237,9,0.4)]">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">You're on the list!</h3>
            <p className="text-gray-400 text-sm font-light">We'll notify you as soon as Mainnet goes live.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md relative flex flex-col space-y-4 mt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full bg-[#010308]/60 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-gray-500 text-lg focus:outline-none focus:border-[#BCED09] focus:ring-1 focus:ring-[#BCED09] transition-all"
          />
          <button
            type="submit"
            className="w-full px-8 py-5 bg-[#BCED09] text-[#010308] font-bold text-lg rounded-2xl shadow-[0_15px_30px_-10px_rgba(188,237,9,0.3)] hover:bg-[#a6d107] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
          >
            Join Waitlist
            <ArrowRight className="w-6 h-6" />
          </button>
        </form>
      )}
    </div>
  );
}

export default function RegisterWaitlistPage() {
  return (
    <div className="min-h-screen bg-[#010308] text-white flex flex-col font-sans overflow-x-hidden selection:bg-[#BCED09] selection:text-[#010308] relative">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#BCED09] filter blur-[180px] opacity-10 animate-pulse" style={{ animationDuration: "8s" }} />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#BCED09] filter blur-[180px] opacity-10 animate-pulse" style={{ animationDelay: "2s", animationDuration: "10s" }} />
      </div>

      {/* Header */}
      <header className="w-full px-6 py-8 flex items-center justify-between z-10 relative max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/icono-ikash.svg"
            alt="iKa$h Logo"
            width={42}
            height={42}
            className="group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-2xl font-black tracking-tighter text-white">
            iKa$h
          </span>
        </Link>
        <Link href="/" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
          Return to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 z-10 relative">
        <div className="max-w-2xl w-full bg-[#18181b]/40 backdrop-blur-xl border border-[#ffffff05] rounded-[40px] p-10 md:p-16 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full h-48 bg-gradient-to-b from-[#BCED09]/20 to-transparent filter blur-[60px] pointer-events-none" />

          <RegisterWaitlistForm />
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}