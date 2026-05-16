"use client";

import { useState } from "react";
import { ShieldAlert, Send, Mail, Check, Copy } from "lucide-react";

const AUTHORITY_MAP: Record<string, { twitter: string; dept: string; email: string }> = {
  pothole: { twitter: "MNNagarNigam", dept: "Public Works Dept", email: "pwd@municipality.gov" },
  garbage: { twitter: "SwachhBharatGov", dept: "Sanitation Dept", email: "sanitation@municipality.gov" },
  street_light: { twitter: "UPPCLLKO", dept: "Electrical Dept", email: "electric@municipality.gov" },
  water_leak: { twitter: "jal_nigam", dept: "Jal Sansthan", email: "water@municipality.gov" },
  vandalism: { twitter: "Uppolice", dept: "City Police", email: "police@municipality.gov" },
};

export default function PingAuthority({ category, reportId }: { category: string; reportId: number }) {
  const [copied, setCopied] = useState(false);
  
  const info = AUTHORITY_MAP[category as keyof typeof AUTHORITY_MAP] || { 
    twitter: "MNNagarNigam", 
    dept: "Municipal Corp", 
    email: "admin@municipality.gov" 
  };

  const reportUrl = typeof window !== "undefined" ? `${window.location.origin}/report/${reportId}` : "";
  const message = `🚨 OFFICIAL ALERT: A civic issue (${category.replace('_', ' ')}) has been reported and verified by the community. \n\nDetails: ${reportUrl} \n\n@${info.twitter}`;

  const handleTwitterPing = () => {
    const xUrl = `https://x.com/intent/post?text=${encodeURIComponent(message)}`;
    window.open(xUrl, "_blank");
  };

  const handleEmailPing = () => {
    const mailtoUrl = `mailto:${info.email}?subject=Urgent: ${category} Report #${reportId}&body=${encodeURIComponent(message)}`;
    
    // Try to open the system mail app
    window.location.href = mailtoUrl;

    // Immediate feedback so the user knows what happened
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm mb-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-50 rounded-2xl">
            <ShieldAlert className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 tracking-tight">Escalate Issue</h3>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Contact {info.dept}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleTwitterPing}
          className="flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
        >
          <Send size={14} /> PING ON X
        </button>

        <button 
          onClick={handleEmailPing}
          className={`flex items-center justify-center gap-2 border-2 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all active:scale-95 ${
            copied ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {copied ? <Check size={14} /> : <Mail size={14} />}
          {copied ? 'OPENING...' : 'EMAIL DEPT'}
        </button>
      </div>
      
      {copied && (
        <p className="text-center text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-tighter">
          Opening your email app...
        </p>
      )}
    </div>
  );
}