"use client";

import { useState, useEffect } from "react";
import { Share2, Link as LinkIcon, Send, MessageCircle, Check } from "lucide-react";

export default function ShareButton({ category }: { reportId: number, category: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => { setUrl(window.location.href); }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-6 border-y border-slate-100 my-4">
      <div className="flex items-center justify-between px-2">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Share Report</span>
        <div className="flex items-center gap-2">
          {/* WhatsApp Icon Circle */}
          <a href={`https://wa.me/?text=Check this out: ${url}`} className="p-3 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
            <MessageCircle size={20} />
          </a>
          {/* X Icon Circle */}
          <a href={`https://twitter.com/intent/tweet?url=${url}`} className="p-3 rounded-full bg-slate-900 text-white hover:bg-black transition-colors">
            <Send size={18} />
          </a>
          {/* Copy Link Pill */}
          <button onClick={copyLink} className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {copied ? <Check size={16} /> : <LinkIcon size={16} />}
            {copied ? 'Copied' : 'Link'}
          </button>
        </div>
      </div>
    </div>
  );
}