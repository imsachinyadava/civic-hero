"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Loader2, User } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface Comment {
  id: number;
  user_id: string;
  text: string;
  created_at: string;
}

export default function CommentSection({ reportId }: { reportId: number }) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [reportId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/reports/${reportId}/comments`);
      const data = await res.json();
      if (res.ok) setComments(data.comments);
    } catch (error) {
      console.error("Failed to load comments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setPosting(true);
    try {
      const res = await fetch(`/api/reports/${reportId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setComments([...comments, data.comment]);
        setNewComment(""); 
      }
    } catch (error) {
      console.error("Failed to post", error);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mt-8 border-t border-slate-200/60 pt-8 pb-4">
      <h3 className="font-extrabold text-slate-800 flex items-center mb-6 tracking-tight text-xl">
        <MessageSquare className="mr-2.5 text-blue-600" size={22} fill="currentColor" fillOpacity={0.2} />
        Community Discussion
      </h3>

      {/* --- THE CHAT THREAD --- */}
      <div className="space-y-4 mb-6">
        {loading ? (
          <div className="text-center py-8 text-slate-400 animate-pulse font-medium">Loading discussion...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/50 rounded-3xl border border-slate-100/80 text-slate-500 font-medium shadow-inner">
            No comments yet. Be the first to spark the conversation!
          </div>
        ) : (
          comments.map((c) => {
            const isMe = c.user_id === user?.id;
            
            return (
              <div 
                key={c.id} 
                className={`flex space-x-4 p-5 rounded-3xl border transition-all hover:shadow-md ${
                  isMe 
                    ? 'bg-blue-50/30 border-blue-100/50 shadow-[0_4px_20px_rgb(59,130,246,0.03)]' 
                    : 'bg-white border-slate-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)]'
                }`}
              >
                {/* Premium Avatar */}
                <div className={`h-11 w-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner ${
                  isMe 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  <User size={20} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className={`font-bold text-[15px] ${isMe ? 'text-blue-900' : 'text-slate-800'}`}>
                      {isMe ? "You" : "Neighbor"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-md">
                      {new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[15px] leading-relaxed break-words">{c.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- THE INPUT BOX --- */}
      {user ? (
        <form onSubmit={handleSubmit} className="relative group mt-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your voice to the discussion..."
            className="w-full bg-white border-2 border-slate-100 rounded-full pl-6 pr-16 py-4 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all font-medium text-slate-700 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={posting || !newComment.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-200 disabled:to-slate-300 text-white rounded-full shadow-md transition-all duration-200 active:scale-90 disabled:shadow-none disabled:active:scale-100 group-focus-within:shadow-lg"
          >
            {posting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
          </button>
        </form>
      ) : (
        <div className="text-center py-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-slate-500 text-sm font-semibold shadow-inner mt-2">
          Sign in to join the discussion.
        </div>
      )}
    </div>
  );
}