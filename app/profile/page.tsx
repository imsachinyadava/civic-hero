"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { syncProfile } from "../actions/syncProfile";
import { Award, MapPin, CheckCircle, Clock, ChevronRight, Zap, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const [dbProfile, setDbProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const profile = await syncProfile();
      setDbProfile(profile);
      setLoading(false);
    }
    if (user) loadProfile();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-100 pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-5">
            <img src={user.imageUrl} className="w-24 h-24 rounded-[32px] object-cover shadow-xl" alt="Profile" />
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">{user.fullName}</h1>
              <p className="text-slate-500 font-bold text-sm flex items-center mt-1">
                <MapPin size={14} className="mr-1 text-blue-500" /> Varanasi, India
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8">
             {/* REAL POINTS FROM DB */}
            <div className="bg-amber-50 rounded-3xl p-4 flex flex-col items-center text-center">
              <Zap className="text-amber-500 mb-2" size={20} />
              <span className="block text-lg font-black text-slate-800">{dbProfile?.points || 0}</span>
              <span className="block text-[10px] font-black text-slate-400 uppercase mt-1">Points</span>
            </div>
            {/* These can be mapped to real counts later */}
            <div className="bg-emerald-50 rounded-3xl p-4 flex flex-col items-center text-center">
              <CheckCircle className="text-emerald-500 mb-2" size={20} />
              <span className="block text-lg font-black text-slate-800">0</span>
              <span className="block text-[10px] font-black text-slate-400 uppercase mt-1">Fixed</span>
            </div>
            <div className="bg-blue-50 rounded-3xl p-4 flex flex-col items-center text-center">
              <Award className="text-blue-500 mb-2" size={20} />
              <span className="block text-lg font-black text-slate-800">Hero</span>
              <span className="block text-[10px] font-black text-slate-400 uppercase mt-1">Rank</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity list here... */}
    </main>
  );
}