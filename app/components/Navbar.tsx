"use client";

import { UserButton } from "@clerk/nextjs";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-100 px-4 py-4 mb-6">
            <div className="max-w-md mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-blue-600 p-1.5 rounded-xl group-hover:rotate-12 transition-transform">
                        <ShieldAlert size={20} className="text-white" />
                    </div>
                    <span className="font-black text-xl tracking-tighter text-slate-800">CIVICHERO</span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/leaderboard" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                        Rankings
                    </Link>
                    <Link href="/profile" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                        Profile
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </nav>
    );
}