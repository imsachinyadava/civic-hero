import { getLeaderboard } from "../actions/getLeaderboard";
import { Medal, Crown, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import LeaderboardHeader from "../components/LeaderboardHeader";

export default async function LeaderboardPage() {
  const topUsers = await getLeaderboard();

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <div className="max-w-md mx-auto px-6">
        {/* NEW: DYNAMIC HEADER */}
        <LeaderboardHeader />

        <div className="space-y-3">
          {topUsers.map((user, index) => {
            const isTop3 = index < 3;
            const RankIcon = index === 0 ? Crown : index === 1 ? Medal : index === 2 ? Medal : null;
            const rankColor = 
              index === 0 ? "text-amber-500" : 
              index === 1 ? "text-slate-400" : 
              index === 2 ? "text-amber-700" : 
              "text-slate-300";

            return (
              <div 
                key={user.id}
                className={`flex items-center justify-between p-4 rounded-[24px] border transition-all duration-300 ${
                  isTop3 
                    ? "bg-white border-slate-200 shadow-md scale-[1.02] ring-1 ring-slate-100" 
                    : "bg-white/60 border-transparent hover:bg-white hover:border-slate-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className={`text-lg font-black w-6 inline-block ${rankColor}`}>
                      {index + 1}
                    </span>
                    {RankIcon && (
                      <RankIcon size={14} className={`absolute -top-3 -left-1 ${rankColor}`} />
                    )}
                  </div>
                  
                  <img 
                    src={user.avatar_url} 
                    alt={user.full_name} 
                    className={`w-12 h-12 rounded-2xl object-cover shadow-sm ${isTop3 ? "ring-2 ring-blue-500/10" : ""}`} 
                  />
                  
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm truncate max-w-[120px]">
                      {user.full_name}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {index === 0 ? "Grand Hero" : "Civic Hero"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl shadow-inner">
                  <Zap size={14} className="text-amber-500" fill="currentColor" />
                  <span className="font-black text-slate-700 text-sm">{user.points}</span>
                </div>
              </div>
            );
          })}
        </div>

        {topUsers.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No heroes in this sector yet</p>
          </div>
        )}
      </div>
    </main>
  );
}