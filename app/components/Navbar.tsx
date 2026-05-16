"use client";

import { UserButton } from "@clerk/nextjs";
import { ShieldAlert, Trophy, User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-100 px-3 sm:px-4 py-3.5 mb-6">
      <div className="max-w-md mx-auto flex items-center justify-between gap-1">
        
        {/* BRAND LOGO: Sinks securely into place without expanding */}
        <Link href="/" className="flex items-center gap-1 group min-w-0 flex-shrink-0">
          <div className="bg-blue-600 p-1.5 rounded-xl group-hover:rotate-12 transition-transform flex-shrink-0">
            <ShieldAlert size={18} className="text-white" />
          </div>
          <span className="font-black text-base tracking-tighter text-slate-800 xs:text-lg sm:text-xl truncate">
            CIVICHERO
          </span>
        </Link>

        {/* LINKS AND AVATAR: Bundled in a structured container with fixed alignments */}
        <div className="flex items-center gap-3 xs:gap-4 flex-shrink-0">
          <Link 
            href="/leaderboard" 
            className="flex items-center justify-center p-1 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"
            title="Rankings"
          >
            <Trophy size={20} className="sm:hidden" />
            <span className="hidden sm:inline text-xs font-black uppercase tracking-widest">Rankings</span>
          </Link>
          
          <Link 
            href="/profile" 
            className="flex items-center justify-center p-1 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"
            title="Profile"
          >
            <User size={20} className="sm:hidden" />
            <span className="hidden sm:inline text-xs font-black uppercase tracking-widest">Profile</span>
          </Link>
          
          {/* Clerk user portal wrapper with fixed dimensional spacing */}
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center ml-0.5">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
        
      </div>
    </nav>
  );
}